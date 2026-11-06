import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateUser() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirstname] = useState("");
    const [last_name, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [isstaff, setIsStaff] = useState(false);
    const [isactive, setIsActive] = useState(true);
    const [role, setRole] = useState("student");
    const [id, setId] = useState("");
    const navigate = useNavigate();
    
    const handleSubmitUser = async (e) => {
        e.preventDefault();
        console.log("Role being sent:", role);
        console.log("Access token:");
        console.log(localStorage.getItem("access_token"));
        const response = await fetch(
            `http://127.0.0.1:8000/api/users/create-staff/`,
            {
                method: "POST",
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
            console.log("user create response: ", data)
            alert("User Created!");
            navigate("/create-user");
        } 
        else {
            alert("Invalid input");
        }
    };

    const handleDeleteUser = async (e) => {
        e.preventDefault();
        if (!window.confirm(`Delete user ${id}?`)) {
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
            setId("");
            navigate("/create-user");
        } 
        else {
            alert("Invalid input");
        }
    };

    return (
        <div>
            <form onSubmit={handleSubmitUser}>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <br></br>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br></br>
                <input
                    type="text"
                    placeholder="first name"
                    value={first_name}
                    onChange={(e) => setFirstname(e.target.value)}
                />
                <br></br>
                <input
                    type="text"
                    placeholder="last name"
                    value={last_name}
                    onChange={(e) => setLastname(e.target.value)}
                />
                <br></br>
                <input
                    type="text"
                    placeholder="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <br></br>
                <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="student">Student</option>
                    <option value="teacher">Teacher</option>
                    <option value="admin">Admin</option>
                </select>
                <br></br>
                <br></br>
                <button type="submit">Create User</button>
            </form>

            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>

            <form onSubmit={handleDeleteUser}>
                <input
                    type="number"
                    placeholder="User ID"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />
                <br></br>
                <br></br>
                <button type = "submit">
                    Delete User
                </button>
            </form>
            
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>
            <br></br>

            <button onClick={navigate/"update-user"}>
                    Update users
            </button>
        </div>
    );
}
