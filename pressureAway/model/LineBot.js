// var lineNotify = require('express-line-notify');

// var config = {
//   clientId:      'YsX1yhtJ1bl3UBWehkuCcE',
//   clientSecret:  'X8slI6fK9bY9OlkL8Kql18yHQDxBgBWbIuJNLUF6PoZ'
// }

// //curl ~host/linenotify?userid=123&email=456
// app.use('/linenotify',
//   function(req, res, next) {
//     req['context'] = req.query;    //store whatever in query string
//     next();
//   },
//   lineNotify(config),
//   function(req, res) {
//     const token = req['line-notify-access-token'];
//     const data = req['context']    //data will be { userid: "123", email: "456" }
//     //...
//   });

const lineNotify = require('line-notify-nodejs')('u8AlE38H9ZT0x3rVwlzooAlMUZOpKKPDyfiZ5U27Z73');

  module.exports = class LineNotify {
    
    static sendNotify(message) {
        try {
            lineNotify.notify({
                message: message,
              }).then(() => {
                console.log('send completed!');
              });
        } catch (e) {
            console.error("Error chat with chatgpt: ", e);
        }
    }
}