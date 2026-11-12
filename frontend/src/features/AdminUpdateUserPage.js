import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function UpdateUserAdmin() { //was CreatUser
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirstname] = useState("");
    const [last_name, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [isstaff, setIsStaff] = useState(false);
    const [isactive, setIsActive] = useState(true);
    const [role, setRole] = useState("student");
    const { id } = useParams();
    const navigate = useNavigate();
    
    
    const getUser = async (e) => {
         try {
            console.log("User ID transferred to update page: " + id)
            const response = await fetch(
                `http://127.0.0.1:8000/api/users/${id}/`,
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

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const response = await fetch(
            `http://127.0.0.1:8000/api/users/${id}/update/`,
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

        if (response.ok) {
            console.log("user aupdate response: ", data)
            alert("User Updated: " + username);
            navigate("/users");
        } 
        else {
            alert("Invalid input");
        }
    };

    const handleDeleteUser = async (e) => {
        e.preventDefault();
        if (!window.confirm(`Delete user ${username}?`)) {
            return;
        }
        const response = await fetch(
            `http://127.0.0.1:8000/api/users/${id}/remove/`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                }
            }
        );

        const data = await response.json();

        if (response.ok) {
            console.log("user deleted: ", data)
            alert("User Deleted!");
            navigate("/users");
        } 
        else {
            alert("Invalid input");
        }
    };

    useEffect(() => {
        getUser();
    }, [id]);

    return (
        <div>
            <form onSubmit={handleUpdateUser}>
                <label for="username">Username: </label>
                <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br></br>
                <label for="password">Password:  </label>
                <input
                    id="password"
                    type="password"
                    placeholder="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br></br>                
                <label for="first name">First Name:  </label>
                <input
                    id="first name"
                    type="text"
                    placeholder="first name"
                    value={first_name}
                    onChange={(e) => setFirstname(e.target.value)}
                />
                <br></br>
                <label for="last name">Last Name: </label>
                <input
                    id="last name"
                    type="text"
                    placeholder="last name"
                    value={last_name}
                    onChange={(e) => setLastname(e.target.value)}
                />
                <br></br>
                <label for="email">eMail: </label>
                <input
                    id="email"
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br></br>
                <label for="role">Role: </label>
                <select
                    id="role"
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                </select>
                <br></br>
                <br></br>
                <button type="submit">Update User</button>
            </form>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <button onClick={handleDeleteUser}>Delete User</button>
            
        </div>
    );
}
