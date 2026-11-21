import { useState, useEffect ,useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../app/AuthContext";
import DisplayCourse from "./DisplayCourse";


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
                `http://127.0.0.1:8000/api/users/profile`,
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

    useEffect(() => {
        getUserProfile();
    }, [user.id]);

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

    useEffect(() => {
        getCourses();
    }, [user.id]);

    let displayedCourses = [...courses];

        if (user?.role === "student") {
            const registered = [];
            const notRegistered = [];

            for (const course of courses) {
                if (course.students.includes(user.id)) {
                    registered.push(course);
                } else {
                    notRegistered.push(course);
                }
            }

            displayedCourses = [...registered, ...notRegistered];
        }

    console.log("profile page user: " + user.username)
    console.log("profile page user: " + first_name)
    console.log("User ID:", user?.id);
    console.log("Courses:", courses);

    return (
        <div className="contentpage profile">
            <div className="profileHeader">
                <h2>Your Profile</h2>
                <div>
                    <button className="submit submitTopright" onClick={() => {
                        navigate(`/update-user/${user.id}`)}}
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
