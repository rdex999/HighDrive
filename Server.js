const Express = require("express");
const Server = Express();

// Set view engine
Server.set("view engine", "ejs");

// Listen on port 8080
Server.listen(8080, () => {
    console.log("\nStarting server on port 8080.\n");
});

// Make everything in the "Public" folder available from the browser (a stylesheet.css file for example)
Server.use(Express.static("Public"));

// Make json available (from post requests and stf)
Server.use(Express.json());
Server.use(Express.urlencoded({ extended: true }));

// Prints some information about every request to the server
Server.use((req, res, next) => {
    console.log(`\nRequest from: ${req.ip}\nType: ${req.method}\nPath: ${req.path}\nTime: ${Date()}`);
    next();
});

Server.get("/", (req, res) => {
    res.render("index");
});

Server.get("/SignUp", (req, res) => {
    res.render("SignUp", {SignUpState: false});
});

Server.post("/SignUp", (req, res) => {
    res.render("SignUp", {username: req.body.username, SignUpState: true});
});

Server.use((req, res) => {
    res.status = 404; res.render("404");
});