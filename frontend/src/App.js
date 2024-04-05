import React from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import AddExpense from "./components/AddExpense";

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact Component={Register} />
          <Route path="/login" exact Component={Login} />
          <Route path="/profile" exact Component={Profile} />
          <Route path="/add-expense" exact Component={AddExpense} />
        </Routes>
      </BrowserRouter>
    </div >
  );
}

export default App;
