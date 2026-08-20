from django.conf import settings
from django.db import models


class Test(models.Model):
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_tests",
    )

    title = models.CharField(max_length=200)

    class_number = models.PositiveIntegerField()

    access_code = models.CharField(max_length=50, unique=True)

    test_file = models.FileField(upload_to="tests/")

    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - Class {self.class_number}"