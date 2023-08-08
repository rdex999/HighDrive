const Express = require("express");
const Server = Express();

Server.set("view engine", "ejs");

Server.listen(8080, () => {
    console.log("\nStarting server on port 8080.\n");
});

Server.use(Express.static("Public"));

Server.use(Express.json());
Server.use(Express.urlencoded({ extended: true }));

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