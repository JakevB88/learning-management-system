import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../services/api";

export default function CreateUser() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirstname] = useState("");
    const [last_name, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    const handleSubmitUser = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(
                `${API_URL}/api/users/create`,
                {
                    method: "POST",
                    headers: {
                    "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                    username,
                    password,
                    first_name,
                    last_name,
                    email,
                    is_staff: false,
                    is_active: true,
                    role: "student"
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to create user")
            }

            alert("User Created!");
            navigate("/");

        }
        catch (error) {
            console.error(error);
            alert(error.message);
        };
    };

    return (
        <div className="contentpage login">
            <h2>Sign up to JvB Courses</h2>
            <p>sign up to get access to all our courses</p>
            <form className="form signup" onSubmit={handleSubmitUser}>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                <button className="submit signup" type="submit">Create User</button>
            </form>
        </div>
    );
}
