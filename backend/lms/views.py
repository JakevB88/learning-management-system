from django.http import JsonResponse
import json
from .models import User, Course
from django.forms.models import model_to_dict
from .permissions import IsTeacherOrAdmin, IsAdmin, IsStudent
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.db.models.deletion import ProtectedError

#Return data of current logged in user for validation
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def current_profile(request):
    return JsonResponse({
        "id": request.user.id,
        "username": request.user.username,
        "first_name": request.user.first_name,
        "last_name": request.user.last_name,
        "email": request.user.email,
        "role": request.user.role,
    })

#user model CRUD defenitions for User model
@api_view(["GET"])
@permission_classes([IsAuthenticated, IsTeacherOrAdmin])
def get_user_profiles(request):
    user_profiles = list(User.objects.values())

    users = [
        {
            "id": user["id"],
            "username": user["username"],
            "first_name": user["first_name"],
            "last_name": user["last_name"],
            "email": user["email"],
            "role": user["role"],
        }
        for user in user_profiles
    ]

    return JsonResponse(users, safe=False)

@api_view(["GET"])
@permission_classes([IsAuthenticated, IsTeacherOrAdmin])
def get_user_profile(request, user_id):
    try:
        user_profile = User.objects.get(id=user_id)

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

    required_fields = [
        "username",
        "password",
        "first_name",
        "last_name",
        "email",
        "role"
    ]
    for field in required_fields:
        if not data.get(field):
            return JsonResponse(
                {"error": f"{field.replace('_', ' ').title()} is required."},
                status=400
            )

    try:
        user = User.objects.create_user(
            username=data["username"],
            password=data["password"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            email=data["email"],
            is_staff=False,
            is_active=True,
            role=data["role"]
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
    except KeyError:
        return JsonResponse(
            {"error": "Failed to create user"},
            status=400
        )
                                
@api_view(["POST"])
@permission_classes([AllowAny])
def create_user_profile(request):
    data = request.data

    required_fields = [
        "username",
        "password",
        "first_name",
        "last_name",
        "email",
    ]

    for field in required_fields:
        if not data.get(field):
            return JsonResponse(
                {"error": f"{field.replace('_', ' ').title()} is required."},
                status=400
            )
        
    try:
        user = User.objects.create_user(
            username=data["username"],
            password=data["password"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            email=data["email"],
            is_staff=False,
            is_active=True,
            role="admin"
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
    except KeyError:
        return JsonResponse(
            {"error": "Failed to create course"},
            status=400
        )
   
@api_view(["PATCH"])
@permission_classes([IsAuthenticated])
def update_user_profile(request, user_id):

    data = request.data

    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
            return JsonResponse(
                {"error": "User not found"},
                status=404
            )
    # Permission check
    if (
        request.user.id != user.id
        and request.user.role != "admin"
    ):
        return JsonResponse(
            {"error": "Permission denied"},
            status=403
        )

    # Update only fields supplied in the request
    if "username" in data:
        user.username = data["username"]

    password = data.get("password")
    if password:
        user.set_password(password)

    if "first_name" in data:
        user.first_name = data["first_name"]

    if "last_name" in data:
        user.last_name = data["last_name"]

    if "email" in data:
        user.email = data["email"]

    # Only admin can modify these
    if request.user.role == "admin":
        if "role" in data:
            if data["role"] != "admin":
                admin_count = User.objects.filter(role="admin").count()
                if admin_count <= 1:
                    return JsonResponse(
                        {
                            "error": f"You are the last admin and therefore cannot change yourself to '{data['role']}'. Please assign another admin first."
                        },
                        status=400
                    )
            user.role = data["role"]

    user.save()

    return JsonResponse(model_to_dict(user))

@api_view(["DELETE"])
@permission_classes([IsAuthenticated, IsAdmin])
def remove_user_profile(request, user_id):

    try:
        user = User.objects.get(id=user_id)
        print(f"user id = {user}")
        if user.role == "admin":
            admin_count = User.objects.filter(role="admin").count()
            if admin_count <= 1:
                return JsonResponse(
                    {
                        "error": "Cannot delete the last admin user."
                    },
                    status=400
                )
            
        user.delete()
        return JsonResponse({
            "message": "User deleted"
        })
    
    except ProtectedError:
        return JsonResponse(
            {
                "error": "Cannot delete this user because they are assigned as a teacher or admin to one or more courses."
            },
            status=404
        )
    except User.DoesNotExist:
        return JsonResponse(
            {"error": "User not found"},
            status=404
        )

#course model CRUD defenitions for Course model
@api_view(["GET"])
@permission_classes([AllowAny])
def get_courses(request):
    courses = []

    for course in Course.objects.all():
        courses.append({
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "teacher_id": course.teacher_id,
            "students": list(
                course.students.values_list("id", flat=True)
            )
        })

    return JsonResponse(courses, safe=False)

@api_view(["GET"])
@permission_classes([AllowAny])
def get_course(request, course_id):
    try:
        course = Course.objects.get(
            id= course_id
        )
        return JsonResponse({
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "teacher_id": course.teacher_id,
            "students": list(
                course.students.values(
                    "id",
                    "username",
                    "first_name",
                    "last_name",
                    "email"
                )
            )
        })
    except Course.DoesNotExist:
        return JsonResponse(
            {"error": "Course not found"},
            status=404
        )

@api_view(["POST"])
@permission_classes([IsAuthenticated, IsTeacherOrAdmin])
def create_course(request):
    
    data = request.data

    title = data.get("title", "").strip()
    description = data.get("description", "").strip()

    if not title or not description:
        return JsonResponse(
            {"error": "Title and description are required"},
            status=400
        )
    
    if Course.objects.filter(title=data["title"]).exists():
        return JsonResponse(
            {"error": "A course with this title already exists."},
            status=400
        )
    
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
            
        if "title" in data:
            course.title = data["title"]

        if "description" in data:
            course.description = data["description"]

        course.save() # writes changes to SQLite

        return JsonResponse({
            "id": course.id,
            "title": course.title,
            "description": course.description,
            "teacher_id": course.teacher_id,
            "students": list(
                course.students.values(
                    "id",
                    "username",
                    "first_name",
                    "last_name",
                    "email"
                )
            )
        })
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
            "message": "Course removed"
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
    if course.students.filter(id=request.user.id).exists():
        return JsonResponse(
            {"error": "Already registered to this course"},
            status=400
        )
    
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
        {"message": "Successfully de-registered"},
        status=200
    )

@api_view(["PUT"])
@permission_classes([IsAuthenticated, IsAdmin])
def deregister_student_from_course_admin(request, course_id):

    student_id = request.data.get("student_id")
    
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
        {"message": "Successfully de-registered"},
        status=200
    )