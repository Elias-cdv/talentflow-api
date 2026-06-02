const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");
dotenv.config();

let _db;

const initDb = (callback) => {
  if (_db) {
    console.log("¡La base de datos ya estaba inicializada!");
    return callback(null, _db);
  }
  // Se conecta usando la URI de tu archivo .env
  MongoClient.connect(process.env.MONGODB_URI)
    .then((client) => {
      _db = client;
      callback(null, _db);
    })
    .catch((err) => {
      callback(err);
    });
};

const getDb = () => {
  if (!_db) {
    throw Error("Base de datos no inicializada.");
  }
  return _db;
};

module.exports = {
  initDb,
  getDb,
};
