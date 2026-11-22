import { useState, useEffect ,useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../app/AuthContext";
import DisplayCourse from "../courses/DisplayCourse";
import { getCourses } from "../../services/courseService";


export default function ProfilePage() {
    const [courses, setCourses] = useState([])
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

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

    let displayedCourses = [...courses];
        if (user?.role === "student") {
            const registered = [];
            const notRegistered = [];

            for (const course of courses) {
                if (course.students.includes(user.id)) {
                    registered.push(course);
                } 
            }

            displayedCourses = [...registered, ...notRegistered];
        }
        else if (user?.role === "teacher" || user?.role === "admin") {
            const teachersCourse = [];

            for (const course of courses) {
                if (course.teacher_id === user.id) {
                    teachersCourse.push(course);
                } 
            }
            
            displayedCourses = [...teachersCourse];
        }

    return (
        <div className="contentpage profile">
            <div className="profileHeader">
                <h2>Your Profile</h2>
                <div>
                    <button className="submit submitTopright" onClick={() => {
                        {user?.role === "admin"
                            ? navigate(`/admin-update-user/${user.id}`)
                            : navigate(`/update-user/${user.id}`)
                        }
                    }}
                    >
                        Manage Profile
                    </button>
                </div>
            </div>
            <div className="users">
                <table className="data-table profile-table">
                    <tbody>
                        <tr>
                            <th>Username</th>
                            <td>{user?.username}</td>
                        </tr>
                        <tr>
                            <th>First Name</th>
                            <td>{user?.first_name}</td>
                        </tr>
                        <tr>
                            <th>Last Name</th>
                            <td>{user?.last_name}</td>
                        </tr>
                        <tr>
                            <th>Email</th>
                            <td>{user?.email}</td>
                        </tr>
                        <tr>
                            <th>Role</th>
                            <td>{user?.role}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className="margintop">
            {user?.role === "student"
                ?<h2>Your courses</h2>
                :<h2>Your created courses</h2>
            }
                <DisplayCourse courses={displayedCourses}/>
                
            </div>
        </div>
            
    );
}
