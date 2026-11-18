from django.db import models

from .context import CrossTenantWriteError, tenant_id


class Tenant(models.Model):
    name = models.CharField(max_length=100)


class TenantQuerySet(models.QuerySet):
    def update(self, **kwargs):
        tenant_id()
        if set(kwargs) - {"name", "status"}:
            raise CrossTenantWriteError("Only non-ownership fields can be updated in bulk")
        return super().update(**kwargs)

    def bulk_create(self, objs, **kwargs):
        if kwargs.get("update_conflicts") or kwargs.get("ignore_conflicts"):
            raise CrossTenantWriteError("Conflict-handling bulk inserts are not supported")
        objs = list(objs)
        for obj in objs:
            obj.prepare_tenant_write()
        return super().bulk_create(objs, **kwargs)

    def bulk_update(self, objs, fields, **kwargs):
        raise CrossTenantWriteError("bulk_update is outside this specimen's supported write API")


class TenantScopedManager(models.Manager.from_queryset(TenantQuerySet)):
    def get_queryset(self):
        return super().get_queryset().filter(tenant_id=tenant_id())


class TenantScopedModel(models.Model):
    tenant = models.ForeignKey(Tenant, on_delete=models.PROTECT)
    objects = TenantScopedManager()
    all_objects = models.Manager()

    def prepare_tenant_write(self):
        current = tenant_id()
        if self.tenant_id not in (None, current):
            raise CrossTenantWriteError("Row tenant differs from the active tenant")
        self.tenant_id = current
        if self.pk is not None:
            existing = type(self).all_objects.filter(pk=self.pk).values_list("tenant_id", flat=True).first()
            if existing is not None and existing != current:
                raise CrossTenantWriteError("Cannot overwrite another tenant's primary key")

    def save(self, *args, **kwargs):
        self.prepare_tenant_write()
        return super().save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        self.prepare_tenant_write()
        return super().delete(*args, **kwargs)

    class Meta:
        abstract = True
        default_manager_name = "objects"
        base_manager_name = "all_objects"


class Patient(TenantScopedModel):
    name = models.CharField(max_length=100)


class Visit(TenantScopedModel):
    patient = models.ForeignKey(Patient, on_delete=models.PROTECT, related_name="visits")
    status = models.CharField(max_length=20, default="scheduled")

    def prepare_tenant_write(self):
        super().prepare_tenant_write()
        owner = Patient.all_objects.filter(pk=self.patient_id).values_list("tenant_id", flat=True).first()
        if owner != self.tenant_id:
            raise CrossTenantWriteError("Patient must belong to the visit tenant")
