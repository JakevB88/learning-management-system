import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../app/AuthContext";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const { setUser, getCurrentUser } = useContext(AuthContext);
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                "http://127.0.0.1:8000/api/token",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                    username,
                    password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to sign in, please confirm username and password.");
            }
      
        
            localStorage.setItem("access_token", data.access);
            localStorage.setItem("refresh_token", data.refresh);
        
            await getCurrentUser();
        
            navigate("/profile");
        }
        catch (error){
            console.error(error);
            alert(error.message)
        };

    };

    return (
        <div className="login">
            <h2>Sign in to your account</h2>
            <form className="form login" onSubmit={handleSubmit}>
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
                    placeholder="*********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                    <br></br>
                <button className="submit login" type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}
