import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../app/AuthContext";
import settingsIcon from "../lib/images/settings-icon.png";
import tickIcon from "../lib/images/tick-icon.png";
import UpdateCourse from "./UpdateCoursePage";

export default function DisplayCourse({courses = []}) {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleRegistration = async (id) => {
        if (!window.confirm(`Register to Course ${id}?`)) {
            return;
        }
        try {

            const response = await fetch(
                `http://127.0.0.1:8000/api/courses/${id}/register`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Successfully registered");
                //await getCourses();
            } 
            else {
                alert("Course not found");
            }
        } 
        catch (error) {
            console.error(error);
            alert("Error registring to courses");
        }
    }

    const handleDeRegistration = async (id) => {
        if (!window.confirm(`De-register to Course ${id}?`)) {
            return;
        }
        try {

            const response = await fetch(
                `http://127.0.0.1:8000/api/courses/${id}/deregister`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                    }
                }
            );

            const data = await response.json();

            if (response.ok) {
                alert("Successfully deregistered");
                //await getCourses();
            } 
            else {
                alert("Course not found");
            }
        } 
        catch (error) {
            console.error(error);
            alert("Error deregistring to courses");
        }
    }


    return(
        <div className="coursesTiles">
                {courses.map((course) => (
                    <div 
                        key={course.id} 
                        className={
                            user?.role === "admin" || user?.id === course.teacher_id
                                ? "course-item-admin" 
                                : user?.role=== "student"
                                    ?course.students.includes(user?.id) 
                                        ?"course-item-student-registered"
                                        :"course-item-student"
                                    :"course-item"
                        }
                        onClick={
                            user?.role === "admin" || user?.id === course.teacher_id
                                ? () => navigate(`/update-course/${course.id}`) 
                                : user?.role === "student" 
                                    ? course.students.includes(user?.id) 
                                            ? () => handleDeRegistration(course.id)
                                            : () => handleRegistration(course.id)
                                    : undefined
                        }
                    >
                    <div className="courseCardHeader">
                        <h3 className="courseTitle">{course.title}</h3>
                        {(user?.role === "admin" || user?.id === course.teacher_id) 
                            ? <img
                                    className="settingsIcon"
                                    src={settingsIcon}
                                    alt="settings"
                                />
                            :course.students.includes(user?.id)
                                &&<img
                                    className="settingsIcon"
                                    src={tickIcon}
                                    alt="tick"
                                />
                        }
                    </div>
                    <h4 className="courseDescription">{course.description}</h4>
                    <h5 className="studentnumber">students: {course.students.length}</h5>
                    </div>
                ))}
        </div>
    )
}
