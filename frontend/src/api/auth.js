const API_URL = "http://localhost:3000/api/auth";

export async function signIn({ email, password, rememberMe }) {
    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
            rememberMe,
        }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message);
    }

    return result;
}

export async function register({ nationalId, email }) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            nationalId,
            email,
        }),
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message);
    }

    return result;
}

export async function verifyCode({ email, code }) {
    const response = await fetch(
        `${API_URL}/verify-registration`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email,
                code,
            }),
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message);
    }

    return result;
}