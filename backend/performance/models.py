from django.conf import settings
from django.db import models


class QuestionAttempt(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="question_attempts",
    )

    question = models.ForeignKey(
        "study.Question", on_delete=models.CASCADE, related_name="attempts"
    )

    selected_answer = models.CharField(max_length=1)

    is_correct = models.BooleanField()

    time_taken = models.PositiveIntegerField(help_text="Time taken in seconds")

    attempted_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.name} - {self.question}"


class StudentProgress(models.Model):
    student = models.ForeignKey(
        settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="progress"
    )

    subject = models.ForeignKey(
        "courses.Subject", on_delete=models.CASCADE, related_name="student_progress"
    )

    questions_attempted = models.PositiveIntegerField(default=0)
    correct_answers = models.PositiveIntegerField(default=0)
    accuracy = models.FloatField(default=0)
    current_level = models.PositiveIntegerField(default=1)
    streak = models.PositiveIntegerField(default=0)

    def __str__(self):
        return f"{self.student.name} - {self.subject.name}"
