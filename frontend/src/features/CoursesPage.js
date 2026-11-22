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
            
            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch courses")
            }

            setCourses(data);
            
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