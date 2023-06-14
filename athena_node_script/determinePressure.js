function PressureScore(pressureFactor){
    var score = 0;
    
    var nap_weight = 8;
    var foodout_weight = 7;
    var screen_weight = 8;
    var suager_weight = 9;
    var meeting_weight = 10;
    var co_meeting_weight = 16;
    var complete_weight = 42;
    
    if(pressureFactor.makeup > 0){
      nap_weight = 7;
      foodout_weight = 6;
      screen_weight = 7;
      suager_weight = 9;
      meeting_weight = 10;
      co_meeting_weight = 15;
      complete_weight = 41;
      if (pressureFactor.makeup == 0)  score += 5;
      else if (pressureFactor.makeup == 5) score += 3;
    }
    
    if(pressureFactor.is_nap) score += nap_weight;
    if(pressureFactor.is_foodout) score += foodout_weight;
    if(pressureFactor.over_suager_day >= 3) score += suager_weight*1.3;
    else if(pressureFactor.over_suager_day >= 2) score += suager_weight*0.8;
    else if(pressureFactor.over_suager_day >= 1) score += suager_weight*0.2;
    
    var screenTime = pressureFactor.screen_worktime / (7*60);
    if(pressureFactor.is_meeting) {
      score += meeting_weight;
      screenTime = pressureFactor.screen_worktime / (5*60);
    }
    if(pressureFactor.is_co_meeting) {
      score += co_meeting_weight;
      screenTime = pressureFactor.screen_worktime / (3*60);
    }
    score += screenTime * screen_weight;
    if(pressureFactor.complete_pa > 10) score += 1.2 * complete_weight;
    else if(pressureFactor.complete_pa > 5) score += 1.1 * complete_weight;
    else if(pressureFactor.complete_pa > 3) score += complete_weight;
    else if(pressureFactor.complete_pa > 1) score += 60 / 100 * pressureFactor.complete_pa * complete_weight;
    else if(pressureFactor.complete_pa > -1) score += 20 / 100 * complete_weight;
    else if(pressureFactor.complete_pa > -3) score += 10 / 100 * complete_weight;
    return score;
  }
  
  
  var data = {    
    "stuff_num": 2,
    "each_data":[
        {
            "name": "a",
            "pressure_factor": {
                "is_nap": true,
                "is_foodout": true,
                "screen_worktime": 300,
                "makeup": -1,
                "over_suager_day":0,
                "is_meeting": false,
                "is_co_meeting": false,
                "complete_pa": 1.9
            }
        },
        {
            "name": "b",
            "pressure_factor": {
                "is_nap": true,
                "is_foodout": true,
                "screen_worktime": 240,
                "makeup": 1,
                "over_suager_day":4,
                "is_meeting": true,
                "is_co_meeting": false,
                "complete_pa": 1.7
            }
        }
    ]
};
  var stuffStress = [];
  
  for(var i = 0; i < data.stuff_num; i++){
    var score = PressureScore(data.each_data[i].pressure_factor);
    if(score >= 66) stuffStress.push(1);
    else if(score <= 33) stuffStress.push(-1);
    else stuffStress.push(0);
  }
  
  return {
      "success": true,
      "processVariable": {
          "data": stuffStress
      },
      "errorMessage": ""
  };