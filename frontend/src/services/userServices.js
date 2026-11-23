export async function getUsers() {

    const response = await fetch(
        "http://127.0.0.1:8000/api/users",
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Failed to fetch all users."
        );
    }
    return data;
}


export async function getUser(id) {
    const response = await fetch(
        `http://127.0.0.1:8000/api/users/${id}`,
        {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem("access_token")}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(
            data.error || "Failed to fetch user."
        );
    }


    return data;
}
