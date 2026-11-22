import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../app/AuthContext";
import { getUsers } from "../../services/userServices";

export default function UsersPage() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const loadUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch (error) {
                console.error(error);
                alert(error.message);
            }
        };

        loadUsers();
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