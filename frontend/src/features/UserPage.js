import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../app/AuthContext";

export default function UpdateUserAdmin() { //was CreatUser
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [first_name, setFirstname] = useState("");
    const [last_name, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("student");
    const [userId, setUserId] = useState("")
    const { user } = useContext(AuthContext);
    const { id } = useParams();
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
            if (!response.ok) {
                throw new Error(data.error || "Failed to fetch user.");
            }
            console.log("User retreived: ", data)
            setUserId(data.id)
            setUsername(data.username);
            setFirstname(data.first_name);
            setLastname(data.last_name);
            setEmail(data.email);
            setRole(data.role);
            
        } 
        catch (error){
            console.error(error);
            alert(error.message);
        };
    };

    useEffect(() => {
        getUser();
    }, [id]);

    return (
        <div className="contentpage createUserPage">
            <div className="usersHeader">
                <h2>Users</h2>
                <div>
                    {(user?.role === "admin" )&&
                        <button className="submit submitTopright" onClick={() =>{navigate(`/admin-update-user/${userId}`)}}>
                            Update User
                        </button>
                    }
                </div>
            </div>
            <table className="data-table profile-table">
                    <tbody>
                        <tr>
                            <th>Username</th>
                            <td>{username}</td>
                        </tr>
                        <tr>
                            <th>ID</th>
                            <td>{userId}</td>
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
        
    );
}
