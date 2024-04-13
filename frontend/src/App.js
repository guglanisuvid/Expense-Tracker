import React from "react"; // Import the React library
import Login from "./components/Login"; // Import the Login component
import Register from "./components/Register"; // Import the Register component
import Profile from "./components/Profile"; // Import the Profile component
import { BrowserRouter, Route, Routes } from "react-router-dom"; // Import the BrowserRouter, Route, and Routes components from the react-router-dom library

function App() {

  return (
    <div>
      {/* BrowserRouter component to wrap the routes */}
      <BrowserRouter>
        {/* Routes component to define the routes */}
        <Routes>
          <Route path="/" exact Component={Register} /> {/* Route to register new user */}
          <Route path="/login" exact Component={Login} /> {/* Route to login user */}
          <Route path="/profile" exact Component={Profile} /> {/* Route to profile page */}
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;
