from rest_framework.permissions import BasePermission

class IsTeacherOrAdmin(BasePermission):
    
    #Allows access only to teachers and admins.
    def has_permission(self, request, view):
        return (
            request.user.is_authenticated
            and request.user.role in ["teacher", "admin"]
        )

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "admin"

class IsStudent(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "student"