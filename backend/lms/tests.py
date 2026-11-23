#------------------------------------------------------------------------------------------
# These tests cover the Django backend validation and test:
# - Django URL routing in urls.py
# - views functions in views.py
#
# - SimpleTestCase is for Django backend unittesting
# - MagicMock() is used to mock objects to represent the database
# - patch is used to mock existing methods in the views.py functions 
# - APIClient is used to send the HTTP request to the URL path 
#------------------------------------------------------------------------------------------

import json
from django.test import SimpleTestCase
from rest_framework.test import APIClient
from unittest.mock import MagicMock, patch

from . import views

#------------------------------------------------------------------------------------------
# TEST CLASS FOR ALL COURSE RELATED TESTS
#------------------------------------------------------------------------------------------

class GetCoursesTest(SimpleTestCase): #inherrit from SimpleTestCase

    def setUp(self): #for each test, set up the HTTP request
        self.client = APIClient()         

    #helper methods
    def create_mock_user(self, role):
        mock_user = MagicMock()
        mock_user.id = 5
        mock_user.is_authenticated = True
        mock_user.role = role

        return mock_user
    
    def create_mock_user_full_object(self, id, username, first_name, last_name, email, role):
        mock_user = MagicMock()
        mock_user.id = id
        mock_user.username = username
        mock_user.first_name = first_name
        mock_user.last_name = last_name
        mock_user.email = email
        mock_user.role = role
        return mock_user

    def create_mock_user_full_dict(self, id, username, first_name, last_name, email, role):
        mock_user =  {
            "id": id,
            "username": username,
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "role": role
        }
        return mock_user

    def create_mock_course(self, course_id, title, description, teacher_id, students):
        mock_course = MagicMock()
        mock_course.id = course_id
        mock_course.title = title
        mock_course.description = description
        mock_course.teacher_id = teacher_id

        # Mock the many-to-many students relationship
        if students != None:
            mock_course.students.values_list.return_value = students # .return_value is what is returnde when the values_list is cald in views.py
            mock_course.students.values.return_value = students
        else: 
            mock_course.students.values_list.return_value = []
            mock_course.students.values.return_value = []

        return mock_course

#------------------------------------------------------------------------------------------
# TESTS FOR RETREIVING CURRENT PROFILE
#------------------------------------------------------------------------------------------
    def test_get_current_profile_successfully(self):
        # Arrange:
        # Mock an authenticated student
        mock_student = self.create_mock_user("student")
        mock_student.id = 1
        mock_student.username = "JSmith"
        mock_student.first_name = "John"
        mock_student.last_name = "Smith"
        mock_student.email = "jsmith@vbcourses.co.uk"
        self.client.force_authenticate(user=mock_student)

        expected_response = {
            "id": 1,
            "username": "JSmith",
            "first_name": "John",
            "last_name": "Smith",
            "email": "jsmith@vbcourses.co.uk",
            "role": "student"
        }

        # Act:
        response = self.client.get("/api/users/profile")

        # Assert:
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), expected_response)

    def test_get_current_profile_unsuccessfully__unauthenticated(self):
        # Arrange not required
        # Act:
        response = self.client.get("/api/users/profile")
        # Assert:
        self.assertEqual(response.status_code, 401)
    
#------------------------------------------------------------------------------------------
# TESTS FOR RETREIVING ALL USERS
#------------------------------------------------------------------------------------------

    @patch.object(views.User.objects, "values") #replace the "Users.objects.values():" line in views.py "get_users" with a temporarily mocked version as there is no actual database for this test to get the data from
    def test_get_users_successfully__as_admin(self, mock_values): # "mock_all" is the mocked test function created by @patch.object(views.Users.objects, "values")
        
        #Arrange: Create mock user data
        #when views.py calls User.objects.values(), return the mock_user instead, this was set up with @patch.object
        mock_user_full = self.create_mock_user_full_dict(1, "JSmith", "John", "Smith", "jsmith@vbcourses.co.uk", "student")
        mock_values.return_value = [mock_user_full]
        
        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act: Call get_users
        response = self.client.get("/api/users")
        # Assert: Check response
        self.assertEqual(response.status_code, 200)
        data = response.json() #convert SJON response into Python object
        self.assertEqual(len(data), 1) #confirm that one user is available in the users array
        self.assertEqual(data[0]["id"], 1)
        self.assertEqual(data[0]["username"], "JSmith")
        self.assertEqual(data[0]["first_name"], "John")
        self.assertEqual(data[0]["last_name"], "Smith")
        self.assertEqual(data[0]["email"], "jsmith@vbcourses.co.uk")
        self.assertEqual(data[0]["role"], "student")
        # Verify the database query "mock_values" was called
        mock_values.assert_called_once()

    @patch.object(views.User.objects, "values") #replace the "Users.objects.values():" line in views.py "get_users" with a temporarily mocked version as there is no actual database for this test to get the data from
    def test_get_users_successfully__as_teacher(self, mock_values): # "mock_all" is the mocked test function created by @patch.object(views.Users.objects, "values")
        
        #Arrange: Create mock user data
        #when views.py calls User.objects.values(), return the mock_user instead, this was set up with @patch.object
        mock_user_full = self.create_mock_user_full_dict(1, "JSmith", "John", "Smith", "jsmith@vbcourses.co.uk", "student")
        mock_values.return_value = [mock_user_full]
        
        # Mock authentication as a teacher
        mock_teacher = self.create_mock_user("teacher")
        self.client.force_authenticate(user=mock_teacher)

        # Act: Call get_users
        response = self.client.get("/api/users")
        # Assert: Check response
        self.assertEqual(response.status_code, 200)
        data = response.json() #convert SJON response into Python object
        self.assertEqual(len(data), 1) #confirm that one user is available in the users array
        self.assertEqual(data[0]["id"], 1)
        self.assertEqual(data[0]["username"], "JSmith")
        self.assertEqual(data[0]["first_name"], "John")
        self.assertEqual(data[0]["last_name"], "Smith")
        self.assertEqual(data[0]["email"], "jsmith@vbcourses.co.uk")
        self.assertEqual(data[0]["role"], "student")
        # Verify the database query "mock_values" was called
        mock_values.assert_called_once()

    @patch.object(views.User.objects, "values") #replace the "Users.objects.values():" line in views.py "get_users" with a temporarily mocked version as there is no actual database for this test to get the data from
    def test_get_users_unsuccessfully__as_student(self, mock_values): # "mock_all" is the mocked test function created by @patch.object(views.Users.objects, "values")
        
        #Arrange: Create mock user data
        #when views.py calls User.objects.values(), return the mock_user instead, this was set up with @patch.object
        mock_user_full = self.create_mock_user_full_dict(1, "JSmith", "John", "Smith", "jsmith@vbcourses.co.uk", "student")
        mock_values.return_value = [mock_user_full]
        
        # Mock authentication as a student
        mock_student = self.create_mock_user("student")
        self.client.force_authenticate(user=mock_student)

        # Act: Call get_users
        response = self.client.get("/api/users")
        # Assert: Check response
        self.assertEqual(response.status_code, 403)
     
        # Verify the database query "mock_values" was called
        mock_values.assert_not_called()

    @patch.object(views.User.objects, "values") #replace the "Users.objects.values():" line in views.py "get_users" with a temporarily mocked version as there is no actual database for this test to get the data from
    def test_get_multiple_users_successfully(self, mock_values): # "mock_all" is the mocked test function created by @patch.object(views.Users.objects, "values")
        
        #Arrange: Create mock user data
        #when views.py calls User.objects.values(), return the mock_user instead, this was set up with @patch.object
        mock_user_full1 = self.create_mock_user_full_dict(1, "JSmith", "John", "Smith", "jsmith@vbcourses.co.uk", "student")
        mock_user_full2 = self.create_mock_user_full_dict(2, "SJohn", "Smith", "John", "sjohn@vbcourses.co.uk", "teacher")
        mock_values.return_value = [mock_user_full1, mock_user_full2]
        
        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)
        # Act: Call get_users
        response = self.client.get("/api/users")
        # Assert: Check response
        self.assertEqual(response.status_code, 200)
        data = response.json() #convert SJON response into Python object
        self.assertEqual(len(data), 2) #confirm that one user is available in the users array
        self.assertEqual(data[0]["id"], 1)
        self.assertEqual(data[0]["username"], "JSmith")
        self.assertEqual(data[0]["first_name"], "John")
        self.assertEqual(data[0]["last_name"], "Smith")
        self.assertEqual(data[0]["email"], "jsmith@vbcourses.co.uk")
        self.assertEqual(data[0]["role"], "student")

        self.assertEqual(len(data), 2) #confirm that one user is available in the users array
        self.assertEqual(data[1]["id"], 2)
        self.assertEqual(data[1]["username"], "SJohn")
        self.assertEqual(data[1]["first_name"], "Smith")
        self.assertEqual(data[1]["last_name"], "John")
        self.assertEqual(data[1]["email"], "sjohn@vbcourses.co.uk")
        self.assertEqual(data[1]["role"], "teacher")
        # Verify the database query "mock_values" was called
        mock_values.assert_called_once()

    @patch.object(views.User.objects, "values") #replace the "Users.objects.values():" line in views.py "get_users" with a temporarily mocked version as there is no actual database for this test to get the data from
    def test_get_users_unsuccessfully_empty(self, mock_values): # "mock_all" is the mocked test function created by @patch.object(views.Users.objects, "values")
        
        #Arrange: Create mock user data
        
        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act: Call get_users
        response = self.client.get("/api/users")
        # Assert: Check response
        self.assertEqual(response.status_code, 200)

        data = response.json() #convert SJON response into Python object
        self.assertEqual(len(data), 0)
        # Verify the database query "mock_values" was called
        mock_values.assert_called_once()

