from django.db import models


class QuestionSet(models.Model):
    module = models.ForeignKey(
        "courses.Module",
        on_delete=models.CASCADE,
        related_name="question_sets"
    )
    set_number = models.PositiveIntegerField()

    def __str__(self):
        return f"{self.module.name} - Set {self.set_number}"

class Question(models.Model):
    DIFFICULTY_CHOICES = (
        ("easy", "Easy"),
        ("medium", "Medium"),
        ("hard", "Hard"),
    )

    question_set = models.ForeignKey(
        QuestionSet,
        on_delete=models.CASCADE,
        related_name="questions"
    )

    text = models.TextField()

    option_a = models.CharField(max_length=255)
    option_b = models.CharField(max_length=255)
    option_c = models.CharField(max_length=255)
    option_d = models.CharField(max_length=255)

    correct_answer = models.CharField(max_length=1)

    difficulty = models.CharField(
        max_length=10,
        choices=DIFFICULTY_CHOICES
    )

    explanation = models.TextField(blank=True)

    def __str__(self):
        return self.text[:50]    