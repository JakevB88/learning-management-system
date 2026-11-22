import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../app/AuthContext";

export default function UsersPage() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);

    const getUsers = async () => {
        try {
            console.log("trying to retreive all users in UsersPage.js")
            const response = await fetch(
                `http://127.0.0.1:8000/api/users`,
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
                throw new Error(data.error || "Failed to fetch all users.");
            }
            console.log("Users retreived: ", data)
            setUsers(data);
            
        } 
        catch (error){
            console.error(error);
            alert(error.message);
        };
    };

    useEffect(() => {
        getUsers();
    }, []);

    return(
        <div className="contentpage userspage">
            <div className="usersHeader">
                <h2>Users</h2>
                <div>
                    {(user?.role === "admin" )&&
                        <button className="submit submitTopright" onClick={() =>{navigate("/create-user")}}>
                            Add User
                        </button>
                    }
                </div>
            </div>
            <p className="margintop">List of all users</p>
            <div className="users">
                <table className="data-table users-table">
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Name</th>
                            {user?.role === "admin" && <th>Role</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((userr) => (
                            <tr
                                className={user?.role === "admin" || user?.role === "teacher" ? "admin-row" : ""}
                                key={userr.id}     
                                onClick={() => {
                                navigate(`/user/${userr.id}/`);
                                
                            }}>
                                <td>{userr.username}</td>
                                <td>{userr.first_name} {userr.last_name}</td>

                                {user?.role === "admin" && (
                                    <td>{userr.role}</td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                
            </div>
        </div>
    )
}