#------------------------------------------------------------------------------------------
# TESTS FOR RETRIEVING ONE USER
#------------------------------------------------------------------------------------------

    @patch.object(views, "model_to_dict")
    @patch.object(views.User.objects, "get")
    def test_get_user_successfully__as_admin(self, mock_get, mock_model_to_dict):

        # Arrange:
        user_id = 1

        mock_user = MagicMock()
        mock_user.id = user_id
        mock_user.username = "JSmith"
        mock_user.first_name = "John"
        mock_user.last_name = "Smith"
        mock_user.email = "jsmith@vbcourses.co.uk"
        mock_user.role = "student"

        mock_get.return_value = mock_user

        expected_response = {
            "id": user_id,
            "username": "JSmith",
            "first_name": "John",
            "last_name": "Smith",
            "email": "jsmith@vbcourses.co.uk",
            "role": "student"
        }

        mock_model_to_dict.return_value = expected_response

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act:
        response = self.client.get(f"/api/users/{user_id}")

        # Assert:
        self.assertEqual(response.status_code, 200)

        data = response.json()

        self.assertEqual(data["id"], user_id)
        self.assertEqual(data["username"], "JSmith")
        self.assertEqual(data["first_name"], "John")
        self.assertEqual(data["last_name"], "Smith")
        self.assertEqual(data["email"], "jsmith@vbcourses.co.uk")
        self.assertEqual(data["role"], "student")

        mock_get.assert_called_once_with(id=user_id)

    @patch.object(views, "model_to_dict")
    @patch.object(views.User.objects, "get")
    def test_get_user_successfully__as_teacher(self, mock_get, mock_model_to_dict):

        # Arrange:
        user_id = 1

        mock_user = MagicMock()
        mock_user.id = user_id
        mock_user.username = "JSmith"
        mock_user.first_name = "John"
        mock_user.last_name = "Smith"
        mock_user.email = "jsmith@vbcourses.co.uk"
        mock_user.role = "student"

        mock_get.return_value = mock_user

        expected_response = {
            "id": user_id,
            "username": "JSmith",
            "first_name": "John",
            "last_name": "Smith",
            "email": "jsmith@vbcourses.co.uk",
            "role": "student"
        }

        mock_model_to_dict.return_value = expected_response

        # Mock authentication as a teacher
        mock_teacher = self.create_mock_user("teacher")
        self.client.force_authenticate(user=mock_teacher)

        # Act:
        response = self.client.get(f"/api/users/{user_id}")

        # Assert:
        self.assertEqual(response.status_code, 200)

        data = response.json()

        self.assertEqual(data["id"], user_id)
        self.assertEqual(data["username"], "JSmith")
        self.assertEqual(data["first_name"], "John")
        self.assertEqual(data["last_name"], "Smith")
        self.assertEqual(data["email"], "jsmith@vbcourses.co.uk")
        self.assertEqual(data["role"], "student")

        mock_get.assert_called_once_with(id=user_id)

    def test_get_user_unsuccessfully__as_student(self):

        # Arrange:
        user_id = 1

        # Mock authentication as a student
        mock_student = self.create_mock_user("student")
        self.client.force_authenticate(user=mock_student)

        # Act:
        response = self.client.get(f"/api/users/{user_id}")

        # Assert:
        self.assertEqual(response.status_code, 403)

    @patch.object(views.User.objects, "get")
    def test_get_user_unsuccessfully__as_admin__user_does_not_exsist(self, mock_get):

        # Arrange:
        user_id = 1
        mock_get.side_effect = views.User.DoesNotExist

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act:
        response = self.client.get(f"/api/users/{user_id}")

        # Assert:
        self.assertEqual(response.status_code, 404)

        data = response.json()

        self.assertEqual(data, {"error": "User not found"})

        mock_get.assert_called_once_with(id=user_id)

    @patch.object(views.User.objects, "get")
    def test_get_user_unsuccessfully__not_authenticated(self, mock_get):

        # Arrange:
        user_id = 1

        # Act:
        response = self.client.get(f"/api/users/{user_id}")

        # Assert:
        self.assertEqual(response.status_code, 401)


        mock_get.assert_not_called()


