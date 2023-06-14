// const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

var admin = require("firebase-admin");
var serviceAccount = require("../credential/project-e2d9c-firebase-adminsdk-a9h8w-d65bce6dfe.json");

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
    apiKey: "AIzaSyBI2Tp1qwk4mnJ5O36qOsRoJr39QgKLpuQ",
    authDomain: "project-e2d9c.firebaseapp.com",
    databaseURL: "https://project-e2d9c-default-rtdb.firebaseio.com",
    projectId: "project-e2d9c",
    storageBucket: "project-e2d9c.appspot.com",
    messagingSenderId: "950374627701",
    appId: "1:950374627701:web:7675b953469459faf3fb3c",
    measurementId: "G-JG24VJJRE4",
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://project-e2d9c-default-rtdb.firebaseio.com/"
  };

// Initialize Firebase
const firebaseApp = admin.initializeApp(firebaseConfig);

// DB CRUD
const db = getFirestore(firebaseApp);

module.exports = class CRUD {

    
    static async readAllData(col) {

        var res = {};
        var ref = db.collection(col);
        var returnData = [];
        try {
            return new Promise((resolve) => {
                ref.get().then((foundData) => {
                    foundData.forEach(doc => {
                        returnData.push({
                            docData: doc.data(),
                            docId: doc.id
                        });
                    });
                    res.data = returnData;
                    resolve(res);
                });
            });

        } catch (e) {
            console.error("Error reading document: ", e);
        }
    }
    static async readDataByDocId(col, id) {

        var ref = db.collection(col).doc(id);
        try {
            return new Promise((resolve) => {
                ref.get().then((doc) => {
                    var res = doc.data();
                    resolve(res);
                });
            });

        } catch (e) {
            console.error("Error reading document: ", e);
        }
    }
    static async updateData(col, queryDoc, queryOperation, queryContent, data) {
        var ref = db.collection(col);
        try {
            ref.where(queryDoc, queryOperation, queryContent).get().then(foundData => {
                foundData.forEach(doc => {
                    var docId = doc.id;
                    ref.doc(docId).update(data);
                });
            });
        } catch (e) {
            console.error("Error changing document: ", e);
        }
    }
}