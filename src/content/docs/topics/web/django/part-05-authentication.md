---
title: "Part 5 — Authentication and authorization"
description: Django's built-in auth system, the `User` model, login/logout views, permissions and groups, and when to customize the User model.
parent: django
tags: [django, auth, users, permissions, intermediate]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## What's in the box

`django.contrib.auth` ships with:

- A `User` model (username, email, password hash, first/last name, is_active, is_staff, is_superuser, date_joined)
- A password hasher (PBKDF2 by default, Argon2 if you install `argon2-cffi`)
- Login / logout / password-change / password-reset views
- `@login_required`, `@user_passes_test`, `@permission_required` decorators
- `AuthenticationMiddleware` that attaches `request.user` to every request
- A permissions model (per-model + per-object via third-party packages)

Enabled by default in the project template — you already have it.

## Logging a user in

The shortest route uses Django's built-in views:

```python
# mysite/urls.py
from django.contrib.auth import views as auth_views
from django.urls import include, path

urlpatterns = [
    path("accounts/", include("django.contrib.auth.urls")),  # login, logout, password_*
    # ...
]
```

That gives you: `/accounts/login/`, `/accounts/logout/`, `/accounts/password_change/`, `/accounts/password_reset/` etc. You provide the templates (they look in `registration/login.html` and friends).

Manual login (e.g., after sign-up):

```python
from django.contrib.auth import login, authenticate

def signup(request):
    form = SignupForm(request.POST or None)
    if request.method == "POST" and form.is_valid():
        user = form.save()
        login(request, user)   # sets the session cookie
        return redirect("blog:list")
    return render(request, "signup.html", {"form": form})
```

## Gating views

```python
from django.contrib.auth.decorators import login_required, permission_required

@login_required
def my_posts(request):
    return render(request, "my_posts.html",
                  {"posts": request.user.posts.all()})

@permission_required("blog.add_post", raise_exception=True)
def create_post(request):
    # ...
```

For class-based views, use mixins:

```python
from django.contrib.auth.mixins import LoginRequiredMixin, PermissionRequiredMixin

class PostCreateView(LoginRequiredMixin, PermissionRequiredMixin, CreateView):
    model = Post
    fields = ["title", "body"]
    permission_required = "blog.add_post"
```

`LOGIN_URL` in settings (default `/accounts/login/`) is where unauthenticated users get bounced to.

## Custom User model — do it on day one

A painful reality: swapping `User` *after* your first migration is hard. **Always define a custom User model before you `migrate` the first time**, even if it just subclasses `AbstractUser` with no changes.

```python
# accounts/models.py
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    # You'll want *something* here eventually — email uniqueness, avatar, etc.
    email = models.EmailField(unique=True)
```

```python
# settings.py
AUTH_USER_MODEL = "accounts.User"
```

And always reference the user model by this setting, not by importing `User`:

```python
from django.conf import settings
from django.db import models

class Post(models.Model):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="posts",
    )
```

### AbstractUser vs AbstractBaseUser

- **`AbstractUser`** — all the default User fields; just add yours. 90% of projects want this.
- **`AbstractBaseUser`** — a minimal skeleton (password + last_login). Use when you need a completely different identifier (e.g., email-only, no username).

## Permissions

Every model gets four default permissions: `add_<model>`, `change_<model>`, `delete_<model>`, `view_<model>` (e.g., `blog.add_post`).

Custom permissions:

```python
class Post(models.Model):
    # ...
    class Meta:
        permissions = [
            ("can_publish_post", "Can publish post"),
        ]
```

Check programmatically:

```python
if request.user.has_perm("blog.can_publish_post"):
    ...
```

**Groups** bundle permissions. Assign users to groups in the admin or programmatically:

```python
from django.contrib.auth.models import Group
editors = Group.objects.get(name="editors")
user.groups.add(editors)
```

### Object-level permissions

Model permissions are **per model**, not per row. "Alice can edit *her* posts" is not expressible in built-in auth. Options:

- **Check in the view** — `if post.author != request.user: raise PermissionDenied`.
- **[django-guardian](https://github.com/django-guardian/django-guardian)** — adds per-object permissions with `user.has_perm("blog.change_post", post_instance)`.

## The admin

`django.contrib.admin` uses the auth system — staff users see the admin, superusers see everything.

```python
# blog/admin.py
from django.contrib import admin
from .models import Post

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "published_at"]
    list_filter = ["published_at", "author"]
    search_fields = ["title", "body"]
    prepopulated_fields = {"slug": ("title",)}
```

Don't expose admin over the public internet without at least IP restrictions or VPN. It's an attractive target.

## Session vs. token auth

The default is **session-based**: login → set session cookie → every request re-reads the session. Works great for server-rendered HTML.

For APIs (covered in Part 6), you'll want **token auth** or **JWT** — Django REST Framework ships both.

## Password security

Defaults are reasonable:

- **Hasher**: PBKDF2 with SHA256, ~600k iterations in recent Django.
- **Validators** (`AUTH_PASSWORD_VALIDATORS`): length, common, numeric, similarity.

Upgrade to Argon2 for new projects:

```bash
pip install argon2-cffi
```

```python
PASSWORD_HASHERS = [
    "django.contrib.auth.hashers.Argon2PasswordHasher",
    "django.contrib.auth.hashers.PBKDF2PasswordHasher",   # keep as fallback
    # ...
]
```

## Gotchas

- **`is_authenticated` is a property** — `if request.user.is_authenticated:` not `.is_authenticated()`. It was a method in Django 1.x.
- **Password change invalidates sessions** — users must re-login after a password change. Use `update_session_auth_hash(request, user)` to keep them logged in.
- **Anonymous users still have `request.user`** — it's an `AnonymousUser` instance, not `None`. Always check `.is_authenticated`.
- **`authenticate()` returns `None` on failure, not an exception** — easy to forget the `if user is not None:` guard.
- **Email as username** — the built-in `User` uses `username` as the login field. Either write a custom auth backend or use a package like [django-allauth](https://github.com/pennersr/django-allauth), which also does social login.

## What's next

Part 6 exposes your app as an API using Django REST Framework.

## References

- [User authentication in Django](https://docs.djangoproject.com/en/5.2/topics/auth/)
- [Customizing authentication](https://docs.djangoproject.com/en/5.2/topics/auth/customizing/)
- [django-allauth](https://github.com/pennersr/django-allauth) — social + email auth
- [django-guardian](https://github.com/django-guardian/django-guardian) — object-level permissions
