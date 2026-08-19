from typing import ClassVar

from rest_framework import serializers

from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields: ClassVar[list[str]] = [
            "name",
            "email",
            "phone",
            "password",
            "role",
        ]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["email"],
            email=validated_data["email"],
            password=validated_data["password"],
            name=validated_data["name"],
            phone=validated_data["phone"],
            role=validated_data["role"],
        )

        return user