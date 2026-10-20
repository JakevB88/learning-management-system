from django.http import JsonResponse
import json
from .models import User, Course
from django.forms.models import model_to_dict
from .permissions import IsTeacherOrAdmin, IsAdmin, IsStudent
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes

#Return data of current logged in user for validation
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_profile(request):
    return JsonResponse({
        "id": request.user.id,
        "username": request.user.username,
        "role": request.user.role,
    })

#user model CRUD defenitions for User model
@api_view(["GET"])
@permission_classes([IsAuthenticated, IsTeacherOrAdmin])
def get_user_profiles(request):
    user_profiles = list(User.objects.values())

    if request.user.role == "teacher":
        users = [
            {
                "id": user["id"],
                "username": user["username"],
                "role": user["role"],
            }
            for user in user_profiles
        ]

        return JsonResponse(users, safe=False)

    return JsonResponse(user_profiles, safe=False)
    
@api_view(["GET"])
@permission_classes([IsAuthenticated, IsTeacherOrAdmin])
def get_user_profile(request, user_id):
    try:
        user_profile = User.objects.get(id=user_id)

        if request.user.role == "teacher":
            return JsonResponse({
                "id": user_profile.id,
                "username": user_profile.username,
                "role": user_profile.role,
            })

        return JsonResponse(
            model_to_dict(user_profile)
        )

    except User.DoesNotExist:
        return JsonResponse(
            {"error": "User not found"},
            status=404
        )

@api_view(["POST"])
@permission_classes([IsAuthenticated, IsAdmin])
def create_staff_user_profile(request):
    data = request.data

    role = data.get("role")

    if role not in ["teacher", "admin"]:
        return JsonResponse(
            {"error": "Role must be teacher or admin"},
            status=400
        )
    
    user = User.objects.create_user(
        username=data["username"],
        password=data["password"],
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data["email"],
        is_staff=True,
        is_active=True,
        role=role
    )
    return JsonResponse(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        },
        status=201
    )

                                      
@api_view(["POST"])
@permission_classes([AllowAny])
def create_user_profile(request):
    data = request.data
    user = User.objects.create_user(
        username=data["username"],
        password=data["password"],
        first_name=data["first_name"],
        last_name=data["last_name"],
        email=data["email"],
        is_staff=False,
        is_active=True,
        role="student"
    )
    return JsonResponse(
        {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "role": user.role
        },
        status=201
    )

@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_user_profile(request, user_id):

    data = request.data

    try:
        user = User.objects.get(id=user_id)

        # permission check
        if (
            request.user.id != user.id
            and request.user.role != "admin"
        ):
            return JsonResponse(
                {"error": "Permission denied"},
                status=403
            )

        user.username = data["username"]
        user.set_password(data["password"])
        user.first_name = data["first_name"]
        user.last_name = data["last_name"]
        user.email = data["email"]

        # Only admin can modify these
        if request.user.role == "admin":
            user.is_staff = data["is_staff"]
            user.is_active = data["is_active"]
            user.role = data["role"]

        user.save()

        return JsonResponse(model_to_dict(user))

    except User.DoesNotExist:
        return JsonResponse(
            {"error": "User not found"},
            status=404
        )
    

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdmin])
def remove_user_profile(request, user_id):

    try:
        user = User.objects.get(id=user_id)
        user.delete()
        return JsonResponse({
            "message": "User deleted"
        })

    except User.DoesNotExist:
        return JsonResponse(
            {"error": "User not found"},
            status=404
        )

#course model CRUD defenitions for Course model
@api_view(["GET"])
@permission_classes([AllowAny])
def get_courses(request):
    courses = list(
        Course.objects.values()
    )
    return JsonResponse(courses, safe=False) # safe parameter to allow for the studenst list to be passed, without it only excepts dictionaries.

@api_view(["GET"])
@permission_classes([AllowAny])
def get_course(requst, course_id):
    try:
        course = Course.objects.get(
            id= course_id
        )
        return JsonResponse(
            model_to_dict(course)
        )
    except Course.DoesNotExist:
        return JsonResponse(
            {"error": "Course not found"},
            status=404
        )

@api_view(["POST"])
@permission_classes([IsAuthenticated, IsTeacherOrAdmin])
def create_course(request):
    
    data = request.data

    course = Course.objects.create(
        title=data["title"],
        description=data["description"],
        teacher_id = request.user.id
    )
    return JsonResponse(model_to_dict(course),status=201)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated, IsTeacherOrAdmin])
def update_course(request, course_id):

    data = request.data

    try:
        course = Course.objects.get(id=course_id)

        if request.user.role != "admin":
            if course.teacher_id != request.user.id:
                return JsonResponse(
                    {"error": "Permission denied"},
                    status=403
                )
            
        course.title = data["title"]
        course.description = data["description"]

        course.save() # writes changes to SQLite

        return JsonResponse(
            model_to_dict(course)
        )

    except Course.DoesNotExist:
        return JsonResponse(
            {"error": "Course not found"},
            status=404
        )

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsTeacherOrAdmin])
def remove_course(request, course_id):

    try:
        course = Course.objects.get(
            id = course_id
        )

        if request.user.role != "admin":
            if course.teacher_id != request.user.id:
                return JsonResponse(
                    {"error": "Permission denied"},
                    status=403
                )
            
        course.delete()
        return JsonResponse({
            "message": "Course deleted"
        })

    except Course.DoesNotExist:
        return JsonResponse(
            {"error": "Course not found"},
            status=404
        )


@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsStudent])
def register_student_to_course(request, course_id):
    
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return JsonResponse(
            {"error": "Course not found"},
            status=404
        )

    course = Course.objects.get(id=course_id)

    course.students.add(request.user)

    return JsonResponse(
        {"message": "Successfully registered"},
        status=200
    )

@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsStudent])
def deregister_student_from_course(request, course_id):
    
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return JsonResponse(
            {"error": "Course not found"},
            status=404
        )

    if not course.students.filter(id=request.user.id).exists():
        return JsonResponse(
            {"error": "Not registered to this course"},
            status=404
        )

    course.students.remove(request.user)

    return JsonResponse(
        {"message": "Successfully de-regiseterd"},
        status=200
    )

@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsAdmin])
def deregister_student_from_course_admin(request, course_id, student_id):
    
    try:
        course = Course.objects.get(id=course_id)
    except Course.DoesNotExist:
        return JsonResponse(
            {"error": "Course not found"},
            status=404
        )
    
    try:
        user = User.objects.get(id=student_id)
    except User.DoesNotExist:
        return JsonResponse(
            {"error": "Student not found"},
            status=404
        )

    if not course.students.filter(id=student_id).exists():
        return JsonResponse(
            {"error": "Student not registered to this course"},
            status=404
        )

    course.students.remove(user)

    return JsonResponse(
        {"message": "Successfully de-regiseterd"},
        status=200
    )