from django.http import JsonResponse
import json
from .models import User, Course
from django.forms.models import model_to_dict


# this will allow csrf verification to be bypassed for CRUD testing purposes 
# remove when csrf is implemented properly
from django.views.decorators.csrf import csrf_exempt

#user model CRUD defenitions for Student model
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
            {"error": "POST required"},
            status= 405
        )
    
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

@csrf_exempt
def update_user_profile(request, user_id):
    if request.method != "PATCH":
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

#course model CRUD defenitions for Course model
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

@csrf_exempt
def create_course(request):
    if request.method != "POST":
        return JsonResponse(
            {"error": "POST required"},
            status= 405
        )
    
    data = json.loads(request.body)

    # #confirm user creating the course is authorised
    # try:
    #     teacher = User.objects.get(id=data["teacher_id"])
    #     if teacher.role != "teacher" and teacher.role != "admin" :
    #         return JsonResponse(
    #             {"error": "Selected user is not a teacher"},
    #             status=400
    #         )
    # except User.DoesNotExist:
    #     return JsonResponse(
    #         {"error": "Teacher not found"},
    #         status=404
    #     )

    course = Course.objects.create(
        title=data["title"],
        description=data["description"],
        teacher_id = data["teacher_id"]
    )
    return JsonResponse(model_to_dict(course),status=201)

@csrf_exempt
def update_course(request, course_id):
    if request.method != "PATCH":
        return JsonResponse(
            {"error": "PATCH required"},
            status = 405
        )

    data = json.loads(request.body)

    #confirm user updating the course is authorised
    
    # try:
    #     teacher = User.objects.get(id=data["teacher_id"])
    #     course = Course.objects.get(id=course_id)

    #     if teacher.role != "admin" and teacher.id != course.teacher_id:
    #         return JsonResponse(
    #             {"error": "Selected user has no authorisation to update this course"},
    #             status=403
    #         )
        
    # except User.DoesNotExist:
    #     return JsonResponse(
    #         {"error": "Teacher not found"},
    #         status=404
    #     )

    try:
        course = Course.objects.get(id=course_id)

        course.title = data["title"]
        course.description = data["description"]
        course.teacher_id = data["teacher_id"]

        course.save() # writes changes to SQLite

        return JsonResponse(
            model_to_dict(course)
        )

    except Course.DoesNotExist:
        return JsonResponse(
            {"error": "Course not found"},
            status=404
        )


@csrf_exempt
def remove_course(request, course_id):
    if request.method != "DELETE":
        return JsonResponse(
            {"error": "DELETE required"},
            status = 405
        )
    
    #  #confirm user updating the course is authorised
    # try:
    #     teacher = User.objects.get(id=data["teacher_id"])
    #     course = Course.objects.get(id=course_id)

    #     if teacher.role != "admin" and teacher.id != course.teacher_id:
    #         return JsonResponse(
    #             {"error": "Selected user has no authorisation to update this course"},
    #             status=403
    #         )
        
    # except User.DoesNotExist:
    #     return JsonResponse(
    #         {"error": "Teacher not found"},
    #         status=404
    #     )
    
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
    