#------------------------------------------------------------------------------------------
# TESTS FOR CREATING STAFF USER PROFILE
#------------------------------------------------------------------------------------------
    
    @patch.object(views.User.objects, "create_user")
    def test_staff_create_user_successfully_as_admin(self, mock_create_user):
        # Arrange
        user_data = {
            "password": "password",
            "username": "JSmith",
            "first_name": "John",
            "last_name": "Smith",
            "email": "jsmith@vbcourses.co.uk",
            "role": "teacher"
        }

        mock_user_full = self.create_mock_user_full_object(1, "JSmith", "John", "Smith", "jsmith@vbcourses.co.uk", "teacher")
        mock_create_user.return_value = mock_user_full

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act
        response = self.client.post(
            "/api/users/create-staff",
            user_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 201)

        data = response.json()

        self.assertEqual(data["id"], 1)
        self.assertEqual(data["username"], "JSmith")
        self.assertEqual(data["email"], "jsmith@vbcourses.co.uk")
        self.assertEqual(data["role"], "teacher")

        mock_create_user.assert_called_once_with(
            username="JSmith",
            password="password",
            first_name="John",
            last_name="Smith",
            email="jsmith@vbcourses.co.uk",
            is_staff=False,
            is_active=True,
            role="teacher"
        )

    @patch.object(views.User.objects, "create_user")
    def test_staff_create_user_unsuccessfully_as_teacher(self, mock_create_user):
        # Arrange
        user_data = {
            "password": "password",
            "username": "JSmith",
            "first_name": "John",
            "last_name": "Smith",
            "email": "jsmith@vbcourses.co.uk",
            "role": "teacher"
        }

        # Mock authentication as a teacher
        mock_teacher = self.create_mock_user("teacher")
        self.client.force_authenticate(user=mock_teacher)

        # Act
        response = self.client.post(
            "/api/users/create-staff",
            user_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 403)

        data = response.json()

        mock_create_user.assert_not_called()

    @patch.object(views.User.objects, "create_user")
    def test_staff_create_user_unsuccessfully_as_student(self, mock_create_user):
        # Arrange
        user_data = {
            "password": "password",
            "username": "JSmith",
            "first_name": "John",
            "last_name": "Smith",
            "email": "jsmith@vbcourses.co.uk",
            "role": "teacher"
        }

        # Mock authentication as a student
        mock_student = self.create_mock_user("student")
        self.client.force_authenticate(user=mock_student)

        # Act
        response = self.client.post(
            "/api/users/create-staff",
            user_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 403)

        data = response.json()

        mock_create_user.assert_not_called()

    @patch.object(views.User.objects, "create_user")
    def test_staff_create_user_unsuccessfully_not_authenticated(self, mock_create_user):
        # Arrange
        user_data = {
            "password": "password",
            "username": "JSmith",
            "first_name": "John",
            "last_name": "Smith",
            "email": "jsmith@vbcourses.co.uk",
            "role": "teacher"
        }

        # Act
        response = self.client.post(
            "/api/users/create-staff",
            user_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 401)

        data = response.json()

        mock_create_user.assert_not_called()

    @patch.object(views.User.objects, "create_user")
    def test_staff_create_user_unsuccessfully__as_admin__missing_information(self, mock_create_user):
        # Arrange
        user_data = {
            "password": "password",
            "username": "JSmith",
            "last_name": "Smith",
            "email": "jsmith@vbcourses.co.uk",
            "role": "teacher"
        }

        # Mock the user object created
        mock_user_full = self.create_mock_user_full_object(
            1, "JSmith", "John", "Smith", "jsmith@vbcourses.co.uk", "teacher"
        )
        mock_create_user.return_value = mock_user_full

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act
        response = self.client.post(
            "/api/users/create-staff",
            user_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 400)

        data = response.json()
        
        self.assertEqual(data["error"], "First Name is required.")

        mock_create_user.assert_not_called()

#------------------------------------------------------------------------------------------
# TESTS FOR CREATING USER PROFILE
#------------------------------------------------------------------------------------------

    @patch.object(views.User.objects, "create_user")
    def test_create_user_successfully_not_authenticated(self, mock_create_user):
        # Arrange
        user_data = {
            "password": "password",
            "username": "JSmith",
            "first_name": "John",
            "last_name": "Smith",
            "email": "jsmith@vbcourses.co.uk"
        }

        # Mock the user object created
        mock_user_full = self.create_mock_user_full_object(
            1, "JSmith", "John", "Smith", "jsmith@vbcourses.co.uk", "student"
        )
        mock_create_user.return_value = mock_user_full

        # Act
        response = self.client.post(
            "/api/users/create",
            user_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 201)

        data = response.json()

        self.assertEqual(data["id"], 1)
        self.assertEqual(data["username"], "JSmith")
        self.assertEqual(data["email"], "jsmith@vbcourses.co.uk")
        self.assertEqual(data["role"], "student")

        mock_create_user.assert_called_once()
        mock_create_user.assert_called_once_with(
            username="JSmith",
            password="password",
            first_name="John",
            last_name="Smith",
            email="jsmith@vbcourses.co.uk",
            is_staff=False,
            is_active=True,
            role="student"
        )
    
    @patch.object(views.User.objects, "create_user")
    def test_staff_create_user_unsuccessfully__missing_information(self, mock_create_user):
        # Arrange
        user_data = {
            "password": "password",
            "username": "JSmith",
            "last_name": "Smith",
            "email": "jsmith@vbcourses.co.uk",
            "role": "teacher"
        }

        # Mock the user object created
        mock_user_full = self.create_mock_user_full_object(
            1, "JSmith", "John", "Smith", "jsmith@vbcourses.co.uk", "teacher"
        )
        mock_create_user.return_value = mock_user_full

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act
        response = self.client.post(
            "/api/users/create",
            user_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 400)

        data = response.json()
        
        self.assertEqual(data["error"], "First Name is required.")

        mock_create_user.assert_not_called()

#------------------------------------------------------------------------------------------
# TESTS FOR UPDATING USER PROFILE
#------------------------------------------------------------------------------------------

    @patch.object(views, "model_to_dict")
    @patch.object(views.User.objects, "get")
    def test_update_user_successfully_as_admin(self, mock_get, mock_model_to_dict):

        # Arrange
        user_id = 2
        user_data = {
            "username": "JSmith",
            "password": "password",
            "first_name": "John",
            "last_name": "Smith",
            "email": "jsmith@vbcourses.co.uk",
            "is_staff": True,
            "is_active": True,
            "role": "teacher"
        }

        mock_user = self.create_mock_user_full_object(user_id, "OldUsername", "John", "Smith", "oldemail@vbcourses.co.uk", "student")
        mock_get.return_value = mock_user

        expected_response = {
            "id": user_id,
            "username": "JSmith",
            "first_name": "John",
            "last_name": "Smith",
            "email": "jsmith@vbcourses.co.uk",
            "is_staff": True,
            "is_active": True,
            "role": "teacher"
        }
        mock_model_to_dict.return_value = expected_response

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act
        response = self.client.patch(
            f"/api/users/{user_id}/update",
            user_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data, expected_response)

        self.assertEqual(mock_user.username, "JSmith")
        self.assertEqual(mock_user.first_name, "John")
        self.assertEqual(mock_user.last_name, "Smith")
        self.assertEqual(mock_user.email, "jsmith@vbcourses.co.uk")
        self.assertEqual(mock_user.role, "teacher")

        mock_get.assert_called_once_with(id=user_id)
        mock_user.set_password.assert_called_once_with("password")
        mock_user.save.assert_called_once()
        mock_model_to_dict.assert_called_once_with(mock_user)

    @patch.object(views, "model_to_dict")
    @patch.object(views.User.objects, "get")
    def test_update_profile_successfully_as_teacher_own_id_update(self, mock_get, mock_model_to_dict):

        # Arrange
        user_id = 5
        user_data = {
            "username": "JSmith",
            "password": "password",
            "first_name": "John",
            "last_name": "Smith",
            "email": "jsmith@vbcourses.co.uk",
            "role": "teacher"
        }

        mock_user = self.create_mock_user_full_object(user_id, "OldUsername", "John", "Smith", "oldemail@vbcourses.co.uk", "student")
        mock_get.return_value = mock_user

        expected_response = {
            "id": user_id,
            "username": "JSmith",
            "first_name": "John",
            "last_name": "Smith",
            "email": "jsmith@vbcourses.co.uk",
            "role": "teacher"
        }
        mock_model_to_dict.return_value = expected_response

        # Mock authentication as a teacher
        mock_teacher = self.create_mock_user("teacher")
        self.client.force_authenticate(user=mock_teacher)

        # Act
        response = self.client.patch(
            f"/api/users/{user_id}/update",
            user_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data, expected_response)

        self.assertEqual(mock_user.username, "JSmith")
        self.assertEqual(mock_user.first_name, "John")
        self.assertEqual(mock_user.last_name, "Smith")
        self.assertEqual(mock_user.email, "jsmith@vbcourses.co.uk")
        self.assertEqual(mock_user.role, "student")

        mock_get.assert_called_once_with(id=user_id)
        mock_user.set_password.assert_called_once_with("password")
        mock_user.save.assert_called_once()
        mock_model_to_dict.assert_called_once_with(mock_user)

    @patch.object(views, "model_to_dict")
    @patch.object(views.User.objects, "get")
    def test_update_profile_unsuccessfully_as_teacher_other_id_update(self, mock_get, mock_model_to_dict):

        # Arrange
        user_id = 4
        user_data = {
            "username": "JSmith",
            "password": "password",
            "first_name": "John",
            "last_name": "Smith",
            "email": "jsmith@vbcourses.co.uk",
            "role": "teacher"
        }

        mock_user = self.create_mock_user_full_object(user_id, "OldUsername", "John", "Smith", "oldemail@vbcourses.co.uk", "student")
        mock_get.return_value = mock_user

        expected_response = {
            "id": user_id,
            "username": "JSmith",
            "first_name": "John",
            "last_name": "Smith",
            "email": "jsmith@vbcourses.co.uk",
            "role": "teacher"
        }
        mock_model_to_dict.return_value = expected_response

        # Mock authentication as a teacher
        mock_teacher = self.create_mock_user("teacher")
        self.client.force_authenticate(user=mock_teacher)

        # Act
        response = self.client.patch(
            f"/api/users/{user_id}/update",
            user_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 403)

        data = response.json()
        
        mock_get.assert_called_once_with(id=user_id)
        mock_user.set_password.assert_not_called()
        mock_user.save.assert_not_called()
        mock_model_to_dict.assert_not_called()

    @patch.object(views, "model_to_dict")
    @patch.object(views.User.objects, "get")
    def test_update_user_successfully_as_admin__missing_information(self, mock_get, mock_model_to_dict):

        # Arrange
        user_id = 2
        user_data = {
            "username": "JSmith",
            "first_name": "John",
            "last_name": "Smith",
            "role": "teacher"
        }

        mock_user = self.create_mock_user_full_object(user_id, "OldUsername", "John", "Smith", "oldemail@vbcourses.co.uk", "student")
        mock_get.return_value = mock_user

        expected_response = {
            "id": user_id,
            "username": "JSmith",
            "first_name": "John",
            "last_name": "Smith",
            "email": "oldemail@vbcourses.co.uk",
            "is_staff": True,
            "is_active": True,
            "role": "teacher"
        }

        mock_model_to_dict.return_value = expected_response

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act
        response = self.client.patch(
            f"/api/users/{user_id}/update",
            user_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data, expected_response)
        self.assertEqual(mock_user.username, "JSmith")
        self.assertEqual(mock_user.first_name, "John")
        self.assertEqual(mock_user.last_name, "Smith")
        self.assertEqual(mock_user.email,"oldemail@vbcourses.co.uk")
        self.assertEqual(mock_user.role, "teacher")

        mock_user.set_password.assert_not_called()
        mock_get.assert_called_once_with(id=user_id)
        mock_user.save.assert_called_once()
        mock_model_to_dict.assert_called_once_with(mock_user)

    @patch.object(views, "model_to_dict")
    @patch.object(views.User.objects, "get")
    def test_update_user_unuccessfully_as_admin_user_not_found(self, mock_get, mock_model_to_dict):

        # Arrange
        user_id = 2
        mock_get.side_effect = views.User.DoesNotExist
        user_data = {
            "username": "JSmith",
            "password": "password",
            "first_name": "John",
            "last_name": "Smith",
            "email": "jsmith@vbcourses.co.uk",
            "is_staff": True,
            "is_active": True,
            "role": "teacher"
        }

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act
        response = self.client.patch(
            f"/api/users/{user_id}/update",
            user_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 404)

        data = response.json()
        self.assertEqual(data, {"error": "User not found"})

        mock_get.assert_called_once_with(id=user_id)

