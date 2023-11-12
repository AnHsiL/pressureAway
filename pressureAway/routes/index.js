require('dotenv').config();
var express = require('express');
var router = express.Router();
var line = require('@line/bot-sdk');
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};
var myModules = require("../controller/controller");
myModules = new myModules();

router.post('/setPersonalTask', myModules.setPersonalTask);
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
//router.post('/linebot', line.middleware(config), myModules.linebot);
router.post('/linebot', myModules.linebot);
module.exports = router;