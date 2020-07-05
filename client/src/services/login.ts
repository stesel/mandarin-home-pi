export async function userAuthentication() {
    if (process.env.NODE_ENV === "development") {
        return true;
    }

    const password = prompt("Enter password:", "");
    const requestOptions: RequestInit = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: password }),
    };

    const response = await fetch("/users/authenticate", requestOptions);
    return response.ok;
}
