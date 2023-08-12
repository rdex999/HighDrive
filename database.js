const { MongoClient } = require("mongodb");
const multerGridfs = require("multer-gridfs-storage");

let dbConnection;

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
            password: passwd
        }).then(result => {
            return callback(result);
        });
    },

    findUser: usrname => {
        return new Promise((resolve, reject) => {
            dbConnection.collection("users")
            .findOne({ username: usrname })
            .then(user => {
                resolve(user);
            }).catch(err => {
                reject(err);
            });
        });
    },

    storage: new multerGridfs.GridFsStorage({
        url: "mongodb://localhost:27017/HomeDrive",
        file: (req, file) => {
            return new Promise((resolve, reject) => {
                const newFilename = `${file.originalname}-${Date()}`;
                const fileInfo = {
                    filename: newFilename,
                    bucketName: "uploads"
                };
                resolve(fileInfo);
            });
        }
    })

}