import { useNavigate } from "react-router-dom";

export default function ProfilePage() {
    const navigate = useNavigate();

    return(
        <div className="loginpage">
            <h2>Profile</h2>
            <div className="quizzes">
                <p>some information about the user</p>
            </div>
        </div>
    )
}