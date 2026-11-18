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

            if (response.ok) {
                console.log("Users retreived: ", data)
                setUsers(data);
            } 
            else {
                alert("Users not found");
            }
        } 
        catch (error) {
            console.error(error);
            alert("Error retrieving users");
        }
    };

    useEffect(() => {
        getUsers();
    }, []);

    return(
        <div className="contentpage userspage">
            <h2>Users</h2>
            <p>List of all users</p>
            <div className="users">
                <table className="data-table users-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            {user?.role === "admin" && <th>Role</th>}
                            {user?.role === "admin" && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((userr) => (
                            <tr key={userr.id}>
                                <td>{userr.id}</td>
                                <td>{userr.username}</td>
                                <td>{userr.first_name}</td>
                                <td>{userr.last_name}</td>
                                <td>{userr.email}</td>

                                {user?.role === "admin" && (
                                    <td>{userr.role}</td>
                                )}

                                {user?.role === "admin" && (
                                    <td>
                                        <button className="table-button"
                                            onClick={() =>
                                                navigate(`/admin-update-user/${userr.id}/`)
                                            }
                                        >
                                            Manage User
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div>
                {(user?.role === "admin" )&&
                    <button className="submit adduser" onClick={() =>{navigate("/create-user")}}>
                        Add User
                    </button>
                }
            </div>
            </div>
        </div>
    )
}