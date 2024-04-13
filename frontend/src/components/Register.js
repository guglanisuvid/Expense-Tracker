import { useEffect, useState } from "react"; // Import the useEffect and useState hooks from the react library
import { Link, useNavigate } from "react-router-dom"; // Import the Link and useNavigate components from the react-router-dom library

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate(); // To navigate to different routes

    // Register new user
    const registerUser = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Fetch API to register new user
        const res = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                email,
                password
            }),
            credentials: 'include'
        });

        if (res.ok) {
            const data = await res.json();
            data.error ? alert(data.message) : navigate('/profile');
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
                    data.user ? navigate('/profile') : navigate('/'); // If user is authenticated, navigate to profile page, else navigate to home page
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
                <p className="text-3xl font-semibold text-center my-3">Sign Up</p> {/* Sign Up heading */}
                {/* Form to register new user */}
                <form onSubmit={registerUser} method="POST" className="flex flex-col gap-3">
                    {/* Input field for username */}
                    <input
                        type="text"
                        name="username"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="Username"
                        className="px-6 py-3 rounded-xl bg-slate-50 text-slate-800 font-medium outline-none border-0"
                    />
                    {/* Input field for email */}
                    <input
                        type="email"
                        name="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Email"
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
                        value="Sign Up"
                        className="px-6 py-3 rounded-xl bg-slate-800 text text-slate-200 font-medium tracking-wider"
                    />
                </form>
                {/* Link to Login component */}
                <p className="my-3">
                    Already a user? <Link to="/login">
                        <span className="font-medium">
                            Sign In</span>
                    </Link>
                </p>
            </div>
        </div>
    )
}
export default Register;