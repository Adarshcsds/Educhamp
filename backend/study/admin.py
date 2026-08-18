from django.contrib import admin
from .models import QuestionSet, Question


admin.site.register(QuestionSet)
admin.site.register(Question)