#------------------------------------------------------------------------------------------
# TESTS FOR DELETING USER PROFILE
#------------------------------------------------------------------------------------------
    
    @patch.object(views.User.objects, "get")
    def test_delete_user_successfully_as_admin(self, mock_get):

        # Arrange
        user_id = 2

        mock_user_full = self.create_mock_user_full_object(user_id, "JSmith", "John", "Smith", "jsmith@vbcourses.co.uk", "teacher")
        mock_get.return_value = mock_user_full

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act
        response = self.client.delete(
            f"/api/users/{user_id}/remove",
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data["message"], "User deleted")

        mock_get.assert_called_once_with(id=user_id)
        mock_user_full.delete.assert_called_once()

    @patch.object(views.User.objects, "get")
    def test_delete_user_unsuccessfully_as_admin__user_not_found(self, mock_get):

        # Arrange
        user_id = 2
        mock_get.side_effect = views.User.DoesNotExist

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act
        response = self.client.delete(
            f"/api/users/{user_id}/remove",
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 404)

        data = response.json()
        self.assertEqual(data["error"], "User not found")

    @patch.object(views.User.objects, "get")
    def test_delete_user_unsuccessfully__as_admin__teacher_with_courses(self, mock_get):

        # Arrange
        user_id = 2
        mock_user = MagicMock()

        mock_user.delete.side_effect = views.ProtectedError(
            "protected",
            []
        )

        mock_get.return_value = mock_user

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act
        response = self.client.delete(
            f"/api/users/{user_id}/remove",
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 404)

        data = response.json()
        self.assertEqual(data["error"], "Cannot delete this user because they are assigned as a teacher or admin to one or more courses.")

#------------------------------------------------------------------------------------------
# TESTS FOR RETREIVING ALL COURSES
#------------------------------------------------------------------------------------------

    @patch.object(views.Course.objects, "all") #replace the "for course in Course.objects.all():" line in views.py "get_courses" with a temporarily mocked version as there is no actual database for this test to get the data from
    def test_get_courses_successfully(self, mock_all): # "mock_all" is the mocked test function created by @patch.object(views.Course.objects, "all")
        
        #Arrange: Create mock course data
        #when views.py calls Course.objects.all(), return the mock_course instead, this was set up with @patch.object
        mock_course = self.create_mock_course(1, "Python", "Learn Python", 5, [10, 11, 12])
        mock_all.return_value = [mock_course]

        # Act: Call get_courses
        response = self.client.get(f"/api/courses")

        # Assert: Check response
        self.assertEqual(response.status_code, 200)

        data = response.json() #convert SJON response into Python object

        self.assertEqual(len(data), 1) #confirm that one course is available in the courses array
        self.assertEqual(data[0]["id"], 1)
        self.assertEqual(data[0]["title"], "Python")
        self.assertEqual(data[0]["description"], "Learn Python")
        self.assertEqual(data[0]["teacher_id"], 5)
        self.assertEqual(data[0]["students"], [10, 11, 12])

        # Verify the database query "mock_all" was called
        mock_all.assert_called_once()

    @patch.object(views.Course.objects, "all")
    def test_get_courses_empty(self, mock_all):

        # Arrange
        mock_all.return_value = []  # mock the emplty courses list

        # Act
        response = self.client.get(f"/api/courses")

        # Assert
        self.assertEqual(response.status_code, 200)

        data = response.json()

        self.assertEqual(data, [])

        mock_all.assert_called_once()

    @patch.object(views.Course.objects, "all")
    def test_get_multiple_courses(self, mock_all):

        # Arrange
        mock_course1 = self.create_mock_course(1, "Python", "Learn Python", 5, [10, 11, 12])
        mock_course2 = self.create_mock_course(2, "JavaScript", "Learn JavaScript", 6, [13, 14, 15]) #when views.py calls Course.objects.all(), return the mock_course instead, this was set up with @patch.object
        
        mock_all.return_value = [mock_course1, mock_course2]

        # Act
        response = self.client.get(f"/api/courses")

        # Assert
        data = response.json()

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(data), 2)
        self.assertEqual(data[0]["id"], 1)
        self.assertEqual(data[1]["id"], 2)
        self.assertEqual(data[0]["title"], "Python")
        self.assertEqual(data[1]["title"], "JavaScript")
        self.assertEqual(data[0]["students"], [10, 11, 12])
        self.assertEqual(data[1]["students"], [13, 14, 15])

        mock_all.assert_called_once()

