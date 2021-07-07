import React from "react";
import "./App.css";
import Login from "./components/Login";
import Header from "./components/Header";
import Home from "./components/Home";
import { selectUser } from "./reducers/userSlice";
import { useSelector } from "react-redux";

function App() {
  const user = useSelector(selectUser);

  return (
    <div className="app">
      {!user ? (
        <Login />
      ) : (
        <>
          <Header />
          <Home />
        </>
      )}
    </div>
  );
}

export default App;
