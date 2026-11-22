import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../../app/AuthContext";

export default function UpdateUserAdmin() { //was CreatUser
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirstname] = useState("");
    const [last_name, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("student");
    const [userId, setUserId] = useState("")
    const { id } = useParams();
    const { user, setUser, getCurrentUser  } = useContext(AuthContext)
    const navigate = useNavigate();
    
    
    const getUser = async (e) => {
         try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/users/${id}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                    },
                }
            );

            const data = await response.json();

            if (response.ok) {
                console.log("User retreived: ", data)
                setUserId(data.id)
                setUsername(data.username);
                setFirstname(data.first_name);
                setLastname(data.last_name);
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
        getUser();
    }, [id]);


    const handleUpdateUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/users/${id}/update`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                    },
                    body: JSON.stringify({
                    username,
                    password,
                    first_name,
                    last_name,
                    email,
                    is_staff: false,
                    is_active: true,
                    role
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to update user.");
            }

            alert("User Updated: " + username);
            if (role !== "admin" && Number(id) === user?.id) {
                await getCurrentUser();
                navigate("/profile");
            }
            else {
                navigate("/users");
            }
        }
        catch (error) {
            console.error(error);
            alert(error.message);
        }        
    };

    const handleDeleteUser = async (e) => {
        e.preventDefault();
        if (!window.confirm(`Delete user ${username}?`)) {
            return;
        }
        try {
            const response = await fetch(
                `http://127.0.0.1:8000/api/users/${id}/remove`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                    }
                }
            );

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || "Failed to delete user");
            }

            alert("User deleted!");

            if (Number(id) === user?.id) {
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");

                setUser(null);
                navigate("/profile");
            }
            else {
                navigate("/users");
            }
            
        } 
        catch (error) {
            console.error(error);
            alert(error.message);
        }
    };


    return (
        <div className="contentpage createUserPage">
            <h2>Update user</h2>
            <form className="form createUser" onSubmit={handleUpdateUser}>
                <label htmlFor="username">User ID: {userId}</label>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="first name">First name</label>
                <input
                    id="first name"
                    type="text"
                    placeholder="first name"
                    value={first_name}
                    onChange={(e) => setFirstname(e.target.value)}
                />
                <label htmlFor="last name">Last name</label>
                <input
                    id="last name"
                    type="text"
                    placeholder="last name"
                    value={last_name}
                    onChange={(e) => setLastname(e.target.value)}
                />
                <label htmlFor="email">eMail</label>
                <input
                    id="email"
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="role">Role</label>
                <div>
                    <select 
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <option value="student">Student</option>
                        <option value="teacher">Teacher</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>
                <div className="updateUserButtons">
                    <button className="submit update">Update User</button>
                    <button className="submit delete" onClick={handleDeleteUser}>Delete User</button>
                </div>            
            </form>
            
        </div>
        
    );
}
