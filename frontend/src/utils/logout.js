const logout = async () => {
    const res = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
        credentials: 'include'
    });

    if (res.ok) {
        const data = await res.json();
        return data;
    }
}

export default logout;