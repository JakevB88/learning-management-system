from django.db import models
from django.contrib.auth.models import AbstractUser

# Models

class User(AbstractUser):
    # from AbstractUser we alread get username, email, password, first_name, last_name
    ROLE_CHOICES = [
        ("student", "Student"),
        ("teacher", "Teacher"),
        ("admin", "Admin"),
    ]
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
        default="student"
    )

    def __str__(self):
        return self.username

class Course(models.Model):
    title = models.CharField(max_length=100)
    description = models.TextField()
    teacher = models.ForeignKey(
        User,
        # prevent course from being orphaned if the teacher is deleted.
        on_delete=models.PROTECT 
    )

    students = models.ManyToManyField(
        User,
        related_name="enrolled_courses",
        blank=True
    )

    class Meta:
        ordering = ["title"]

    def __str__(self):
        return self.title
