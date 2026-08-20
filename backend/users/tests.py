from django.test import TestCase
from rest_framework.test import APIClient

from .models import User


class AuthenticationAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.registration_data = {
            "name": "Ada Lovelace",
            "email": "ADA@EXAMPLE.COM",
            "phone": "9000000000",
            "password": "A-secure-password-123",
            "role": "student",
        }

    def test_registers_a_non_admin_user(self):
        response = self.client.post(
            "/api/auth/register/",
            self.registration_data,
        )

        self.assertEqual(response.status_code, 201)

        user = User.objects.get(email="ada@example.com")

        self.assertTrue(
            user.check_password(self.registration_data["password"])
        )
        self.assertEqual(user.username, user.email)

    def test_rejects_admin_self_registration(self):
        response = self.client.post(
            "/api/auth/register/",
            {
                **self.registration_data,
                "role": "admin",
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertFalse(
            User.objects.filter(
                email__iexact="ada@example.com"
            ).exists()
        )

    def test_login_is_case_insensitive_and_returns_jwt(self):
        user = User.objects.create_user(
            username="ada@example.com",
            email="ada@example.com",
            name="Ada Lovelace",
            phone="9000000000",
            role="student",
            password="A-secure-password-123",
        )

        response = self.client.post(
            "/api/auth/login/",
            {
                "email": "ADA@EXAMPLE.COM",
                "password": "A-secure-password-123",
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["user"]["id"], user.id)
        self.assertEqual(response.data["user"]["role"], "student")
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)