from django.http import JsonResponse
import json
from .models import User, Course
from django.forms.models import model_to_dict


# this will allow csrf verification to be bypassed for CRUD testing purposes 
# remove when csrf is implemented properly
from django.views.decorators.csrf import csrf_exempt

#user model CRUD defenitions
def get_user_profiles(request):
    user_profiles = list(
        User.objects.values()
    )

    return JsonResponse(user_profiles, safe=False)
    

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

@csrf_exempt
def create_user_profile(request):
    if request.method != "POST":
        return JsonResponse(
            {"error": "POST rewquired"},
            status= 405
        )

    data = json.loads(request.body)

    #once validated for multiple users, role can be permanently set to "role=student" 
    #this to force all users to only be able to register as a student
    #then only allow admin to create teachers and admin
    user = User.objects.create_user(
        username=data["username"],
        password=data["password"],
        role=data.get("role", "student")
    )
    return JsonResponse(model_to_dict(user),status=201)

@csrf_exempt
def update_user_profile(request, user_id):
    if request.method != "PUT":
        return JsonResponse(
            {"error": "PUT required"},
            status=405
        )

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

@csrf_exempt
def remove_user_profile(request, user_id):
    if request.method != "DELETE":
        return JsonResponse(
            {"error": "DELETE required"},
            status= 405
        )
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

#course model CRUD defenitions
def get_courses(request):
    courses = list(
        Course.objects.values()
    )
    return JsonResponse(courses, safe=False) # safe parameter to allow for the studenst list to be passed, without it only excepts dictionaries.

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


    
#************************************************************************************
@csrf_exempt
def update_student(request, student_id):
    if request.method != "PUT":
        return JsonResponse(
            {"error": "PUT required"},
            status=405
        )

    data = json.loads(request.body)

    try:
        student = Student.objects.get(id=student_id)

        student.name = data["name"]
        student.gpa = data["gpa"]
        student.registered = data["registered"]

        student.save() # writes changes to SQLite

        return JsonResponse(
            model_to_dict(student)
        )

    except Student.DoesNotExist:
        return JsonResponse(
            {"error": "Student not found"},
            status=404
        )

@csrf_exempt
def patch_student(request, student_id):
    if request.method != "PATCH":
        return JsonResponse(
            {"error": "PATCH required"},
            status=405
        )

    data = json.loads(request.body)

    try:
        student = Student.objects.get(id=student_id)
        if "name" in data:
            student.name = data["name"]
        
        if "gpa" in data:
            student.gpa = data["gpa"]

        if "registered" in data:
            student.registered = data["registered"]

        student.save() # writes changes to SQLite

        return JsonResponse(
            model_to_dict(student)
        )

    except Student.DoesNotExist:
        return JsonResponse(
            {"error": "Student not found"},
            status=404
        )
    
@csrf_exempt
def create_student(request):
    if request.method != "POST":
        return JsonResponse(
            {"error": "POST required"},
            status=405
        )
    
    data = json.loads(request.body)

    student = Student.objects.create(
        name=data["name"],
        gpa=data["gpa"]
    )

    return JsonResponse(model_to_dict(student),status=201)

@csrf_exempt
def remove_student(request, student_id):
    if request.method != "DELETE":
        return JsonResponse(
            {"error": "DELETE required"},
            status=405
        )
    
    try:
        student = Student.objects.get(id=student_id)
        student.delete()
        return JsonResponse({
            "message": "Student deleted"
        })

    except Student.DoesNotExist:
        return JsonResponse(
            {"error": "Student not found"},
            status=404
        )
#register student needs to be able to link student and course, this will go in the Django controlled table, how does this work
@csrf_exempt
def register_student_to_course(request, student_id, course_id):
    if request.method != "POST":
        return JsonResponse(
            {"error": "POST required"},
            status=405
        )

    try:
        student = Student.objects.get(id=student_id)

        student.registered = True

        student.save() # writes changes to SQLite

        return JsonResponse(
            model_to_dict(student)
        )

    except Student.DoesNotExist:
        return JsonResponse(
            {"error": "Student not found"},
            status=404
        )