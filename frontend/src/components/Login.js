import { useEffect, useState } from "react"; // Import the useEffect and useState hooks from the react library
import { Link, useNavigate } from "react-router-dom"; // Import the Link and useNavigate components from the react-router-dom library

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate(); // To navigate to different routes

    const loginUser = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Fetch API to login user
        const res = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            }),
            credentials: 'include'
        });

        if (res.ok) {
            const data = await res.json();
            data.error ? alert(data.message) : navigate('/profile'); // If error, alert the message, else navigate to profile
        }
    }

    // Check if user is authenticated
    useEffect(() => {
        const isAuthenticated = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/is-authenticated',
                    {
                        credentials: 'include'
                    });
                if (res.ok) {
                    const data = await res.json();
                    data.user ? navigate('/profile') : navigate('/login');
                }
            } catch (err) {
                console.error(err);
            }
        };

        isAuthenticated();
    }, [navigate]);

    return (
        <div className="relative h-dvh w-dvw bg-slate-500 text-slate-800 tracking-wider">
            <div className="w-1/5 absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
                <p className="text-3xl font-semibold text-center my-3">Sign In</p> {/* Sign In heading */}
                {/* Form to login user */}
                <form onSubmit={loginUser} method="POST" className="flex flex-col gap-3">
                    {/* Input field for username */}
                    <input
                        type="username"
                        name="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Username"
                        className="px-6 py-3 rounded-xl bg-slate-50 text-slate-800 font-medium outline-none border-0"
                    />
                    {/* Input field for password */}
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Password"
                        className="px-6 py-3 rounded-xl bg-slate-50 text-slate-800 font-medium outline-none border-0"
                    />
                    {/* Submit button */}
                    <input
                        type="submit"
                        value="Sign In"
                        className="px-6 py-3 rounded-xl bg-slate-800 text text-slate-200 font-medium tracking-wider"
                    />
                </form>
                {/* Link to sign up */}
                <p className="my-3">
                    New User? <Link to="/">
                        <span className="font-medium">
                            Sign Up
                        </span>
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Login;