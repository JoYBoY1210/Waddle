from django.db import models
from django.contrib.auth.models import User
# Create your models here.

class Folder(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
    
class Note(models.Model):
    folder = models.ForeignKey(Folder, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()
    summary=models.TextField(null=True,blank=True)
    pdf_file=models.FileField(upload_to="notes_pdfs/",null=True,blank=True)
    
    created_at=models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title    

