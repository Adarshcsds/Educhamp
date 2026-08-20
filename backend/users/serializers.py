from typing import ClassVar

from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers

from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    class Meta:
        model = User
        fields: ClassVar[list[str]] = [
            "name",
            "email",
            "phone",
            "password",
            "role",
        ]

    def validate_role(self, value):
        if value == "admin":
            raise serializers.ValidationError("Admin accounts cannot be self-registered.")
        return value

    def validate(self, attrs):
        email = attrs["email"].lower()
        validate_password(
            attrs["password"],
            User(
                username=email,
                email=email,
                name=attrs["name"],
                phone=attrs["phone"],
                role=attrs["role"],
            ),
        )
        attrs["email"] = email
        return attrs

    def create(self, validated_data):
        email = validated_data["email"].lower()
        return User.objects.create_user(
            username=email,
            email=email,
            **{key: value for key, value in validated_data.items() if key != "email"},
        )


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, trim_whitespace=False)

    def validate(self, attrs):
        email = attrs["email"].lower()
        password = attrs["password"]

        user = User.objects.filter(email__iexact=email).first()
        if user is None or not user.check_password(password):
            raise serializers.ValidationError("Invalid email or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")

        attrs["user"] = user
        return attrs
