export async function getCourses() {
    const response = await fetch(
        "http://127.0.0.1:8000/api/courses",
        {
            method: "GET",
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Failed to fetch courses"
        );
    }

    return data;
}


export async function getCourse(id) {
    const response = await fetch(
        `http://127.0.0.1:8000/api/courses/${id}`
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Failed to fetch course."
        );
    }

    return data;
}

export async function registerToCourse(courseId) {
    const response = await fetch(
        `http://127.0.0.1:8000/api/courses/${courseId}/register`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to register to course.");
    }

    return data;
}

export async function deregisterFromCourse(courseId) {
    const response = await fetch(
        `http://127.0.0.1:8000/api/courses/${courseId}/deregister`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Failed to deregister from course.");
    }

    return data;
}