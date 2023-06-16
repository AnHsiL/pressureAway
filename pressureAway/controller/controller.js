const CRUD = require("../model/firebase_modules");

module.exports = class Controller {
    getAllData(req, res, next) {
        try {
            CRUD.readAllData()
                .then((data) => {
                    res.json(data);
                });
        } catch (err) {
            res.err();
        }
    }
    setPersonalTask(req, res, next) {
        var newData = req.body.dataToChange;
        try {
            CRUD.readAllData()
                .then((r_data) => {
                    for(var i = 0; i < Object.keys(r_data.project.daily_task).length; i++){
                        if(req.body.date == r_data.project.daily_task[i].today){
                            for(var j = 0; j < r_data.project.employee_num; j++){
                                if(req.body.name == r_data.project.daily_task[i].each_task[j].name){
                                    CRUD.setPersonalTask(i, j, newData)
                                    .then(() => {
                                        res.json({
                                            status: "succ",
                                        });
                                    });
                                }
                            }
                        }
                    }
                });
        } catch (err) {
            res.err();
        }
    }
    
}
