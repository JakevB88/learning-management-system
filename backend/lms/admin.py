from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

# import models
from .models import User
from .models import Course

# Register models
admin.site.register(User, UserAdmin)
admin.site.register(Course)