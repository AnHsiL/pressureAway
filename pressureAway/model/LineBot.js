const lineNotify = require('line-notify-nodejs')('IE6Bq7HowInGL34JOWGB5FGoxwAxQu7cpbnpAEi94Xd');

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