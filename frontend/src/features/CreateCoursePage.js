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
        
        try {
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

            if (!response.ok) {
                throw new Error(data.error || "Failed to create course, name and description required.");
            }
            
            alert("Course Created!");
            navigate("/courses");
        }
        catch (error) {
            console.error(error);
            alert(error.message);
        };
    };


    return (
        <div className="contentPage - updateCourse">
            <h2>Manage course: {title}</h2>
            <form onSubmit={handleSubmitCourse}>
                <label for="coursename">Course name: </label>
                <input
                    id="coursename"
                    placeholder="Title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <br></br>
                <label for="coursedescription">Course description: </label>
                <input
                    id="coursedescription"
                    type="text"
                    placeholder="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <button className="submit updateCourse" type="submit">Create Course</button>
            </form>
        </div>
    );
}
