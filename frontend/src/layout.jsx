import { Outlet } from "react-router";
import { Link } from "react-router-dom";

const Layout = () => {
    return (
        <div>
            <div className="container-fluid p-4 my-4 border list-inline">
                <Link to="/" className="link-offset-3-hover link-underline-opacity-0 link-underline-opacity-75-hover fs-1 link-dark">Home Drive</Link> 
            </div>
            <Outlet/>
        </div>
    );
};

export default Layout;