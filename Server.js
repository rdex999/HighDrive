const express = require("express");
const { connectToDb, getDb, userExist, createUser } = require("./database.js");
const { exit } = require("process");

// Create app
const app = express();

// Database connection
let database;

// connect to MongoDb database
connectToDb(err => {
    if(err){
        console.log("\nCould not connect to the database.\nQuiting.");
        exit(1);
    }else{
        database = getDb();
        console.log("\nConnected to database succesfuly.\n");
    }
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
    res.render("index");
});

// Sign up state 0: user didnt try to sign up
// Sign up state 1: user sign up succesfuly
// Sign up state 2: user tryed to sign up with an existing username in database
app.get("/SignUp", (req, res) => { 
    res.render("SignUp", {SignUpState: 0});
});

app.get("/login", (req, res) => {
    res.render("login");
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

app.use((req, res) => {
    res.status = 404; res.render("404");
});