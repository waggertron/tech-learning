---
title: "Part 4 — Forms and user input"
description: `Form` vs `ModelForm`, validation hooks (`clean_field`, `clean`), rendering, CSRF, and formsets. The boundary where your app meets user input.
parent: django
tags: [django, forms, validation, csrf]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## Why forms

Every web app that accepts input needs three things: parsing, validation, and rendering. Django's `Form` and `ModelForm` bundle all three.

## Plain `Form`

```python
# blog/forms.py
from django import forms

class ContactForm(forms.Form):
    name    = forms.CharField(max_length=100)
    email   = forms.EmailField()
    message = forms.CharField(widget=forms.Textarea, max_length=2000)

    def clean_email(self):
        email = self.cleaned_data["email"]
        if email.endswith("@example.com"):
            raise forms.ValidationError("example.com addresses are not allowed.")
        return email

    def clean(self):
        cleaned = super().clean()
        if cleaned.get("name", "") == cleaned.get("email", ""):
            raise forms.ValidationError("Name and email can't be identical.")
        return cleaned
```

Two validation hooks:

- **`clean_<field>`** runs per field and returns the cleaned value (or raises).
- **`clean`** runs once across all fields — the place for cross-field validation.

## The view pattern

```python
from django.shortcuts import redirect, render
from .forms import ContactForm

def contact(request):
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            # form.cleaned_data is a dict of validated values
            send_message(**form.cleaned_data)
            return redirect("contact_thanks")
    else:
        form = ContactForm()
    return render(request, "blog/contact.html", {"form": form})
```

The **POST-redirect-GET** pattern is important. A successful POST should respond with a redirect, not an HTML page — otherwise refreshing resubmits the form.

## `ModelForm`

When the form maps directly to a model, save the boilerplate:

```python
from django import forms
from .models import Post

class PostForm(forms.ModelForm):
    class Meta:
        model  = Post
        fields = ["title", "slug", "body", "tags"]
        widgets = {
            "body": forms.Textarea(attrs={"rows": 20}),
        }
```

In the view:

```python
def post_create(request):
    if request.method == "POST":
        form = PostForm(request.POST)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.save()
            form.save_m2m()   # because commit=False skipped many-to-many
            return redirect("blog:detail", slug=post.slug)
    else:
        form = PostForm()
    return render(request, "blog/post_form.html", {"form": form})
```

`commit=False` is a frequent pattern when you need to set fields not in the form (like `author`) before writing to the database.

## Rendering

```django
<form method="post">
  {% csrf_token %}

  {{ form.as_p }}   {# or .as_div (5.0+), .as_table, .as_ul #}

  <button type="submit">Submit</button>
</form>
```

For full control, render fields individually:

```django
<div>
  {{ form.title.label_tag }}
  {{ form.title }}
  {% if form.title.errors %}<p class="error">{{ form.title.errors.0 }}</p>{% endif %}
</div>
```

Django 5 ships `{{ form.as_div }}` as the default — friendly for modern CSS without needing a library.

## CSRF

`{% csrf_token %}` is **required** on every `<form method="post">`. Django's `CsrfViewMiddleware` rejects POSTs without it with a 403.

For AJAX, include the CSRF token in the `X-CSRFToken` header. Django exposes the token at `document.cookie` (`csrftoken`) by default.

## Formsets — many-at-once

When you need to edit a variable number of records in one form submission:

```python
from django.forms import inlineformset_factory
from .models import Author, Post

PostInline = inlineformset_factory(
    Author, Post,
    fields=["title", "body"],
    extra=2,              # 2 blank forms
    can_delete=True,
)

def author_edit(request, pk):
    author = Author.objects.get(pk=pk)
    if request.method == "POST":
        formset = PostInline(request.POST, instance=author)
        if formset.is_valid():
            formset.save()
            return redirect("author_detail", pk=pk)
    else:
        formset = PostInline(instance=author)
    return render(request, "blog/author_edit.html", {"formset": formset})
```

Formsets are powerful but their template rendering is verbose. If you find yourself fighting them, consider a JavaScript-driven UI posting JSON (covered in Part 6).

## Third-party helpers

- **[django-crispy-forms](https://github.com/django-crispy-forms/django-crispy-forms)** + a template pack (Bootstrap, Tailwind) — better rendering without hand-writing each field.
- **[django-widget-tweaks](https://github.com/jazzband/django-widget-tweaks)** — per-field CSS classes and attributes from the template (`{{ field|add_class:"input-lg" }}`).

## Gotchas

- **File uploads** — `<form enctype="multipart/form-data">` is required, and in the view you must pass `request.FILES` to the form: `PostForm(request.POST, request.FILES)`.
- **Initial data** — pass `initial={"title": "Draft"}` for pre-filled fields on `GET`.
- **Validation error on `__all__`** — `form.non_field_errors()` renders cross-field errors (those from `clean()`).
- **Boolean checkboxes on edit** — `required=False` is needed, or an unchecked box fails validation on an existing instance.
- **Deleted FK protection** — if your form references a `ForeignKey(on_delete=PROTECT)`, deleting a referenced row silently breaks submissions; catch and surface gracefully.

## What's next

Part 5 adds authentication, so the "who is submitting this form?" question has a first-class answer.

## References

- [Working with forms — Django docs](https://docs.djangoproject.com/en/5.2/topics/forms/)
- [ModelForm — Django docs](https://docs.djangoproject.com/en/5.2/topics/forms/modelforms/)
- [Formsets — Django docs](https://docs.djangoproject.com/en/5.2/topics/forms/formsets/)
- [CSRF protection](https://docs.djangoproject.com/en/5.2/howto/csrf/)
