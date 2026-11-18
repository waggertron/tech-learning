import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))

import django
from django.conf import settings

settings.configure(
    INSTALLED_APPS=["django.contrib.auth", "django.contrib.contenttypes", "django.contrib.admin", "tenancy_specimen"],
    DATABASES={"default": {"ENGINE": "django.db.backends.sqlite3", "NAME": ":memory:"}},
    DEFAULT_AUTO_FIELD="django.db.models.AutoField",
    SECRET_KEY="TEST_ONLY_NOT_A_CREDENTIAL",
)
django.setup()

from django.contrib.admin import ModelAdmin
from django.db import connection
from tenancy_specimen.context import CrossTenantWriteError, TenantNotSetError, tenant_id, tenant_scope
from tenancy_specimen.models import Patient, Tenant, Visit


class TenancyContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        with connection.schema_editor() as schema:
            for model in (Tenant, Patient, Visit):
                schema.create_model(model)

    @classmethod
    def tearDownClass(cls):
        with connection.schema_editor() as schema:
            for model in (Visit, Patient, Tenant):
                schema.delete_model(model)

    def setUp(self):
        Visit.all_objects.all().delete()
        Patient.all_objects.all().delete()
        Tenant.objects.all().delete()
        self.a = Tenant.objects.create(name="A")
        self.b = Tenant.objects.create(name="B")
        with tenant_scope(self.a.pk):
            self.pa = Patient.objects.create(name="A patient")
            self.va = Visit.objects.create(patient=self.pa)
        with tenant_scope(self.b.pk):
            self.pb = Patient.objects.create(name="B patient")
            self.vb = Visit.objects.create(patient=self.pb)

    def test_missing_context_raises_on_read_and_save(self):
        with self.assertRaises(TenantNotSetError):
            Patient.objects.count()
        with self.assertRaises(TenantNotSetError):
            Patient(name="unknown").save()

    def test_reads_and_queryset_updates_are_scoped(self):
        with tenant_scope(self.a.pk):
            self.assertEqual(list(Patient.objects.values_list("pk", flat=True)), [self.pa.pk])
            self.assertFalse(Visit.objects.filter(pk=self.vb.pk).exists())
            self.assertEqual(Visit.objects.filter(pk=self.vb.pk).update(status="done"), 0)
            self.assertEqual(Visit.objects.filter(pk=self.va.pk).update(status="done"), 1)
        self.assertEqual(Visit.all_objects.get(pk=self.vb.pk).status, "scheduled")

    def test_cross_tenant_writes_and_primary_key_overwrites_are_rejected(self):
        with tenant_scope(self.a.pk):
            with self.assertRaises(CrossTenantWriteError):
                Patient.objects.create(tenant=self.b, name="wrong")
            with self.assertRaises(CrossTenantWriteError):
                Patient(pk=self.pb.pk, tenant=self.a, name="overwrite").save()
            with self.assertRaises(CrossTenantWriteError):
                self.pb.delete()

    def test_relations_are_validated_for_supported_writes(self):
        with tenant_scope(self.a.pk):
            with self.assertRaises(CrossTenantWriteError):
                Visit.objects.create(patient=self.pb)
            with self.assertRaises(CrossTenantWriteError):
                Visit.objects.filter(pk=self.va.pk).update(patient_id=self.pb.pk)

    def test_bulk_paths_have_an_explicit_contract(self):
        with tenant_scope(self.a.pk):
            rows = Patient.objects.bulk_create([Patient(name="one"), Patient(name="two")])
            self.assertTrue(all(row.tenant_id == self.a.pk for row in rows))
            with self.assertRaises(CrossTenantWriteError):
                Patient.objects.bulk_create([Patient(tenant=self.b, name="wrong")])
            with self.assertRaises(CrossTenantWriteError):
                Patient.objects.update(tenant_id=self.b.pk)
            with self.assertRaises(CrossTenantWriteError):
                Patient.objects.bulk_update(rows, ["name"])

    def test_job_scope_and_nested_exception_cleanup(self):
        def job(owner):
            with tenant_scope(owner):
                return Patient.objects.count()
        self.assertEqual(job(self.a.pk), 1)
        with self.assertRaises(TenantNotSetError):
            tenant_id()
        with tenant_scope(self.a.pk):
            with self.assertRaisesRegex(RuntimeError, "failed"):
                with tenant_scope(self.b.pk):
                    raise RuntimeError("failed")
            self.assertEqual(tenant_id(), self.a.pk)
        with self.assertRaises(TenantNotSetError):
            tenant_id()

    def test_raw_sql_and_explicit_unscoped_manager_are_bypasses(self):
        with tenant_scope(self.a.pk):
            raw = Patient.objects.raw("SELECT * FROM tenancy_specimen_patient")
            self.assertEqual({row.tenant_id for row in raw}, {self.a.pk, self.b.pk})
            self.assertEqual(Patient.all_objects.count(), 2)
            with connection.cursor() as cursor:
                cursor.execute("SELECT COUNT(*) FROM tenancy_specimen_patient")
                self.assertEqual(cursor.fetchone()[0], 2)

    def test_join_and_forward_relation_do_not_inherit_patient_scope(self):
        # Deliberately create corrupt ownership using an explicit bypass.
        Visit.all_objects.filter(pk=self.va.pk).update(patient_id=self.pb.pk)
        with tenant_scope(self.a.pk):
            corrupt = Visit.objects.select_related("patient").get(pk=self.va.pk)
            self.assertEqual(corrupt.patient.tenant_id, self.b.pk)
            self.assertEqual(Visit.objects.filter(patient__name="B patient").count(), 1)

    def test_admin_default_manager_is_not_a_separate_security_boundary(self):
        admin = ModelAdmin(Patient, None)
        with self.assertRaises(TenantNotSetError):
            admin.get_queryset(None)
        with tenant_scope(self.a.pk):
            self.assertEqual(admin.get_queryset(None).count(), 1)
        # A custom admin can deliberately use all_objects, just like application code.
        self.assertEqual(Patient.all_objects.count(), 2)


if __name__ == "__main__":
    unittest.main()
