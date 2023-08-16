const Login = () => {
    return (
        <div className="container mt-5">
            <div className="row">
              <div className="col-sm-4">
              </div>
              <div className="col-sm-4 text-center container p-5 my-4 border bg-light">
                <h3>Log in to your account</h3>
                <form>
                    <br /><br /> 
                    <label>User name: </label>
                    <input type="text" name="username"/><br /><br /><br />
                    <label>Password: </label>
                    <input type="password" name="password" /><br /><br /><br />
                    <button className="btn btn-light btn-lg" type="submit">Login</button>
                </form>
              </div>
              <div className="col-sm-4">
              </div>
            </div>
        </div>     
    );
};

export default Login;