from django.urls import path
from .views import (
    get_user_profile,
    get_user_profiles,
    create_user_profile,
    create_staff_user_profile,
    remove_user_profile,
    update_user_profile,
    current_profile,

    get_course,
    get_courses,
    create_course,
    remove_course,
    update_course,

    register_student_to_course,
    deregister_student_from_course,
    deregister_student_from_course_admin,
    
    )

urlpatterns = [
    path("users/<int:user_id>/remove/", remove_user_profile),
    path("users/", get_user_profiles),
    path("users/create/", create_user_profile),
    path("users/create-staff/", create_staff_user_profile),
    path("users/<int:user_id>/", get_user_profile),
    path("users/<int:user_id>/update/", update_user_profile),
    path("users/profile/", current_profile),

    path("courses/<int:course_id>/remove/", remove_course),
    path("courses/", get_courses), 
    path("courses/create/", create_course),
    path("courses/<int:course_id>/", get_course),
    path("courses/<int:course_id>/update/", update_course),
    path("courses/<int:course_id>/register/", register_student_to_course),
    path("courses/<int:course_id>/deregister/", deregister_student_from_course),
    path("courses/<int:course_id>/deregister-admin/", deregister_student_from_course_admin),
]