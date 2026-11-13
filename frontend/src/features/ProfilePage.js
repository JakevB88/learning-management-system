import { useState, useEffect ,useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../app/AuthContext";


export default function ProfilePage() {
    const [username, setUsername] = useState("");
    const [first_name, setFirst_Name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [courses, setCourses] = useState([])
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const getUserProfile = async (e) => {
         try {

            const response = await fetch(
                `http://127.0.0.1:8000/api/users/profile/`,
                {
                    method: "GET",
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                }
                }
            );

            const data = await response.json();

            if (response.ok) {
                console.log("User Profile retreived: ", data)
                setUsername(data.username);
                setFirst_Name(data.first_name);
                setLast_name(data.last_name);
                setEmail(data.email);
                setRole(data.role);
            } 
            else {
                alert("User not found");
            }
        } 
        catch (error) {
            console.error(error);
            alert("Error retrieving user");
        }
    };

    const handleDeRegistration = async (id) => {
        if (!window.confirm(`De-register to Course ${id}?`)) {
            return;
        }
        try {

            const response = await fetch(
                `http://127.0.0.1:8000/api/courses/${id}/deregister/`,
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
        getUserProfile();
    }, [user.id]);

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

    useEffect(() => {
        getCourses();
    }, [user.id]);


    console.log("profile page user: " + user.username)
    console.log("profile page user: " + first_name)

    return (
        <div>
            <h1>Profile</h1>
            <div className="users">
                <table className="data-table users-table">
                    <tbody>
                        <tr>
                            <th>Username</th>
                            <td>{username}</td>
                        </tr>

                        <tr>
                            <th>First Name</th>
                            <td>{first_name}</td>
                        </tr>

                        <tr>
                            <th>Last Name</th>
                            <td>{last_name}</td>
                        </tr>

                        <tr>
                            <th>Email</th>
                            <td>{email}</td>
                        </tr>

                        <tr>
                            <th>Role</th>
                            <td>{role}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <br></br>
            <br></br>
            <br></br>
            <div>
                <button onClick={() => {
                    navigate(`/update-user/${user.id}`)}}
                >
                    Manage Profile
                </button>
                <br></br>
                
            </div>
            <br></br>
            <br></br>
            <br></br>
            {user?.role === "student"
                ?<h2>Your courses</h2>
                :<h2>Your created courses</h2>
            }
            <br></br>
            <div className="courses">
                <table className="data-table courses-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            {/*<th>Teacher</th>*/}
                            <th>Title</th>
                            <th>Description</th>
                            {(user?.role === "student") && (<th>Progress</th>)}
                            <th>Actions</th>
                            
                            
                        </tr>
                    </thead>
                    <tbody>
                        {courses.map((course) => (
                            (user?.role === "student")
                                ?course.students.includes(user?.id)
                                    &&(<tr key={course.id}>
                                            <td>{course.id}</td>
                                            <td>{course.title}</td>
                                            <td>{course.description}</td>
                                            <td>80%</td>
                                            <td>
                                                <button onClick={() => handleDeRegistration(course.id)}>
                                                        Deregister
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                :(user?.id === course.teacher_id)
                                     &&(<tr key={course.id}>
                                            <td>{course.id}</td>
                                            <td>{course.title}</td>
                                            <td>{course.description}</td>
                                            <td>
                                                <button
                                                    onClick={() =>
                                                        navigate(`/update-course/${course.id}`)
                                                    }
                                                >
                                                    Manage Course
                                                </button>
                                            </td>
                                        </tr>
                                    )
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
