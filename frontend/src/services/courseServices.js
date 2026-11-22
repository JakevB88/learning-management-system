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