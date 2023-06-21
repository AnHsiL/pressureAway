// http-getAllPressureStatus

// 請求方式: post
// url: https://bd46-101-10-4-102.ngrok-free.app/getPressureScore

// 請求腳本
return {
	personalPress: $(personalPress)
}

// 返回腳本
var response = $(response);
var pressStatus = "";
if (response.personalScore > 0) pressStatus += "壓力大";
else if (response.personalScore == 0) pressStatus += "壓力適中";
else pressStatus += "壓力小";

return {
	"success": true,
	"processVariable": {
		"personalScore": response.personalScore,
		"pressStatus": pressStatus
	},
	"errorMessage": ""
};

// 判斷特定日期壓力

var dateToAsk = "20230610";
var allPressStatusArr = $(allPressStatusArr);

var pressureStatus = 0;
var allPressureScore = 0;
for (var i = 0; i < allPressStatusArr.length; i++) {
	if (allPressStatusArr[i].date == dateToAsk) {
		for (var j = 0; j < allPressStatusArr[i].pressArr.length; j++)
			allPressureScore += allPressStatusArr[i].pressArr[j];
		if (allPressureScore > allPressStatusArr[i].pressArr.length * 0.4)
			pressureStatus = 1;
		else if (allPressureScore > allPressStatusArr[i].pressArr.length * -0.2)
			pressureStatus = 0;
		else
			pressureStatus = -1;
		break;
	}
}

return {
	"success": true,
	"processVariable": {
		"dateToAsk": dateToAsk,
		"pressureStatus": pressureStatus
	},
	"errorMessage": ""
};