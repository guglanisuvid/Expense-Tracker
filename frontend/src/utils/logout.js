const logout = async () => {
    const res = await fetch('http://localhost:5000/api/logout', {
        credentials: 'include'
    });

    if (res.ok) {
        const data = await res.json();
        return data;
    }
}

export default logout;