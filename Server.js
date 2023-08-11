const express = require("express");
const { connectToDb, userExist, createUser, findUser} = require("./database.js");
const { exit } = require("process");

// Create app
const app = express();

// Database connection
let database;

// Connect to MongoDb database
connectToDb().then(res => {
    database = res;
    console.log("Connected to the database succesfuly.\n");
}).catch(err => {
    console.log(`${err}\n\nQuiting due to a database connection error.`);
    exit(1);
});

// Set view engine
app.set("view engine", "ejs");

// Listen on port 8080
app.listen(8080, () => {
    console.log("\nStarting server on port 8080.\n");
});

// Make everything in the "Public" folder available from the browser (a stylesheet.css file for example)
app.use(express.static("Public"));

// Make json available (from post requests and stf)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Prints some information about every request to the server
app.use((req, res, next) => {
    console.log(`\nRequest from: ${req.ip}\nType: ${req.method}\nPath: ${req.path}\nTime: ${Date()}`);
    next();
});

app.get("/", (req, res) => {
    res.render("index", { userLoggedIn: false });
});

// Sign up state 0: user didnt try to sign up
// Sign up state 1: user sign up succesfuly
// Sign up state 2: user tryed to sign up with an existing username in database
app.get("/SignUp", (req, res) => { 
    res.render("SignUp", {SignUpState: 0});
});

app.post("/SignUp", (req, res) => {
    userExist(req.body.username, result => {
        if(result){
            res.render("SignUp", { SignUpState: 2, username: req.body.username});
        }else{
            createUser(req.body.username, req.body.password, result => {
                res.render("SignUp", { SignUpState: 1});
            })
        }
    });
});

// loginState 0: user didnt try to log in
// loginState 1: user logged in succesfuly
// loginState 2: user tryed to log in with an incorrect username of password
app.get("/login", (req, res) => {
    res.render("login", { loginState: 0 });
});

app.post("/login", (req, res) => {
    findUser(req.body.username)
    .then(user => {
        if(user && req.body.password === user.password){
            if(req.body.RememberMe === "on"){
                // Make a login cookie for the user (in the future)
            }else{
                res.render("login", { loginState: 1 });
            }
        }else{
            res.render("login", { loginState: 2 });
        }
    }).catch(err => {
        console.log(err)
        res.status(500).redirect("/");
    });
});

app.use((req, res) => {
    res.status = 404; res.render("404");
});