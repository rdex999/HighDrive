const { MongoClient, ObjectId } = require("mongodb");
const multerGridfs = require("multer-gridfs-storage");
const crypto = require("crypto");
const { resolve } = require("path");

let dbConnection;

const findUser = usrname => {
    return new Promise((resolve, reject) => {
        dbConnection.collection("users")
        .findOne({ username: usrname })
        .then(user => {
            resolve(user);
        }).catch(err => {
            reject(err);
        });
    });
}

const createCookieId = () => {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(16, (err, buf) => {
            if(err){reject(err);}else{
                resolve(`${buf.toString("hex")}${Date.now()}`);
            }
        });
    });
}

const findUserByCookie = cookieValue => {
    return new Promise((resolve, reject) => {
        dbConnection.collection("users")
        .findOne({ cookieId: cookieValue })
        .then(user => resolve(user))
        .catch(err => reject(err))
    });
}

module.exports = 
{
    connectToDb: () => {
        return new Promise((resolve, reject) => {
            MongoClient.connect("mongodb://localhost:27017/HomeDrive")
            .then(res => {
                dbConnection = res.db();
                resolve(dbConnection);
            }).catch(err => {
                reject(err);
            });
        });
    },

    userExist: (usrname, callback) => {
        dbConnection.collection("users")
        .findOne({ username: usrname })
        .then(user => {
            if(user){
                return callback(true);
            }else{
                return callback(false);
            }
        });
    },

    createUser: (usrname, passwd, callback) => {
        dbConnection.collection("users")
        .insertOne({
            username: usrname,
            password: passwd,
            ownsFiles: [],
            cookieId: ""
        }).then(result => {
            return callback(result);
        });
    },

    findUser, 

    storage: new multerGridfs.GridFsStorage({
        url: "mongodb://localhost:27017/HomeDrive",
        file: (req, file) => {
            return new Promise((resolve, reject) => {
                const newFilename = `${file.originalname}_${Date.now()}`;
                if(req.cookies.login){
                    findUserByCookie(req.cookies.login).then(user => {
                        if(user){
                            dbConnection.collection("users").updateOne({ username: user.username },
                                { $push: { ownsFiles: { filename: newFilename, originname: file.originalname } } });
                            console.log(`\nID: ${id}`);
                        }else{
                            reject("Incorrect password");
                        }
                    }).catch(err => {
                        reject(err);
                    })
                }else{
                    reject("No login cookie.. user must login first");
                }
                const fileInfo = {
                    filename: newFilename,
                    bucketName: "uploads",
                };
                resolve(fileInfo);
            });
        }
    }),

    findUserByCookie,

    createCookieId
}

