from django.db import models


class Subject(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Module(models.Model):
    subject = models.ForeignKey(
        Subject, on_delete=models.CASCADE, related_name="modules"
    )
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.subject.name} - {self.name}"
