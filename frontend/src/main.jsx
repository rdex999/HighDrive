import React from "react";
import ReactDOM from "react-dom/client";
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./layout";
import Home from "./home";
import Signup from "./signup";
import Login from "./login";

const App = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Home />}/>
                    <Route path="signup" element={<Signup />}/>
                    <Route path="login" element={<Login />}/>
                </Route>     
            </Routes> 
        </BrowserRouter>     
    );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App/>);