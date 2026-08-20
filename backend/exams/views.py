from typing import ClassVar

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import TestSerializer


class TestCreateView(APIView):
    permission_classes: ClassVar[list] = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "teacher":
            return Response(
                {"error": "Only teachers can create tests."},
                status=status.HTTP_403_FORBIDDEN,
            )

        serializer = TestSerializer(data=request.data)

        if serializer.is_valid():
            test = serializer.save(teacher=request.user)

            return Response(
                {
                    "message": "Test created successfully",
                    "test_id": test.id,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )