import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const loginUser = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
      }),
      credentials: "include",
    });

    if (res.ok) {
      const data = await res.json();
      console.log(data);
      navigate("/profile");
    } else {
      console.log("ERROR !");
    }
  };

  return (
    <div className="relative h-dvh w-dvw bg-slate-500 text-slate-800 tracking-wider">
      <div className="w-1/5 absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2">
        <p className="text-3xl font-semibold text-center my-3">Sign In</p>
        <form
          onSubmit={loginUser}
          method="POST"
          className="flex flex-col gap-3"
        >
          <input
            type="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            className="px-6 py-3 rounded-xl bg-slate-50 text-slate-800 font-medium outline-none border-0"
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="px-6 py-3 rounded-xl bg-slate-50 text-slate-800 font-medium outline-none border-0"
          />
          <input
            type="submit"
            value="Sign In"
            className="px-6 py-3 rounded-xl bg-slate-800 text text-slate-200 font-medium tracking-wider"
          />
        </form>
        <p className="my-3">
          New User?{" "}
          <Link to="/">
            <span className="font-medium">Sign Up</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
