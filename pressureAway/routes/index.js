var express = require('express');
var router = express.Router();

var myModules = require("../controller/controller");
myModules = new myModules();

router.post('/setPersonalTask', myModules.setPersonalTask);
router.post('/getAllData', myModules.getAllData);
router.post('/getAllData', myModules.getAllData);
router.post('/getAllPressureData', myModules.getAllPressureData);
router.post('/getIsChanged', myModules.getIsChanged);
router.post('/toUnchangedStatus', myModules.toUnchangedStatus);
router.post('/toChangedStatus', myModules.toChangedStatus);
router.post('/getOriSched', myModules.getOriSched);
router.post('/getNewSched', myModules.getNewSched);
router.post('/getAvgPressureScore', myModules.getAvgPressureScore);
router.post('/setNewSched', myModules.setNewSched);
router.post('/getNewSchedSub', myModules.getNewSchedSub);
router.post('/sendDailyWarning', myModules.sendDailyWarning);

module.exports = router;