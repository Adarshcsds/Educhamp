from django.contrib import admin

from .models import QuestionAttempt, StudentProgress

admin.site.register(QuestionAttempt)
admin.site.register(StudentProgress)
