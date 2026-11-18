from contextlib import contextmanager
from contextvars import ContextVar


class TenantNotSetError(RuntimeError):
    pass


class CrossTenantWriteError(ValueError):
    pass


_current_tenant = ContextVar("current_tenant", default=None)


def tenant_id():
    value = _current_tenant.get()
    if value is None:
        raise TenantNotSetError("A verified tenant context is required")
    return value


@contextmanager
def tenant_scope(value):
    if value is None:
        raise TenantNotSetError("Cannot establish an empty tenant context")
    token = _current_tenant.set(value)
    try:
        yield
    finally:
        _current_tenant.reset(token)
