import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../app/AuthContext";
import DisplayCourse from "./DisplayCourse";

export default function CoursesPage() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);

    
    
    const getCourses = async () => {
        try {

            const response = await fetch(
                `http://127.0.0.1:8000/api/courses`,
                {
                    method: "GET"
                }
            );

            const data = await response.json();

            if (response.ok) {
                console.log("Courses retreived: ", data)
                console.log(data);
                setCourses(data);
            } 
            else {
                alert("Courses not found");
            }
        } 
        catch (error) {
            console.error(error);
            alert("Error retrieving courses");
        }
    };

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
                console.log("Registered to course: ", data)
                alert("Successfully registered");
                await getCourses();
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
                console.log("DeRegistered to course: ", data)
                alert("Successfully deregistered");
                await getCourses();
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

    useEffect(() => {
        getCourses();
    }, []);

    return(
        <div className="contentPage courses">
            <div className="courseCardHeader">
                <h2>Courses</h2>
                <div>
                    {(user?.role === "admin"|| user?.role === "teacher") && (
                        <button className="submit submitTopright" onClick={() => {
                            navigate("/create-course")}}
                        >
                            Add course
                        </button>
                    )}                
                </div>
            </div>
            <div className="courses margintop">
                <p>Summary of the courses available</p>
            </div>

            <div>
                <DisplayCourse courses={courses}/>
            </div>
        </div>
    )
}