#------------------------------------------------------------------------------------------
# TESTS FOR RETREIVING ONE COURSE
#------------------------------------------------------------------------------------------

    @patch.object(views.Course.objects, "get")
    def test_get_course_successfully(self, mock_get):
        course_id = 1
        # Arrange: Creatge mock course data
        mock_course = self.create_mock_course(course_id, "Python", "Learn Python", 5, [{
            "id": 10,
            "username": "OttoTheOtter",
            "first_name": "Otto",
            "last_name": "van Bezooijen",
            "email": "otto@jvbcourses.com"
        }])

        mock_get.return_value = mock_course

        # Act: Call get_courses
        response = self.client.get(f"/api/courses/{course_id}")

        # Assert
        self.assertEqual(response.status_code, 200)

        data = response.json()

        self.assertEqual(data["id"], course_id)
        self.assertEqual(data["title"], "Python")
        self.assertEqual(data["description"], "Learn Python")
        self.assertEqual(data["teacher_id"], 5)
        self.assertEqual(data["students"][0]["id"], 10)
        self.assertEqual(data["students"][0]["username"], "OttoTheOtter")

        # Verify the database query "mock_get" was called with the correct id
        mock_get.assert_called_once_with(id=mock_course.id)

    @patch.object(views.Course.objects, "get")
    def test_get_course_unsuccessfully(self, mock_get):
        # Arrange
        course_id = 1
        mock_get.side_effect = views.Course.DoesNotExist

        # Act
        response = self.client.get(f"/api/courses/{course_id}")
        # Assert
        self.assertEqual(response.status_code, 404)

        data = response.json()

        self.assertEqual(data, {"error": "Course not found"})

        mock_get.assert_called_once_with(id=course_id)


# ------------------------------------------------------------------------------------------
# TESTS FOR CREATING A COURSE
# ------------------------------------------------------------------------------------------
    @patch.object(views.Course.objects, "filter")
    @patch.object(views, "model_to_dict")
    @patch.object(views.Course.objects, "create")
    def test_create_course_successfully_as_teacher(self, mock_create, mock_model_to_dict, mock_filter):

        # Arrange
        # data to be used as to create a course
        course_data = {
            "title": "Python",
            "description": "Learn Python"
        }

        mock_filter.return_value.exists.return_value = False
        #mock the course object created 
        mock_course = self.create_mock_course(1, "Python", "Learn Python", 5, None)
        mock_create.return_value = mock_course

        # mock the model_to_dict function call
        expectedResponse = {
            "id": 1,
            "title": "Python",
            "description": "Learn Python",
            "teacher": 5,
            "students": None
        }
        mock_model_to_dict.return_value = expectedResponse

        # Mock authentication as a teacher
        mock_teacher = self.create_mock_user("teacher")
        self.client.force_authenticate(user=mock_teacher)

        # Act
        response = self.client.post(
            "/api/courses/create",
            course_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 201)

        data = response.json()

        self.assertEqual(data["id"], 1)
        self.assertEqual(data["title"], "Python")
        self.assertEqual(data["description"], "Learn Python")
        self.assertEqual(data["teacher"], 5)

        mock_create.assert_called_once_with(
            title="Python",
            description="Learn Python",
            teacher_id=5
        )

    @patch.object(views.Course.objects, "filter")
    @patch.object(views, "model_to_dict")
    @patch.object(views.Course.objects, "create")
    def test_create_course_successfully_as_admin(self, mock_create, mock_model_to_dict, mock_filter):

        # Arrange
        # data to be used as to create a course
        course_data = {
            "title": "Python",
            "description": "Learn Python"
        }

        mock_filter.return_value.exists.return_value = False
        #mock the course object created 
        mock_course = self.create_mock_course(1, "Python", "Learn Python", 5, None)
        mock_create.return_value = mock_course

        # mock the model_to_dict function call
        expectedResponse = {
            "id": 1,
            "title": "Python",
            "description": "Learn Python",
            "teacher": 5,
            "students": None
        }
        mock_model_to_dict.return_value = expectedResponse

        # Mock authentication as a teacher
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act
        response = self.client.post(
            "/api/courses/create",
            course_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 201)

        data = response.json()

        self.assertEqual(data["id"], 1)
        self.assertEqual(data["title"], "Python")
        self.assertEqual(data["description"], "Learn Python")
        self.assertEqual(data["teacher"], 5)

        mock_create.assert_called_once_with(
            title="Python",
            description="Learn Python",
            teacher_id=5
        )

    @patch.object(views.Course.objects, "create")
    def test_create_course_unsuccessfully_as_student(self, mock_create):

        # Arrange
        # data to be used as to create a course
        course_data = {
            "title": "Python",
            "description": "Learn Python"
        }

        #no need to mock "create" and "model_to_dict" as the request will fail due to authentication issue

        # Mock authentication as a student
        mock_student = self.create_mock_user("student")
        self.client.force_authenticate(user=mock_student)

        # Act
        response = self.client.post(
            "/api/courses/create",
            course_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 403)

        mock_create.assert_not_called()

    @patch.object(views.Course.objects, "filter")
    @patch.object(views, "model_to_dict")
    def test_create_course_unsuccessfully_as_admin__duplicate_course(self, mock_model_to_dict, mock_filter):
        # Arrange
        course_data = {
            "title": "Python",
            "description": "Learn Python"
        }

        # Simulate course already existing
        mock_filter.return_value.exists.return_value = True

        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act
        response = self.client.post(
            "/api/courses/create",
            course_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 400)

        data = response.json()

        self.assertEqual(
            data["error"],
            "A course with this title already exists."
        )

    @patch.object(views.Course.objects, "create")
    def test_create_course_without_authentication(self, mock_create):

        # Arrange
        course_data = {
            "title": "Python",
            "description": "Learn Python"
        }

        # Act
        response = self.client.post(
            "/api/courses/create",
            course_data,
            format="json"
        )

        # Assert
        self.assertIn(response.status_code, [401])

        mock_create.assert_not_called()

    @patch.object(views.Course.objects, "filter")
    def test_create_course_unsuccessfull_missing_desctription(self, mock_filter):

        # Arrange
        # data to be used as to create a course, leave out description so the creation will fail
        course_data = {
            "title": "Python"
        }

        mock_filter.return_value.exists.return_value = False

        # Mock authentication as a teacher
        mock_teacher = self.create_mock_user("teacher")
        self.client.force_authenticate(user=mock_teacher)

        # Act
        response = self.client.post(
            "/api/courses/create",
            course_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 400)

        data = response.json()

        self.assertEqual(
            data["error"],
            "Title and description are required"
        )

    def test_create_course_unsuccessfull_missing_title(self):

        # Arrange
        # data to be used as to create a course, leave out description so the creation will fail
        course_data = {
            "description": "Learn Python"
        }

        # Mock authentication as a teacher
        mock_teacher = self.create_mock_user("teacher")
        self.client.force_authenticate(user=mock_teacher)

        # Act
        response = self.client.post(
            "/api/courses/create",
            course_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 400)

        data = response.json()

        self.assertEqual(
            data["error"],
            "Title and description are required"
        )

