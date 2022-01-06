from django.conf import settings
from django.db import models


class Instruction(models.Model):
    user            = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    markid          = models.IntegerField()
    title           = models.CharField(max_length=120)
    content         = models.TextField()
    updated         = models.DateTimeField(auto_now=True, auto_now_add=False)
    timestamp       = models.DateTimeField(auto_now=False, auto_now_add=True)

    def __str__(self):
        return self.title
    
    class Meta:
        ordering = ["-timestamp", "-updated"]