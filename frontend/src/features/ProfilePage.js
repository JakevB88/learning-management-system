import { useState, useEffect ,useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../app/AuthContext";


export default function ProfilePage() {
    const [username, setUsername] = useState("");
    const [first_name, setFirst_Name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const getUserProfile = async (e) => {
         try {

            const response = await fetch(
                `http://127.0.0.1:8000/api/users/profile/`,
                {
                    method: "GET",
                    headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                }
                }
            );

            const data = await response.json();

            if (response.ok) {
                console.log("User Profile retreived: ", data)
                setUsername(data.username);
                setFirst_Name(data.first_name);
                setLast_name(data.last_name);
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
        getUserProfile();
    }, [user.id]);

    console.log("profile page user: " + user.username)
    console.log("profile page user: " + first_name)

    return (
        <div>
            <div>{username}</div>
            <div>{first_name}</div>
            <div>{last_name}</div>
            <div>{email}</div>
            <div>{role}</div>
            <br></br>
            <br></br>
            <br></br>
            <div>
                <button onClick={() => {
                    navigate(`/update-user/${user.id}`)}}
                >
                    Manage Profile
                </button>
                <br></br>
                
            </div>
        </div>
    );
}