# ------------------------------------------------------------------------------------------
# TESTS FOR UPDATING A COURSE
# ------------------------------------------------------------------------------------------

    @patch.object(views.Course.objects, "get")
    def test_update_course_successfully_as_admin(self, mock_get):

        # Arrange
        # data to be used as to create a course
        course_id = 2
        course_teacher_id = 6
        course_data = {
            "title": "Python",
            "description": "Learn Python"
        }

        mock_course = self.create_mock_course(course_id, "JavaScript", "Learn JavaScript", course_teacher_id, None)

        mock_get.return_value = mock_course

        expectedResponse = {
            "id": course_id,
            "title": "Python",
            "description": "Learn Python",
            "teacher": course_teacher_id,
            "students": None
        }

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act
        response = self.client.patch(
            f"/api/courses/{course_id}/update",
            course_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 200)

        data = response.json()

        self.assertEqual(data["id"], 2)
        self.assertEqual(data["title"], "Python")
        self.assertEqual(data["description"], "Learn Python")
        self.assertEqual(data["teacher_id"], course_teacher_id)
        self.assertEqual(mock_course.title, "Python")
        self.assertEqual(mock_course.description, "Learn Python")

        mock_get.assert_called_once_with(id=course_id)
        mock_course.save.assert_called_once()
        
    @patch.object(views.Course.objects, "get")
    def test_update_course_successfully_as_teacher(self, mock_get):

        # Arrange
        # data to be used as to create a course
        course_id = 2
        course_teacher_id = 5
        course_data = {
            "title": "Python",
            "description": "Learn Python"
        }

        mock_course = self.create_mock_course(course_id, "JavaScript", "Learn JavaScript", course_teacher_id, None)

        mock_get.return_value = mock_course

        # Mock authentication as a teacher
        mock_teacher = self.create_mock_user("teacher")
        self.client.force_authenticate(user=mock_teacher)

        # Act
        response = self.client.patch(
            f"/api/courses/{course_id}/update",
            course_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 200)

        data = response.json()

        self.assertEqual(data["id"], course_id)
        self.assertEqual(data["title"], "Python")
        self.assertEqual(data["description"], "Learn Python")
        self.assertEqual(data["teacher_id"], course_teacher_id)
        self.assertEqual(mock_course.title, "Python")
        self.assertEqual(mock_course.description, "Learn Python")

        mock_get.assert_called_once_with(id=course_id)
        mock_course.save.assert_called_once()

    @patch.object(views.Course.objects, "get")
    def test_update_course_unsuccessfully_as_teacher(self, mock_get):

        # Arrange
        # data to be used as to create a course
        course_id = 2
        course_teacher_id = 4
        course_data = {
            "title": "Python",
            "description": "Learn Python"
        }

        mock_course = self.create_mock_course(course_id, "JavaScript", "Learn JavaScript", course_teacher_id, None)

        mock_get.return_value = mock_course

        # Mock authentication as a teacher
        mock_teacher = self.create_mock_user("teacher")
        self.client.force_authenticate(user=mock_teacher)

        # Act
        response = self.client.patch(
            f"/api/courses/{course_id}/update",
            course_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 403)

        data = response.json()

        self.assertEqual(mock_course.title, "JavaScript")
        self.assertEqual(mock_course.description, "Learn JavaScript")

        mock_get.assert_called_once_with(id=course_id)
        mock_course.save.assert_not_called()

    @patch.object(views, "model_to_dict")
    @patch.object(views.Course.objects, "get")
    def test_update_course_unsuccessfully_as_student(self, mock_get, mock_model_to_dict):

        # Arrange
        # data to be used as to create a course
        course_id = 2
        course_teacher_id = 5
        course_data = {
            "title": "Python",
            "description": "Learn Python"
        }
        #mock the course with the same id as the student, not possible in real life unless the role was changed from teacher to student by admin, but in forces the check that a student can not update a course, even if the id is correct.
        mock_course = self.create_mock_course(course_id, "JavaScript", "Learn JavaScript", course_teacher_id, None)

        mock_get.return_value = mock_course

        # mock the model_to_dict function call
        expectedResponse = {
            "id": course_id,
            "title": "JavaScript",
            "description": "Learn JavaScript",
            "teacher": course_teacher_id,
            "students": None
        }
        mock_model_to_dict.return_value = expectedResponse

        # Mock authentication as a student
        mock_student = self.create_mock_user("student")
        self.client.force_authenticate(user=mock_student)

        # Act
        response = self.client.patch(
            f"/api/courses/{course_id}/update",
            course_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 403)

        data = response.json()

        self.assertEqual(mock_course.title, "JavaScript")
        self.assertEqual(mock_course.description, "Learn JavaScript")

        mock_get.assert_not_called()
        mock_course.save.assert_not_called()
        mock_model_to_dict.assert_not_called()
        
    @patch.object(views.Course.objects, "get")
    def test_update_course_successfully_as_admin_missing_description(self, mock_get):

        # Arrange
        # data to be used as to create a course
        course_id = 2
        course_teacher_id = 6
        course_data = {
            "title": "Python",
        }
        
        mock_course = self.create_mock_course(course_id, "JavaScript", "Learn JavaScript", course_teacher_id, None)

        mock_get.return_value = mock_course

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act
        response = self.client.patch(
            f"/api/courses/{course_id}/update",
            course_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 200)

        data = response.json()

        self.assertEqual(data["id"], course_id)
        self.assertEqual(data["title"], "Python")
        self.assertEqual(data["description"], "Learn JavaScript")
        self.assertEqual(data["teacher_id"], course_teacher_id)
        self.assertEqual(mock_course.title, "Python")
        self.assertEqual(mock_course.description, "Learn JavaScript")

        mock_get.assert_called_once_with(id=course_id)
        mock_course.save.assert_called_once()
        
    @patch.object(views, "model_to_dict")
    @patch.object(views.Course.objects, "get")
    def test_update_course_unsuccessfully_as_admin_course_not_found(self, mock_get, mock_model_to_dict):

        # Arrange
        # data to be used as to create a course
        course_id = 2
        
        course_data = {
            "title": "Python",
            "description": "Learn Python"
        }
        
        mock_get.side_effect = views.Course.DoesNotExist
        
        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)
        
        # Act
        response = self.client.patch(
            f"/api/courses/{course_id}/update",
            course_data,
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 404)

        data = response.json()
        self.assertEqual(data["error"], "Course not found")

        mock_get.assert_called_once_with(id=course_id)
        mock_model_to_dict.assert_not_called()

# ------------------------------------------------------------------------------------------
# TESTS FOR DELETING A COURSE
# ------------------------------------------------------------------------------------------
    
    @patch.object(views.Course.objects, "get")
    def test_delete_course_successfully_as_admin(self, mock_get):

        # Arrange
        # data to be used to create a course
        course_id = 2
        course_teacher_id = 6

        mock_course = self.create_mock_course(course_id, "JavaScript", "Learn JavaScript", course_teacher_id, None)

        mock_get.return_value = mock_course

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act
        response = self.client.delete(
            f"/api/courses/{course_id}/remove",
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data["message"], "Course removed")

        mock_get.assert_called_once_with(id=course_id)
        mock_course.delete.assert_called_once()

    @patch.object(views.Course.objects, "get")
    def test_delete_course_successfully_as_teacher(self, mock_get):

        # Arrange
        # data to be used to create a course
        course_id = 2
        course_teacher_id = 5

        mock_course = self.create_mock_course(course_id, "JavaScript", "Learn JavaScript", course_teacher_id, None)

        mock_get.return_value = mock_course

        # Mock authentication as a teacher
        mock_teacher = self.create_mock_user("teacher")
        self.client.force_authenticate(user=mock_teacher)

        # Act
        response = self.client.delete(
            f"/api/courses/{course_id}/remove",
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data["message"], "Course removed")

        mock_get.assert_called_once_with(id=course_id)
        mock_course.delete.assert_called_once()

    @patch.object(views.Course.objects, "get")
    def test_delete_course_unsuccessfully_as_teacher(self, mock_get):

        # Arrange
        # data to be used to create a course
        course_id = 2
        course_teacher_id = 6

        mock_course = self.create_mock_course(course_id, "JavaScript", "Learn JavaScript", course_teacher_id, None)

        mock_get.return_value = mock_course

        # Mock authentication as a teacher
        mock_teacher = self.create_mock_user("teacher")
        self.client.force_authenticate(user=mock_teacher)

        # Act
        response = self.client.delete(
            f"/api/courses/{course_id}/remove",
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 403)
        self.assertEqual(mock_course.title, "JavaScript")
        self.assertEqual(mock_course.description, "Learn JavaScript")


        mock_get.assert_called_once_with(id=course_id)
        mock_course.delete.assert_not_called()

    @patch.object(views.Course.objects, "get")
    def test_delete_course_unsuccessfully_as_student(self, mock_get):

        # Arrange
        # data to be used to create a course
        course_id = 2
        course_teacher_id = 6

        mock_course = self.create_mock_course(course_id, "JavaScript", "Learn JavaScript", course_teacher_id, None)

        mock_get.return_value = mock_course

        # Mock authentication as a student
        mock_student = self.create_mock_user("student")
        self.client.force_authenticate(user=mock_student)

        # Act
        response = self.client.delete(
            f"/api/courses/{course_id}/remove",
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 403)
        self.assertEqual(mock_course.title, "JavaScript")
        self.assertEqual(mock_course.description, "Learn JavaScript")


        mock_get.assert_not_called()
        mock_course.delete.assert_not_called()

    @patch.object(views.Course.objects, "get")
    def test_delete_course_unsuccessfully_as_admin_course_not_found(self, mock_get):

        # Arrange
        # data to be used to create a course
        course_id = 2
        course_teacher_id = 6

        mock_get.side_effect = views.Course.DoesNotExist

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act
        response = self.client.delete(
            f"/api/courses/{course_id}/remove",
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 404)

        data = response.json()
        self.assertEqual(data["error"], "Course not found")

        mock_get.assert_called_once_with(id=course_id)

