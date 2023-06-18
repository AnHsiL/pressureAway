// 請求方式: post

// url: https://bd46-101-10-4-102.ngrok-free.app/getPressureScore

// 請求腳本
return {
	personalPress : $(personalPress)
}

// 返回腳本
var response = $(response);
var pressStatus = "";
if(response.personalScore > 0) pressStatus += "壓力大";
else if (response.personalScore == 0) pressStatus += "壓力適中";
else pressStatus += "壓力小";

return {
    "success": true,
    "processVariable": {
      "personalScore":response.personalScore,
      "pressStatus":pressStatus
    },
    "errorMessage": ""
};