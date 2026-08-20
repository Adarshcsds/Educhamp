from typing import ClassVar

from rest_framework import serializers

from .models import Test


class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Test
        fields: ClassVar[list[str]] = [
            "id",
            "teacher",
            "title",
            "class_number",
            "access_code",
            "test_file",
            "is_active",
            "created_at",
        ]
        read_only_fields: ClassVar[list[str]] = [
            "id",
            "teacher",
            "created_at",
        ]