# ------------------------------------------------------------------------------------------
# TESTS FOR REGISTERING A STUDENT TO A COURSE
# ------------------------------------------------------------------------------------------

    @patch.object(views.Course.objects, "get")
    def test_register_to_course_successfully_as_student(self, mock_get):

        # Arrange:
        # data to be used to create a course
        course_id = 1
        mock_course = self.create_mock_course(course_id, "Python", "Learn Python", 5, [])

        mock_get.return_value = mock_course

        #mock student not already registered to the course
        mock_course.students.filter.return_value.exists.return_value = False

        # Mock authentication as a student
        mock_student = self.create_mock_user("student")
        self.client.force_authenticate(user=mock_student)

        # Act: Call get_courses
        response = self.client.put(f"/api/courses/{course_id}/register")

        # Assert
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data["message"], "Successfully registered")
        mock_get.assert_called_once_with(id=mock_course.id)
        mock_course.students.add.assert_called_once_with(mock_student)

    @patch.object(views.Course.objects, "get")
    def test_register_to_course_unsuccessfully_as_student(self, mock_get):

        # Arrange:
        # data to be used to create a course
        course_id = 1
        mock_course = self.create_mock_course(course_id, "Python", "Learn Python", 5, [])

        mock_get.return_value = mock_course

        #mock student not already registered to the course
        mock_course.students.filter.return_value.exists.return_value = True

        # Mock authentication as a student
        mock_student = self.create_mock_user("student")
        self.client.force_authenticate(user=mock_student)

        # Act: Call get_courses
        response = self.client.put(f"/api/courses/{course_id}/register")

        # Assert
        self.assertEqual(response.status_code, 400)

        data = response.json()
        self.assertEqual(data["error"], "Already registered to this course")
        mock_get.assert_called_once_with(id=mock_course.id)
        mock_course.students.add.assert_not_called()

    @patch.object(views.Course.objects, "get")
    def test_register_to_course_unsuccessfully_as_teacher(self, mock_get):

        # Arrange:
        # data to be used to create a course
        course_id = 1
        mock_course = self.create_mock_course(course_id, "Python", "Learn Python", 5, [])

        mock_get.return_value = mock_course

        #mock student not already registered to the course
        mock_course.students.filter.return_value.exists.return_value = False

        # Mock authentication as a teacher
        mock_teacher = self.create_mock_user("teacher")
        self.client.force_authenticate(user=mock_teacher)

        # Act: Call get_courses
        response = self.client.put(f"/api/courses/{course_id}/register")

        # Assert
        self.assertEqual(response.status_code, 403)
        mock_get.assert_not_called()
        mock_course.students.add.assert_not_called()

    @patch.object(views.Course.objects, "get")
    def test_register_to_course_unsuccessfully_as_admin(self, mock_get):

        # Arrange:
        # data to be used to create a course
        course_id = 1
        mock_course = self.create_mock_course(course_id, "Python", "Learn Python", 5, [])

        mock_get.return_value = mock_course

        #mock student not already registered to the course
        mock_course.students.filter.return_value.exists.return_value = False

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act: Call get_courses
        response = self.client.put(f"/api/courses/{course_id}/register")

        # Assert
        self.assertEqual(response.status_code, 403)
        mock_get.assert_not_called()
        mock_course.students.add.assert_not_called()

    def test_register_to_course_unsuccessfully_not_authenticated(self):

        # Arrange:
        course_id = 1

        # Act: Call get_courses
        response = self.client.put(f"/api/courses/{course_id}/register")

        # Assert
        self.assertEqual(response.status_code, 401)

    @patch.object(views.Course.objects, "get")
    def test_register_to_course_unsuccessfully_as_student_course_not_found(self, mock_get):

        # Arrange:
        # data to be used to create a course
        course_id = 1
        mock_get.side_effect = views.Course.DoesNotExist

        # Mock authentication as a student
        mock_student = self.create_mock_user("student")
        self.client.force_authenticate(user=mock_student)

        # Act: Call get_courses
        response = self.client.put(f"/api/courses/{course_id}/register")

        # Assert
        self.assertEqual(response.status_code, 404)

        data = response.json()
        self.assertEqual(data["error"], "Course not found")
        mock_get.assert_called_once_with(id=course_id)

# ------------------------------------------------------------------------------------------
# TESTS FOR DEREGISTERING A STUDENT FROM A COURSE
# ------------------------------------------------------------------------------------------

    @patch.object(views.Course.objects, "get")
    def test_deregister_to_course_successfully_as_student(self, mock_get):

        # Arrange:
        # data to be used to create a course
        course_id = 1
        mock_course = self.create_mock_course(course_id, "Python", "Learn Python", 5, [])

        mock_get.return_value = mock_course

        #mock student not already registered to the course
        mock_course.students.filter.return_value.exists.return_value = True

        # Mock authentication as a student
        mock_student = self.create_mock_user("student")
        self.client.force_authenticate(user=mock_student)

        # Act: Call get_courses
        response = self.client.put(f"/api/courses/{course_id}/deregister")

        # Assert
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data["message"], "Successfully de-registered")
        mock_get.assert_called_once_with(id=course_id)
        mock_course.students.remove.assert_called_once_with(mock_student)

    
    @patch.object(views.Course.objects, "get")
    def test_deregister_to_course_unsuccessfully_as_student(self, mock_get):

        # Arrange:
        # data to be used to create a course
        course_id = 1
        mock_course = self.create_mock_course(course_id, "Python", "Learn Python", 5, [])

        mock_get.return_value = mock_course

        #mock student not already registered to the course
        mock_course.students.filter.return_value.exists.return_value = False

        # Mock authentication as a student
        mock_student = self.create_mock_user("student")
        self.client.force_authenticate(user=mock_student)

        # Act: Call get_courses
        response = self.client.put(f"/api/courses/{course_id}/deregister")

        # Assert
        self.assertEqual(response.status_code, 404)

        data = response.json()
        self.assertEqual(data["error"], "Not registered to this course")
        mock_get.assert_called_once_with(id=course_id)
        mock_course.students.remove.assert_not_called()

    @patch.object(views.Course.objects, "get")
    def test_deregister_to_course_unsuccessfully_as_teacher(self, mock_get):

        # Arrange:
        # data to be used to create a course
        course_id = 1
        mock_course = self.create_mock_course(course_id, "Python", "Learn Python", 5, [])

        mock_get.return_value = mock_course

        #mock student not already registered to the course
        mock_course.students.filter.return_value.exists.return_value = True

        # Mock authentication as a teacher
        mock_teacher = self.create_mock_user("teacher")
        self.client.force_authenticate(user=mock_teacher)

        # Act: Call get_courses
        response = self.client.put(f"/api/courses/{course_id}/deregister")

        # Assert
        self.assertEqual(response.status_code, 403)
        mock_get.assert_not_called()
        mock_course.students.remove.assert_not_called()

    @patch.object(views.Course.objects, "get")
    def test_deregister_to_course_unsuccessfully_as_admin(self, mock_get):

        # Arrange:
        # data to be used to create a course
        course_id = 1
        mock_course = self.create_mock_course(course_id, "Python", "Learn Python", 5, [])

        mock_get.return_value = mock_course

        #mock student not already registered to the course
        mock_course.students.filter.return_value.exists.return_value = True

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act: Call get_courses
        response = self.client.put(f"/api/courses/{course_id}/deregister")

        # Assert
        self.assertEqual(response.status_code, 403)
        mock_get.assert_not_called()
        mock_course.students.remove.assert_not_called()

    def test_deregister_to_course_unsuccessfully_not_authenticated(self):

        # Arrange:
        course_id = 1

        # Act: Call get_courses
        response = self.client.put(f"/api/courses/{course_id}/deregister")

        # Assert
        self.assertEqual(response.status_code, 401)

    @patch.object(views.Course.objects, "get")
    def test_deregister_to_course_unsuccessfully_as_student_course_not_found(self, mock_get):

        # Arrange:
        # data to be used to create a course
        course_id = 1
        mock_get.side_effect = views.Course.DoesNotExist

        # Mock authentication as a student
        mock_student = self.create_mock_user("student")
        self.client.force_authenticate(user=mock_student)

        # Act: Call get_courses
        response = self.client.put(f"/api/courses/{course_id}/deregister")

        # Assert
        self.assertEqual(response.status_code, 404)

        data = response.json()
        self.assertEqual(data["error"], "Course not found")
        mock_get.assert_called_once_with(id=course_id)

