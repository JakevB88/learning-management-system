import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../app/AuthContext";
import DisplayCourse from "./DisplayCourse";
import { getCourses } from "../../services/courseService";

export default function CoursesPage() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [courses, setCourses] = useState([]);

    useEffect(() => {
        const loadCourses = async () => {
            try {
                const data = await getCourses();
                setCourses(data);
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        };

        loadCourses();
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