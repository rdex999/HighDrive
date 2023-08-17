import { useState } from "react";

const Login = () => {
    const [inputs, setInputs] = useState({});
    const [loginMessage, setLoginMessage] = useState("");

    const handleSubmit = event => {
        event.preventDefault();
        fetch("/api/login", {
            method: "post",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: inputs.username,
                password: inputs.password
            })
        }).then(res => res.json().then(data => {
            // if user logged in successfully 
            if(data.state === 1){
                setLoginMessage(<p className="text-success border border-success">Logged in successfully, you can browse your files in the home page.</p>);
            }else if(data.state === 2){
                setLoginMessage(<p className="text-danger border border-danger">Incorrect user name or password.</p>);
            }
        })).catch(err => console.log(err));
    }

    const handleChange = event => {
        setInputs(values => ({ ...values, [event.target.name]: event.target.value }));
    };

    return (
        <div className="container pt-5 my-5">
            <div className="row">
              <div className="col-sm-4">
              </div>
              <div className="col-sm-4 text-center container p-5 my-4 border bg-light">
                <h3>Log in to your account</h3>
                <form onSubmit={handleSubmit}>
                    <br /><br /> 
                    <div>
                        <input placeholder="User name" className="form-control" value={inputs.username || ""} onChange={handleChange} type="text" name="username" required/><br/><br />
                        <input placeholder="Password" className="form-control" value={inputs.password || ""} onChange={handleChange} type="password" name="password" required/><br /><br /><br />
                    </div> 
                    {loginMessage} 
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