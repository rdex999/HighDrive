const { MongoClient } = require("mongodb");

let dbConnection;

module.exports = 
{
    connectToDb: callback => {
        MongoClient.connect("mongodb://localhost:27017/testing")
            .then(client => {
                dbConnection = client.db();
                return callback();
            })
            .catch(err => {
                console.log(err)
                return callback(err);
            })
    },

    getDb: () => dbConnection,

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

    findUser: (usrname, callback) => {
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
}