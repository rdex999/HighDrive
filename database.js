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

    getDb: () => dbConnection
}