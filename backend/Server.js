const express = require("express");
const { connectToDb, userExist, createUser, findUser, storage, createCookieId, findUserByCookie, folderDontExists } = require("./database.js");
const { exit } = require("process");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const multerGridfs = require("multer-gridfs-storage");
const { GridFSBucket } = require("mongodb");
const fs = require("fs");

const upload = multer({ storage });

let gfs;

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

// Listen on port 8080
app.listen(8080, () => {
    console.log("\nStarting server on port 8080.\n");
});

// Make everything in the "dist" and "images" folders available from the browser (a stylesheet.css file for example)
app.use(express.static("./dist"));
app.use(express.static("./images"));

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

// state 0: no login cookie (user didnt log in)
// state 1: user logged in successfully (has a valid login cookie) 
// state 2: user has an invalid login cookie
app.get("/api/listfiles", (req, res) => {
    if(req.cookies.login){
        findUserByCookie(req.cookies.login)
        .then(user => {
            if(user){
                res.json({ 
                    username: user.username,
                    state: 1,
                    files: user.ownsFiles
                });
            }else{
                res.clearCookie("login").json({ state: 2 });
            }
        }).catch(err => {
            console.log(err);
            res.clearCookie("login").json({ state: 2 });
        });
    }else{
        res.json({ state: 0 });
    }
});

// state 0: user didnt try to sign up
// state 1: user sign up successfully
// state 2: user tryed to sign up with an existing username in database
app.post("/api/signup", (req, res) => {
    userExist(req.body.username, result => {
        if(result){
            res.json({ username: req.body.username, state: 2 });
        }else{
            createUser(req.body.username, req.body.password, result => {
                res.json({ username: req.body.username, state: 1 });
            });
        }
    });
});

// state 0: user didnt try to log in
// state 1: user logged in successfully
// state 2: user tryed to log in with an incorrect username of password
app.post("/api/login", (req, res) => {
    findUser(req.body.username)
    .then(user => {
        if(user && req.body.password === user.password){
            createCookieId().then(newId => {
                res.cookie("login", newId, { maxAge: 1*24*60*60*1000 });
                database.collection("users").updateOne({ username: user.username }, { $set: { cookieId: newId } });
                //res.render("login", { loginState: 1 });
                res.json({ username: user.username, state: 1 });
            }).catch(err => {
                console.log(`ERROR: ${err}`);
                res.json({ state: 2 });
            });
            
        }else{
            //res.render("login", { loginState: 2 });
            res.json({ state: 2 });
        }
    }).catch(err => {
        console.log(err)
        res.status(500).redirect("/");
    });
});

app.get("/api/signout", (req, res) => {
    if(req.cookies.login){
        database.collection("users").updateOne({ cookieId: req.cookies.login }, { $set: { cookieId: "" } })
        .then(() => res.clearCookie("login").redirect("/"))
        .catch(err => {
            console.log(err);
            res.status(500).clearCookie("login").redirect("/");
        });
    }
});

app.post("/api/upload", upload.array("files"), (req, res) => {
    req.files.forEach(file => console.log(`UPLOAD: ${file.filename}\npath: ${req.query.path}`));
    res.redirect("/");
});

app.get("/api/getfile/:filename", (req, res) => {
    if(req.cookies.login && req.params.filename){
        findUserByCookie(req.cookies.login).then(user => {
            if(user){
                console.log(`\nSending file: "${req.params.filename}"\nTo user: "${user.username}"`);
                const file = user.ownsFiles.filter(usersFile => usersFile.filename === req.params.filename);
                res.setHeader("content-type", "some/type");
                res.setHeader("Content-disposition", `attachment; filename=${file[0].originname}`); 
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

app.get("/api/deletefile/:filename", (req, res) => {
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

// state 0: folder already exists
// state 1: created folder successfully
app.post("/api/createfolder", (req, res) => {
    if(req.cookies.login && req.body.folderName && req.query.path){
        findUserByCookie(req.cookies.login).then(user => {
            if(user){
                folderDontExists(user.ownsFiles, req.body.folderName, req.query.path)
                .then(() => {
                    console.log(`\nCreating folder: ${req.body.folderName}\nOn path: ${req.query.path}`);
                    database.collection("users").updateOne({ username: user.username },
                        { $push: { ownsFiles: {filename: null, originname: req.body.folderName, path: req.query.path } } });
                    res.json({ state: 1 })
                }).catch(item => res.json({ state: 0 }));
            }else{
                res.clearCookie("login").redirect("/");
            }
        }).catch(err => {
            console.log(err);
            res.clearCookie("login").redirect("/");
        });
    }else{
        res.redirect("/");
    }
});

app.use((req, res) => {
    res.status(404).json({ error: 404 });
});