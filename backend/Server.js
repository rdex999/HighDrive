const express = require("express");
const { connectToDb, userExist, createUser, findUser, storage, createCookieId, findUserByCookie } = require("./database.js");
const { exit } = require("process");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const multerGridfs = require("multer-gridfs-storage");
const { MongoClient, GridFSBucket} = require("mongodb");
const fs = require("fs");

const upload = multer({ storage });

//let gfs;

// Create app
const app = express();

// Database connection
let database;

// Connect to MongoDb database
connectToDb().then(res => {
    database = res;
    gfs = new GridFSBucket(database, { bucketName: "uploads" });
    console.log("Connected to the database successfully.\n");
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

// Make cookies available
app.use(cookieParser());

// Prints some information about every request to the server
app.use((req, res, next) => {
    console.log(`\nRequest from: ${req.ip}\nType: ${req.method}\nPath: ${req.path}\nTime: ${Date()}`);
    next();
});

app.get("/", (req, res) => {
    if(req.cookies.login){ 
        findUserByCookie(req.cookies.login)
        .then(user => { 
            if(user){ 
                res.render("index", {
                    userLoggedIn: true,
                    username: user.username,
                    usersFiles: user.ownsFiles
                });
            }else{
                res.render("index", { userLoggedIn: false });
            }
        }).catch(err => {
            console.log(err)
            res.status(500).clearCookie("login").redirect("/");
        });
    }else{
        res.render("index", { userLoggedIn: false });
    }
});

// Sign up state 0: user didnt try to sign up
// Sign up state 1: user sign up successfully
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
            });
        }
    });
});

// loginState 0: user didnt try to log in
// loginState 1: user logged in successfully
// loginState 2: user tryed to log in with an incorrect username of password
app.get("/login", (req, res) => {
    res.render("login", { loginState: 0 });
});

app.post("/login", (req, res) => {
    findUser(req.body.username)
    .then(user => {
        if(user && req.body.password === user.password){
            createCookieId().then(newId => {
                res.cookie("login", newId, { maxAge: 1*24*60*60*1000 });
                database.collection("users").updateOne({ username: user.username }, { $set: { cookieId: newId } });
                res.render("login", { loginState: 1 });
            }).catch(err => {
                console.log(`ERROR: ${err}`);
                res.status(500).redirect("/");
            });
            
        }else{
            res.render("login", { loginState: 2 });
        }
    }).catch(err => {
        console.log(err)
        res.status(500).redirect("/");
    });
});

app.get("/signout", (req, res) => {
    if(req.cookies.login){
        database.collection("users").updateOne({ cookieId: req.cookies.login }, { $set: { cookieId: "" } })
        .then(() => res.clearCookie("login").redirect("/"))
        .catch(err => {
            console.log(err);
            res.status(500).clearCookie("login").redirect("/");
        });
    }
});

app.post("/upload", upload.array("files"), (req, res) => {
    req.files.forEach(file => console.log(`UPLOAD: ${file.filename}`));
    res.redirect("/");
});

app.get("/getfile/:filename", (req, res) => {
    if(req.cookies.login && req.params.filename){
        findUserByCookie(req.cookies.login).then(user => {
            if(user){
                console.log(`\nSending file: "${req.params.filename}"\nTo user: "${user.username}"`) 
                res.setHeader("content-type", "some/type");
                gfs.openDownloadStreamByName(req.params.filename)
                .pipe(res);
            }else{
                res.clearCookie("login").redirect("/");
            }
        }).catch(err => {
            console.log(err);
            res.status(500).clearCookie("login").redirect("/");
        });
    }
});

app.get("/deletefile/:filename", (req, res) => {
    if(req.cookies.login && req.params.filename){
        findUserByCookie(req.cookies.login).then(async user => {
            if(user){
                const cursor = gfs.find({ filename: req.params.filename });
                for await (const doc of cursor) {
                    console.log(`\nDeleting file: "${doc.filename}"\nFrom user: "${user.username}"`);
                    gfs.delete(doc._id);
                    // Delete the array element where filename == doc.filename
                    database.collection("users").updateOne({ username: user.username }, { $pull: { ownsFiles: { filename: doc.filename } } })
                    .then(() => res.redirect("/"))
                    .catch(err => {
                        console.log(err);
                        res.status(500).clearCookie("login").redirect("/");
                    });
                }
            }
        }).catch(err => {
            res.status(500).clearCookie("login").redirect("/");
            console.log(err);
        });
    }
});

app.use((req, res) => {
    res.status(404).render("404");
});