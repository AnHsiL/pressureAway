const CRUD = require("../model/firebase_modules");

module.exports = class Controller {
    
    getAllData(req, res, next) {
        try {
            if (req.body.name != "" && req.body.name != null) {
                CRUD.readData('users', 'name', '==', req.body.name)
                    .then((resultData) => {
                        var storedData = resultData.data[0];
                        res.json({
                            data: storedData
                        });
                    });
            }
            else CRUD.readData('users', 'account', '==', req.body.account)
                .then((resultData) => {
                    var readDataArray = resultData.data;
                    var storedData = readDataArray[0];
                    res.json({
                        data: storedData
                    });
                });

        } catch (err) {
            res.err();
        }
    }
}
