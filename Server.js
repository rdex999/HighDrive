const Express = require("express");
const Server = Express();

Server.set("view engine", "ejs");

Server.listen(8080);

Server.use(Express.static("Public"));

Server.use((req, res, next) => {
    console.log(`Request from: ${req.hostname}\nType: ${req.method}\nPath: ${req.path}`);
    next();
});

Server.get("/", (req, res) => {
    res.render("index");
});

Server.get("/SignUp", (req, res) => {
    res.render("SignUp");
});

Server.use((req, res) => {
    res.status = 404; 
    res.render("404");
});