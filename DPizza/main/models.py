from django.db import models

class Reviews(models.Model):
    name = models.CharField(max_length=30)
    review = models.TextField()
    number = models.TextField(unique=True)
    registration_date = models.CharField(max_length=20)



# Create your models here.
