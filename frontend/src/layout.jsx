import { Outlet } from "react-router";
import { Link } from "react-router-dom";

const Layout = () => {
    return (
        <div>
            <div className="container-fluid p-4 my-4 border bg-light">
                <div className="list-inline">
                    <Link to="/" className="link-offset-3-hover link-underline-opacity-0 link-underline-opacity-75-hover fs-1 link-dark">Home Drive</Link> 
                    <Link to="login" className="link-offset-3-hover link-underline-opacity-0 link-underline-opacity-75-hover fs-1 link-dark float-end">Log in</Link>
                    <Link to="/signup" className="link-offset-3-hover link-underline-opacity-0 link-underline-opacity-75-hover fs-1 link-dark float-end me-4">Sign up</Link>
                </div>
                <div className="list-inline">
                 
                </div>
            </div>
            <Outlet/>
        </div>
    );
};

export default Layout;