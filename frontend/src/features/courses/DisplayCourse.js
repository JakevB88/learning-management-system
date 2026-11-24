import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../app/AuthContext";
import settingsIcon from "../../lib/images/settings-icon.png";
import tickIcon from "../../lib/images/tick-icon.png";
import { registerToCourse } from "../../services/courseServices";
import { deregisterFromCourse } from "../../services/courseServices";

export default function DisplayCourse({courses = [], refreshCourses}) {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const handleRegistration = async (id) => {
        if (!window.confirm(`Register to Course ${id}?`)) {
            return;
        }

        try {
            await registerToCourse(id);
            await refreshCourses();
            alert("Successfully registered");
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };

    const handleDeRegistration = async (id) => {
        if (!window.confirm(`Register to Course ${id}?`)) {
            return;
        }

        try {
            await deregisterFromCourse(id);
            await refreshCourses();
            alert("Successfully deregistered");
        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    };


    return(
        <div className="coursesTiles">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className={
                            user?.role === "admin" || user?.id === course.teacher_id
                                ? "course-item-admin"
                                : user?.role=== "student"
                                    ?course.students.includes(user?.id)
                                        ?"course-item-student-registered"
                                        :"course-item-student"
                                    :"course-item"
                        }
                        onClick={
                            user?.role === "admin" || user?.id === course.teacher_id
                                ? () => navigate(`/update-course/${course.id}`)
                                : user?.role === "student"
                                    ? course.students.includes(user?.id)
                                            ? () => handleDeRegistration(course.id)
                                            : () => handleRegistration(course.id)
                                    : undefined
                        }
                    >
                    <div className="courseCardHeader">
                        <h3 className="courseTitle">{course.title}</h3>
                        {(user?.role === "admin" || user?.id === course.teacher_id)
                            ? <img
                                    className="settingsIcon"
                                    src={settingsIcon}
                                    alt="settings"
                                />
                            :course.students.includes(user?.id)
                                &&<img
                                    className="settingsIcon"
                                    src={tickIcon}
                                    alt="tick"
                                />
                        }
                    </div>
                    <h4 className="courseDescription">{course.description}</h4>
                    <h5 className="studentnumber">Students: {course.students.length}</h5>
                    </div>
                ))}
        </div>
    )
}
