// url
// https://bai-cloudeia.eastasia.cloudapp.azure.com/api/SetPushHData

// 請求腳本
var data = $(data);
var heavy = 0;
data.pressureStatus.forEach(function(item){
  if(item > 0) heavy ++;
})
if(heavy / data.pressureStatus.length < 0.3) {
  var heavy_pa = heavy / data.pressureStatus.length * 100 ;
  var context = "當前壓力狀態健康，壓力大人數比率 = " + heavy_pa + "%";
  var lineMessageRequest = {
      "context": context,
      "targetUserId": "team49Admin"
  };
  return lineMessageRequest;
} 

// 返回腳本
return {
  "success" : true,
  "processVariable" : {
  },
  "errorMessage" : ""
};