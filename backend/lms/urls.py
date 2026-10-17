from django.urls import path
from .views import (
    get_course,
    get_courses,
    get_user_profile,
    get_user_profiles,
    create_user_profile,
    remove_user_profile
    )

urlpatterns = [
    path("courses/", get_courses),
    path("courses/<int:course_id>/", get_course),

    path("users/<int:user_id>/remove/", remove_user_profile),
    path("users/", get_user_profiles),
    path("users/create/", create_user_profile),
    path("users/<int:user_id>/", get_user_profile),
        
]