from django.contrib import admin

from .models import Test


@admin.register(Test)
class TestAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "teacher",
        "class_number",
        "access_code",
        "is_active",
        "created_at",
    )

    list_filter = (
        "class_number",
        "is_active",
    )

    search_fields = (
        "title",
        "access_code",
    )