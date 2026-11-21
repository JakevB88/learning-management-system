import { useState, useEffect ,useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../app/AuthContext";


export default function UpdateCourse() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [teacher, setteacher] = useState("");
    const [course, setCourse] = useState("");
    const [students, setStudents] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);


    const getCourse = async (e) => {
         try {

            const response = await fetch(
                `http://127.0.0.1:8000/api/courses/${id}`,
                {
                    method: "GET"
                }
            );

            const data = await response.json();

            if (response.ok) {
                console.log("Course retreived: ", data)
                setTitle(data.title);
                setDescription(data.description);
                setStudents(data.students)
            } 
            else {
                alert("Course not found");
            }
        } 
        catch (error) {
            console.error(error);
            alert("Error retrieving course");
        }
    };

    const handleSubmitCourseUpdate = async (e) => {
        e.preventDefault();

        const response = await fetch(
            `http://127.0.0.1:8000/api/courses/${id}/update`,
            {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                },
                body: JSON.stringify({
                    title,
                    description,
                }),
            }
        );

        const data = await response.json();

        if (response.ok) {
            console.log("Course create response: ", data)
            alert("Course Updated!");
            navigate("/courses");
        } 
        else {
            alert("Invalid input");
        }
    };

    const handleDeleteCourse = async (e) => {
        e.preventDefault();
        if (!window.confirm(`Delete Course ${id}?`)) {
            return;
        }
        const response = await fetch(
            `http://127.0.0.1:8000/api/courses/${id}/remove`,
            {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
                }
            }
        );

        const data = await response.json();

        if (response.ok) {
            console.log("course deleted: ", data)
            alert("course Deleted!");
            navigate("/courses");
        } 
        else {
            alert("Invalid input");
        }
    }

    useEffect(() => {
        getCourse();
    }, [id]);

    return (
        <div className="contentPage - updateCourse">
            <h2>Manage course: {title}</h2>
            <form onSubmit={handleSubmitCourseUpdate}>
                <label for="coursename">Course name: </label>
                <input
                    id="coursename"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <br></br>
                <label for="coursedescription">Course description: </label>
                <input
                    id="coursedescription"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <div className="updateUserButtons">
                    <button className="submit update" type="submit">Update Course</button>
                    <button className="submit delete" onClick={handleDeleteCourse}>Delete Course</button>
                </div> 
            </form>
            
            <div className="users margintop">
                {students?.length === 1
                    ?<h2> {students?.length} student registered to: {title}</h2>
                    :<h2> {students?.length} students registered to: {title}</h2>
                }
                {students.length > 0 ?
                    <div className="users">
                        <table className="data-table users-table">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <th>Name</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((userr) => (
                                    <tr
                                        className={user?.role === "admin" || user?.role === "teacher" ? "admin-row" : ""}
                                        key={userr.id}     
                                        onClick={() => {
                                        navigate(`/user/${userr.id}/`);
                                        
                                    }}>
                                        <td>{userr.username}</td>
                                        <td>{userr.first_name} {userr.last_name}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        
                    </div>
                    : <p className="margintop">No students are registered to this course. </p>
                }
                
            </div>
            
        </div>
    );
}
