import React from "react"; // Import the React library
import Login from "./components/Login"; // Import the Login component
import Register from "./components/Register"; // Import the Register component
import Dashboard from "./components/Dashboard"; // Import the Dashboard component
import NotFound from "./components/NotFound"; // Import the NotFound component
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Import the BrowserRouter, Route, and Routes components from the react-router-dom library

function App() {
  return (
    <div
      className="w-dvw max-w-[2000px] h-[100dvh] max-h-[200dvh] bg-[#0F0F0F] text-[#F6F6F6] tracking-wide p-6 mx-auto overflow-hidden scrollbar-none">
      {/* BrowserRouter component to wrap the routes */}
      <BrowserRouter>
        {/* Routes component to define the routes */}
        <Routes>
          <Route path="/" exact Component={Register} /> {/* Route to register new user */}
          <Route path="/login" exact Component={Login} /> {/* Route to login user */}
          <Route path="/dashboard" exact Component={Dashboard} /> {/* Route to dashboard page */}
          <Route path="*" Component={NotFound} /> {/* Route to 404 Not Found page */}
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;
