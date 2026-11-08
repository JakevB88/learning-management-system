import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../app/AuthContext";

export default function CoursesPage() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);

    const getCourses = async () => {
        try {

            const response = await fetch(
                `http://127.0.0.1:8000/api/courses/`,
                {
                    method: "GET"
                }
            );

            const data = await response.json();

            if (response.ok) {
                console.log("Courses retreived: ", data)
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

    useEffect(() => {
        getCourses();
    }, []);

    return(
        <div className="coursespage">
            <h2>Courses</h2>
            <div className="courses">
                <p>Summary of the courses available</p>
            </div>
            <div className="courses">
                {courses.map((course) => (
                    <div key={course.id} className="course-item">
                        <p className="courseTitle">Course Title: {course.title}</p>
                        <p className= "courseId">Course ID: {course.id}</p>
                        <p className="courseDescription">Course Description: {course.description}</p>
                        <div>
                            {(user?.role === "admin" || user?.id === course.teacher_id)
                                ?<button onClick={() =>{
                                    navigate(`/update-course/${course.id}`)}}
                                >
                                    Manage Course
                                </button>
                                :<br></br>
                            }
                        </div>
                     
                        <br></br>
                        <br></br>
                        <br></br>
                        <br></br>
                    </div>
                ))}
            </div>
        </div>
    )
}