# ------------------------------------------------------------------------------------------
# TESTS FOR DEREGISTERING A STUDENT FROM A COURSE AS ADMIN
# ------------------------------------------------------------------------------------------

    @patch.object(views.Course.objects, "get")
    @patch.object(views.User.objects, "get")
    def test_deregister_student_from_course_successfully_as_admin(self, mock_user_get, mock_course_get):

        # Arrange:
        # data to be used to create a course
        course_id = 1
        student_id = 4

        mock_course = self.create_mock_course(course_id, "Python", "Learn Python", 6, [[{
            "id": student_id,
            "username": "OttoTheOtter",
            "first_name": "Otto",
            "last_name": "van Bezooijen",
            "email": "otto@jvbcourses.com"
        }]])
        mock_course_get.return_value = mock_course

        mock_user = self.create_mock_user("student")
        mock_user.id = student_id
        mock_user_get.return_value = mock_user

        #mock student already registered to the course
        mock_course.students.filter.return_value.exists.return_value = True

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act: Call get_courses
        response = self.client.put(f"/api/courses/{course_id}/deregister-admin",
            {"student_id": student_id},
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 200)

        data = response.json()
        self.assertEqual(data["message"], "Successfully de-registered")
        mock_course_get.assert_called_once_with(id=course_id)
        mock_user_get.assert_called_once_with(id=student_id)
        mock_course.students.filter.assert_called_once_with(id=student_id)
        mock_course.students.remove.assert_called_once_with(mock_user)

    @patch.object(views.Course.objects, "get")
    @patch.object(views.User.objects, "get")
    def test_deregister_student_from_course_unsuccessfully__as_admin__student_not_registered_to_course(self, mock_user_get, mock_course_get):

        # Arrange:
        # data to be used to create a course
        course_id = 1
        student_id = 4

        mock_course = self.create_mock_course(course_id, "Python", "Learn Python", 6, [[{
            "id": student_id,
            "username": "OttoTheOtter",
            "first_name": "Otto",
            "last_name": "van Bezooijen",
            "email": "otto@jvbcourses.com"
        }]])
        mock_course_get.return_value = mock_course

        mock_user = self.create_mock_user("student")
        mock_user.id = student_id
        mock_user_get.return_value = mock_user

        #mock student not already registered to the course
        mock_course.students.filter.return_value.exists.return_value = False

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act: Call get_courses
        response = self.client.put(f"/api/courses/{course_id}/deregister-admin",
            {"student_id": student_id},
            format="json"
        )


        # Assert
        self.assertEqual(response.status_code, 404)

        data = response.json()
        self.assertEqual(data["error"], "Student not registered to this course")
        mock_course_get.assert_called_once_with(id=course_id)
        mock_user_get.assert_called_once_with(id=student_id)
        mock_course.students.filter.assert_called_once_with(id=student_id)
        mock_course.students.remove.assert_not_called()

    @patch.object(views.Course.objects, "get")
    @patch.object(views.User.objects, "get")
    def test_deregister_student_from_course_unsuccessfully__as_admin__student_not_found(self, mock_user_get, mock_course_get):

        # Arrange:
        # data to be used to create a course
        course_id = 1
        student_id = 4
        
        mock_course = self.create_mock_course(course_id, "Python", "Learn Python", 6, [[{
            "id": student_id,
            "username": "OttoTheOtter",
            "first_name": "Otto",
            "last_name": "van Bezooijen",
            "email": "otto@jvbcourses.com"
        }]])
        mock_course_get.return_value = mock_course

        mock_user_get.side_effect = views.User.DoesNotExist

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act: Call get_courses
        response = self.client.put(f"/api/courses/{course_id}/deregister-admin",
            {"student_id": student_id},
            format="json"
        )


        # Assert
        self.assertEqual(response.status_code, 404)

        data = response.json()
        self.assertEqual(data["error"], "Student not found")
        mock_course_get.assert_called_once_with(id=course_id)
        mock_user_get.assert_called_once_with(id=student_id)
        mock_course.students.filter.assert_not_called()
        mock_course.students.remove.assert_not_called()

    @patch.object(views.Course.objects, "get")
    @patch.object(views.User.objects, "get")
    def test_deregister_student_from_course_unsuccessfully__as_admin__course_not_found(self, mock_user_get, mock_course_get):

        # Arrange:
        # data to be used to create a course
        course_id = 1
        student_id = 4
        
        mock_course_get.side_effect = views.Course.DoesNotExist

        mock_user_get.side_effect = views.User.DoesNotExist

        mock_user = self.create_mock_user("student")
        mock_user.id = student_id
        mock_user_get.return_value = mock_user

        # Mock authentication as an admin
        mock_admin = self.create_mock_user("admin")
        self.client.force_authenticate(user=mock_admin)

        # Act: Call get_courses
        response = self.client.put(f"/api/courses/{course_id}/deregister-admin",
            {"student_id": student_id},
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 404)

        data = response.json()
        self.assertEqual(data["error"], "Course not found")
        mock_course_get.assert_called_once_with(id=course_id)
        mock_user_get.assert_not_called()

    def test_deregister_student_from_course_unsuccessfully__as_teacher__forbidden(self):

        # Arrange:
        # data to be used to create a course
        course_id = 1
        student_id = 4

        # Mock authentication as a teacher
        mock_teacher = self.create_mock_user("teacher")
        self.client.force_authenticate(user=mock_teacher)

        # Act: Call get_courses
        response = self.client.put(f"/api/courses/{course_id}/deregister-admin",
            {"student_id": student_id},
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 403)

    def test_deregister_student_from_course_unsuccessfully__as_student__forbidden(self):

        # Arrange:
        # data to be used to create a course
        course_id = 1
        student_id = 4

        # Mock authentication as a student
        mock_student = self.create_mock_user("student")
        self.client.force_authenticate(user=mock_student)

        # Act: Call get_courses
        response = self.client.put(f"/api/courses/{course_id}/deregister-admin",
            {"student_id": student_id},
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 403)

    def test_deregister_student_from_course_unsuccessfully__unauthenticated(self):

        # Arrange:
        # data to be used to create a course
        course_id = 1
        student_id = 4

        # Act: Call get_courses
        response = self.client.put(f"/api/courses/{course_id}/deregister-admin",
            {"student_id": student_id},
            format="json"
        )

        # Assert
        self.assertEqual(response.status_code, 401)