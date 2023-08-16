import { useState } from "react";

const Signup = () => {
    const [inputs, setInputs] = useState({});
    const [error, setError] = useState("");
    const handleSubmit = event => {
        event.preventDefault();
        if(inputs.password === inputs.password2){
            setError("");
            // send a request to the api to create a user
            fetch("/api/signup", {
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
                console.log(data);
            })).catch(err => console.error(err));
        }else{
            //display error
            setError(<p className="border border-danger text-danger">Passwords do not match</p>);
        }
    };

    const handleChange = event => {
        setInputs(values => ({ ...values, [event.target.name]: event.target.value }));
    };

    return (
        <div className="container pt-5 my-5">
            <div className="row">
              <div className="col-sm-4">
              </div>
              <div className="col-sm-4 text-center container p-5 my-4 border bg-light">
                <h3>Create account</h3>
                <form onSubmit={e => handleSubmit(e)}>
                    <br /><br /> 
                    <label>User name: </label>
                    <input type="text" value={inputs.username || ""} name="username" required onChange={handleChange}/><br /><br /><br />
                    <label>Password: </label>
                    <input type="password" value={inputs.password || ""} name="password" required onChange={handleChange}/><br /><br /><br />
                    <label>Repeat password: </label>
                    <input type="password" value={inputs.password2 || ""} name="password2" required onChange={handleChange}/><br /><br /><br />
                    {error}
                    <button className="btn btn-light btn-lg" type="submit">Create account</button>
                </form>
              </div>
              <div className="col-sm-4">
              </div>
            </div>
        </div>
    );
};

export default Signup;