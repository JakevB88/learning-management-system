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
            <br></br>
            <br></br>
            <div>
                {(user?.role === "admin"|| user?.role === "teacher") && (
                    <button onClick={() => {
                        navigate("/create-course")}}
                    >
                        Add course
                    </button>
                )}                
            </div>
            <br></br>
            <br></br>
            <div className="courses">
                <table className="data-table courses-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            {/*<th>Teacher</th>*/}
                            <th>Title</th>
                            <th>Description</th>
                            {(user?.role === "admin" || user?.role === "teacher") && (
                                <th>Actions</th>
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {courses.map((course) => (
                            <tr key={course.id}>
                                <td>{course.id}</td>
                                {/*<td>{course.teacher_id}</td>*/}
                                <td>{course.title}</td>
                                <td>{course.description}</td>

                                {(user?.role === "admin" ||
                                    user?.id === course.teacher_id) ?(
                                    <td>
                                        <button
                                            onClick={() =>
                                                navigate(`/update-course/${course.id}`)
                                            }
                                        >
                                            Manage Course
                                        </button>
                                    </td>
                                    )
                                    :(
                                        <td>N/A</td>
                                    )
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}