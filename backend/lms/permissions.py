from rest_framework.permissions import BasePermission

#Allows access only to teachers and admins.
class IsTeacherOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in ["teacher", "admin"]
        )

#Allows access only to admins.
class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "admin"

# #Allows access only to teachers.
# class IsTeacher(BasePermission):
#     def has_permission(self, request, view):
#         return request.user.role == "teacher"

# #Allows access only to students.
# class IsStudent(BasePermission):
#     def has_permission(self, request, view):
#         return request.user.role == "student"

# class IsOwnerOrAdmin(BasePermission):
#     def has_object_permission(self, request, view, obj):
#         return (
#             request.user.role == "admin"
#             or request.user.id == obj.id
#         )