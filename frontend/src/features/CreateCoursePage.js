import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../app/AuthContext";


export default function CreateUser() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [teacher, setteacher] = useState("");
    const [id, setId] = useState("")
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    console.log("Create course:", user);

    const handleSubmitCourse = async (e) => {
        e.preventDefault();

        const response = await fetch(
            `http://127.0.0.1:8000/api/courses/create`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify({
                title,
                description,
                teacher: user.id
                }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            console.log("Course create response: ", data)
            alert("Course Created!");
            navigate("/courses");
        } 
        else {
            alert("Invalid input");
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmitCourse}>
                <input
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <br></br>
                <input
                    type="text"
                    placeholder="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <br></br>
                <br></br>
                <button type="submit">Create Course</button>
            </form>
        </div>
    );
}
