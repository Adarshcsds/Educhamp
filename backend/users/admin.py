from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .models import User

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ("EduChamp profile", {"fields": ("name", "phone", "role")}),
    )
    add_fieldsets = UserAdmin.add_fieldsets + (
        ("EduChamp profile", {"fields": ("name", "email", "phone", "role")}),
    )
    list_display = ("email", "name", "phone", "role", "is_staff", "is_active")
    search_fields = ("email", "name", "phone")
    ordering = ("email",)
