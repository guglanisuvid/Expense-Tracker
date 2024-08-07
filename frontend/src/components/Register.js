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
        try {
            const res = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
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
                data?.error ? alert(data?.message) : navigate('/dashboard');
            } else {
                alert("Something went wrong");
            }
        } catch (e) {
            alert("Something went wrong");
        }
    };

    // Check if user is authenticated
    useEffect(() => {
        const isAuthenticated = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_API_URL}/is-authenticated`,
                    {
                        method: 'GET',
                        credentials: 'include'
                    }
                );

                if (res.ok) {
                    const data = await res.json();
                    data?.user ? navigate('/dashboard') : navigate('/'); // If user is authenticated, navigate to dashboard page, else navigate to home page
                }
            } catch (err) {
                console.error(err);
            }
        };

        isAuthenticated();
    }, [navigate]);

    return (
        <div className="w-3/4 sm:w-1/2 md:w-[40%] lg:w-1/3 xl:w-1/4 2xl:w-1/5 max-w-[400px] absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
            <p className="text-3xl font-semibold text-center my-4">SIGN UP</p> {/* Sign Up heading */}

            {/* Form to register new user */}
            <form onSubmit={registerUser} method="POST" className="flex flex-col gap-4">
                {/* Input field for username */}
                <input
                    className="p-4 rounded-full border-none outline-none bg-[#1C1C1C] text-[#F6F6F6] focus:shadow-lg hover:shadow-lg focus:bg-[#2C2C2C] hover:bg-[#2C2C2C] transition-all duration-300 ease-in-out"
                    type="text"
                    name="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    placeholder="Username"
                />

                {/* Input field for email */}
                <input
                    className="p-4 rounded-full border-none outline-none bg-[#1C1C1C] text-[#F6F6F6] focus:shadow-lg hover:shadow-lg focus:bg-[#2C2C2C] hover:bg-[#2C2C2C] transition-all duration-300 ease-in-out"
                    type="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="Email"
                />
                {/* Input field for password */}
                <input
                    className="p-4 rounded-full border-none outline-none bg-[#1C1C1C] text-[#F6F6F6] focus:shadow-lg hover:shadow-lg focus:bg-[#2C2C2C] hover:bg-[#2C2C2C] transition-all duration-300 ease-in-out"
                    type="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                />
                {/* Submit button */}
                <input
                    className='w-full bg-[#F6F6F6] text-[#0F0F0F] font-medium p-4 rounded-full cursor-pointer border-none outline-none hover:text-[#F6F6F6] hover:bg-[#5C8D7B] transition-all duration-300 ease-in-out'
                    type="submit"
                    value="Sign Up"
                />
            </form>

            <p className="my-4">Already a user?{' '}<Link className="font-medium hover:text-[#E35933] transition-all duration-300 ease-in-out" to="/login">Sign In</Link></p> {/* Link to Login component */}
        </div>
    )
}
export default Register;