import { useState, useEffect, useContext } from "react";
import AuthContext from "../../app/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UpdateUser() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirstname] = useState("");
    const [last_name, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("student");
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        const response = await fetch(
            `http://127.0.0.1:8000/api/users/${user.id}/update`,
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
            navigate("/profile");
        } 
        else {
            alert("Invalid input");
        }
    };
;

    return (
        <div className="contentpage createUserPage">
            <h2>Update user</h2>
            <form className="form createUser" onSubmit={handleUpdateUser}>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={user?.username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="password">Password:  </label>
                <input
                    id="password"
                    type="password"
                    placeholder="password"
                    value={user?.password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="first name">First name</label>
                <input
                    id="first name"
                    type="text"
                    placeholder="first name"
                    value={user?.first_name}
                    onChange={(e) => setFirstname(e.target.value)}
                />
                <label htmlFor="last name">Last name</label>
                <input
                    id="last name"
                    type="text"
                    placeholder="last name"
                    value={user?.last_name}
                    onChange={(e) => setLastname(e.target.value)}
                />
                <label htmlFor="email">eMail</label>
                <input
                    id="email"
                    type="text"
                    placeholder="email"
                    value={user?.email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="role">Role: {user.role}</label>
                <div className="updateUserButtons">
                    <button className="submit createUser">Update Account</button>
                </div>            
            </form>
            
        </div>
        
    );
}
