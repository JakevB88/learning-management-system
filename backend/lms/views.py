from django.http import JsonResponse
import json
from .models import User, Course
from .permissions import IsTeacherOrAdmin, IsAdmin, IsStudent
from django.forms.models import model_to_dict
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

# this will allow csrf verification to be bypassed for CRUD testing purposes 
# remove when csrf is implemented properly
from django.views.decorators.csrf import csrf_exempt

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
def get_user_profiles(request):
    user_profiles = list(
        User.objects.values()
    )

    return JsonResponse(user_profiles, safe=False)
    
@api_view(["GET"])
def get_user_profile(request, user_id):
    try:
        user_profile = User.objects.get(
            id= user_id
        )
        return JsonResponse(
            model_to_dict(user_profile)
        )
    
    except User.DoesNotExist:
        return JsonResponse(
            {"error": "User not found"},
            status=404
        )  

@api_view(["POST"])
@csrf_exempt
def create_user_profile(request):
    
    data = json.loads(request.body)

        #once validated for multiple users, role can be permanently set to "role=student" 
        #this to force all users to only be able to register as a student
        #then only allow admin to create teachers and admin
    user = User.objects.create_user(
        username=data["username"],
        password=data["password"],
        first_name = data["first_name"],
        last_name = data["last_name"],
        email = data["email"],
        is_staff = data["is_staff"],
        is_active = data["is_active"],
        role=data.get("role", "student")
    )
    return JsonResponse(model_to_dict(user),status=201)

#@permission_classes([IsAuthenticated, IsStudent])
@api_view(["PATCH"])
@csrf_exempt
def update_user_profile(request, user_id):

    data = json.loads(request.body)

    try:
        user = User.objects.get(id=user_id)

        user.username = data["username"]
        user.set_password(data["password"]) #let Django deal with the password so it gets hashed correcty
        user.first_name = data["first_name"]
        user.last_name = data["last_name"]
        user.email = data["email"]
        user.is_staff = data["is_staff"]
        user.is_active = data["is_active"]
        user.role = data["role"]

        user.save() # writes changes to SQLite

        return JsonResponse(
            model_to_dict(user)
        )

    except User.DoesNotExist:
        return JsonResponse(
            {"error": "User not found"},
            status=404
        )

#@permission_classes([IsAuthenticated, IsAdmin])
@api_view(["DELETE"])
@csrf_exempt
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
def get_courses(request):
    courses = list(
        Course.objects.values()
    )
    return JsonResponse(courses, safe=False) # safe parameter to allow for the studenst list to be passed, without it only excepts dictionaries.

@api_view(["GET"])
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
    
    data = json.loads(request.body)

    course = Course.objects.create(
        title=data["title"],
        description=data["description"],
        teacher_id = request.user.id
    )
    return JsonResponse(model_to_dict(course),status=201)

@api_view(["PATCH"])
@permission_classes([IsAuthenticated, IsTeacherOrAdmin])
def update_course(request, course_id):

    data = json.loads(request.body)

    try:
        course = Course.objects.get(id=course_id)

        course.title = data["title"]
        course.description = data["description"]
        course.teacher_id = request.user.id

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
        course.delete()
        return JsonResponse({
            "message": "Course deleted"
        })

    except Course.DoesNotExist:
        return JsonResponse(
            {"error": "Course not found"},
            status=404
        )





