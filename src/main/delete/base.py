# main/views/base.py

from rest_framework.viewsets import ViewSet, ModelViewSet
from rest_framework.permissions import IsAuthenticated

class BaseNextJsViewSet(ModelViewSet):
    """
    Base ViewSet to unify logic shared with Next.js views.
    - Adds IsAuthenticated by default
    - Can inject shared context, error handling, logging, etc.
    """
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context