// 請求方式: post

// url: https://bd46-101-10-4-102.ngrok-free.app/getSetData

// 請求腳本
return {
    employeeIdx : $(employeeIdx),
    dateToAsk: new String($(dateToAsk))
};

// 返回腳本
var response = $(response);
return {
    "success": true,
    "processVariable": {
      "personalPress": response.personalPress,
      "personalSched": response.personalSched
    },
    "errorMessage": ""
};