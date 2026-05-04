---
title: "Part 6: Django REST Framework basics"
description: Expose Django models as a JSON API. Serializers, ViewSets, routers, authentication, permissions, and pagination, the 80% that powers most REST backends.
parent: django
tags: [django, drf, api, rest, intermediate]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## Install

```bash
pip install djangorestframework
```

Add `"rest_framework"` to `INSTALLED_APPS` and at minimum configure defaults:

```python
# settings.py
REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
        "rest_framework.authentication.TokenAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_PAGINATION_CLASS":
        "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 25,
}
```

## Serializers, the ORM ↔ JSON boundary

A serializer turns model instances into JSON (and validated JSON back into model instances).

```python
# blog/serializers.py
from rest_framework import serializers
from .models import Post, Tag

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]

class PostSerializer(serializers.ModelSerializer):
    author = serializers.ReadOnlyField(source="author.username")
    tags   = TagSerializer(many=True, read_only=True)
    tag_ids = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True,
        write_only=True, source="tags",
    )

    class Meta:
        model  = Post
        fields = ["id", "author", "title", "slug", "body",
                  "tags", "tag_ids", "published_at"]
        read_only_fields = ["id", "slug", "published_at"]
```

Two patterns shown:

- **`ReadOnlyField(source="author.username")`**, flatten a nested attribute.
- **Separate read/write for relations**, read nested (`tags`), write by PK (`tag_ids`). Cleaner than nested write, which DRF deliberately makes awkward.

## ViewSets and routers

```python
# blog/api_views.py
from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Post
from .serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.select_related("author").prefetch_related("tags")
    serializer_class = PostSerializer

    def get_permissions(self):
        if self.action in {"list", "retrieve"}:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=["post"])
    def publish(self, request, pk=None):
        from django.utils import timezone
        post = self.get_object()
        post.published_at = timezone.now()
        post.save()
        return Response({"status": "published"})
```

Wire the router:

```python
# mysite/urls.py
from django.urls import include, path
from rest_framework.routers import DefaultRouter
from blog.api_views import PostViewSet

router = DefaultRouter()
router.register(r"posts", PostViewSet, basename="post")

urlpatterns = [
    path("api/", include(router.urls)),
]
```

That registers:

| Method | URL | Action |
| --- | --- | --- |
| GET | `/api/posts/` | `list` |
| POST | `/api/posts/` | `create` |
| GET | `/api/posts/{pk}/` | `retrieve` |
| PUT | `/api/posts/{pk}/` | `update` |
| PATCH | `/api/posts/{pk}/` | `partial_update` |
| DELETE | `/api/posts/{pk}/` | `destroy` |
| POST | `/api/posts/{pk}/publish/` | custom `@action` |

## Authentication choices

- **SessionAuthentication**, browser sessions; pairs with Django auth, respects CSRF.
- **TokenAuthentication**, a long-lived opaque token stored in the DB, sent as `Authorization: Token <key>`.
- **JWT** (via [`djangorestframework-simplejwt`](https://github.com/jazzband/djangorestframework-simplejwt)), short-lived access tokens, long-lived refresh tokens, no DB lookup per request.

For mobile/SPA backends, JWT with simplejwt is the common choice.

## Permissions

Built-in classes:

- `AllowAny`, `IsAuthenticated`, `IsAdminUser`, `IsAuthenticatedOrReadOnly`.
- `DjangoModelPermissions`, maps HTTP methods to Django's `add_/change_/delete_/view_` permissions.
- `DjangoObjectPermissions`, object-level (requires a backend like guardian).

Custom permission:

```python
class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user
```

## Filtering, searching, ordering

```bash
pip install django-filter
```

```python
# blog/api_views.py
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters

class PostViewSet(viewsets.ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["author", "published_at"]
    search_fields = ["title", "body"]
    ordering_fields = ["published_at", "title"]
```

Now `/api/posts/?author=3&search=django&ordering=-published_at` works out of the box.

## Pagination

`PageNumberPagination` (shown above) returns:

```json
{
  "count": 317,
  "next": "http://api.example.com/posts/?page=3",
  "previous": "http://api.example.com/posts/?page=1",
  "results": [ ... ]
}
```

For large lists, consider `CursorPagination`, uses an opaque cursor, stable under concurrent writes.

## Nested and related data

The serializer example above does lists via `select_related` / `prefetch_related` in the viewset. **This matters**, the default DRF pattern N+1's the database fast:

```python
# BAD: N+1 query on every post
queryset = Post.objects.all()

# GOOD: one query for posts + one for authors + one for tags
queryset = Post.objects.select_related("author").prefetch_related("tags")
```

Part 7 dives deeper.

## OpenAPI / schema generation

DRF ships a schema generator. For full OpenAPI with nice UI:

```bash
pip install drf-spectacular
```

```python
# settings.py
INSTALLED_APPS += ["drf_spectacular"]
REST_FRAMEWORK["DEFAULT_SCHEMA_CLASS"] = "drf_spectacular.openapi.AutoSchema"
```

```python
# urls.py
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

urlpatterns += [
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/docs/",   SpectacularSwaggerView.as_view(url_name="schema"), name="docs"),
]
```

You get an interactive Swagger UI at `/api/docs/` generated from your serializers and viewsets.

## Gotchas

- **`ModelSerializer.create()` does not write M2M relations** if you pass `commit=False` through it, use `perform_create` to handle.
- **Nested writes are intentionally painful.** DRF doesn't want you mutating multiple tables through one endpoint. Either use split read/write fields (above) or write `create()`/`update()` methods explicitly.
- **Browsable API in production**, DRF's default HTML-rendered browsable API is a dev luxury; disable in production by removing `BrowsableAPIRenderer` from `DEFAULT_RENDERER_CLASSES`.
- **Throttling**, DRF has `AnonRateThrottle` and `UserRateThrottle` but they're opt-in. For serious protection, use nginx/Cloudflare rate limiting in addition.
- **Versioning**, decide your scheme (URL path, header, query param) *before* shipping. Changing later is painful for clients.

## What's next

Part 7 goes deep on the ORM, `select_related`, `prefetch_related`, `Q`/`F`, subqueries, aggregation.

## References

- [Django REST Framework docs](https://www.django-rest-framework.org/)
- [drf-spectacular](https://drf-spectacular.readthedocs.io/), OpenAPI schema generator
- [django-filter](https://django-filter.readthedocs.io/), filter backend
- [django-rest-framework-simplejwt](https://django-rest-framework-simplejwt.readthedocs.io/), JWT auth
