const { getDatabase } = require("firebase-admin/database");
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
const db = getDatabase(firebaseApp);

module.exports = class CRUD {

    static async readAllData() {
        try {
            return new Promise((resolve) => {
                db.ref('/').on('value', e => {
                    resolve(e.val());
                });
            });

        } catch (e) {
            console.error("Error reading document: ", e);
        }
    }

    static async setPersonalTask(daily_task_idx, each_task_idx, newData) {
        var path = "/project/daily_task/" + daily_task_idx + "/each_task/" + each_task_idx + "/task/task_detail";
        console.log(path);

        try {
            db.ref(path).set('');
            db.ref(path).set(newData);
        } catch (e) {
            console.error("Error reading document: ", e);
        }
    }

}