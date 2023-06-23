$(document).ready(function () {
  if (allowToNewSched())
    getNewSchedSub();
});

function toStart() {
  window.location.href = "./index.html";
}

function allowToNewSched() {
  // judge if the pressure score is too low to don't get into the schedule page
  var avgPressureScore = sessionStorage.getItem("avgPressureScore");
  avgPressureScore = parseInt(avgPressureScore);
  if (avgPressureScore < 66) {
    swal.fire({
      title: "Warning!",
      text: "Your pressure score is too low",
      icon: "warning",
    }).then(() => {
      window.location.href = "./index.html";
      return false;
    });
  }
  else
    return true;
}

function getNewSched() {
  $.ajax({
    url: "/getNewSched",
    type: "POST",
    success: function (res) {
      drawNewGantt(res);
    },
    error: function (err) {
      swal.fire({
        title: "Error",
        text: err,
        icon: "error",
      }).then(() => {
        location.reload();
      });
    }
  });
}

function getNewSchedSub() {
  $.ajax({
    url: "/getNewSchedSub",
    type: "POST",
    success: function (res) {
      sessionStorage.setItem("modifiedTask", JSON.stringify(res));
      var newTask = false;
      for (var i of res.getNewSchedSub) {
        if (i.length != 0) {
          newTask = true;
          break;
        }
      }
      if (newTask)
        getNewSched();
      else
        swal.fire({
          title: "Warning!",
          text: "There is no task to be modified",
          icon: "warning",
        }).then(() => {
          window.location.href = "./index.html";
        });
    },
    error: function (err) {
      swal.fire({
        title: "Error",
        text: err,
        icon: "error",
      }).then(() => {
        location.reload();
      });
    }
  });
}

function setNewSched(dataToChange) {
  $.ajax({
    url: "/setNewSched",
    type: "POST",
    success: function (res) {
      setSched(dataToChange);
    },
    error: function (err) {
      swal.fire({
        title: "Error",
        text: err,
        icon: "error",
      }).then(() => {
        location.reload();
      });
    }
  });
}

function getAllData() {
  $.ajax({
    url: "/getAllData",
    type: "POST",
    success: function (res) {
      return res;
    },
    error: function (err) {
      swal.fire({
        title: "Error",
        text: err,
        icon: "error",
      }).then(() => {
        location.reload();
      });
    }
  });
}

function drawNewGantt(newSched) {
  var oriSched = sessionStorage.getItem("oriSched");
  sessionStorage.setItem("newSched", JSON.stringify(newSched));
  var modifiedTask = sessionStorage.getItem("modifiedTask");
  oriSched = JSON.parse(oriSched);
  modifiedTask = JSON.parse(modifiedTask);
  modifiedTask = modifiedTask.getNewSchedSub;
  for (var i = 0; i < oriSched.data.length; i++) {
    if (oriSched.data[i].type == "task") {
      oriSched.data[i].color = "#666666";
      oriSched.data[i].textColor = "#aaaaaa";
    }
  }
  console.log("oriSched");// original schedule
  console.log(oriSched);
  console.log("newSched");// modified schedule
  console.log(newSched);

  var taskNum = 0, curSched;
  for (let idx in modifiedTask) {
    taskNum += modifiedTask[idx].length;// count modified task number
  }
  console.log("modifiedTask");// will modified task
  console.log(modifiedTask);


  var _i = 0, _j = 0, flg = false;
  for (var i = 0; i < newSched.length; i++) {
    for (var j = 0; j < newSched[i].task.length; j++) {

      var Name = newSched[i].task[j].taskName;
      for (let idx in modifiedTask[i]) {
        if (Name == modifiedTask[i][idx]) {
          flg = true;
          break;
        }
      }
      if (flg) { //Name need to be modified
        flg = false;
        ++_j;
        --taskNum;
      }
      else {
        (newSched[i].task).splice(j, 1);
        --j;
      }
      if (taskNum == 0) {
        (newSched[i].task).splice(j + 1);
        break;
      }
      if (_j == modifiedTask[i].length) {
        _j = 0;
        continue;
      }
    }
  }
  console.log("newSched with out no modify task");
  console.log(newSched);

  for (var i = 1; i <= newSched.length; i++) {// run everyone's schedule
    for (var j = 1; j <= newSched[i - 1].task.length; j++) {// run everyone's task
      curSched = newSched[i - 1].task[j - 1];// current task
      for (var k = 0; k < oriSched.data.length; k++) {// run original schedule
        // TODO: MODIFY includes
        if (oriSched.data[k].id.includes(i + "-") && oriSched.data[k].text == curSched.taskName) {// find current task in original schedule
          oriSched.data[k].id = "@" + oriSched.data[k].id;
          oriSched.data[k].text = "@" + oriSched.data[k].text;
          oriSched.data[k].type = "project";
          oriSched.data[k].render = "split";
          oriSched.data[k].color = "#ffa500";
          oriSched.data[k].textColor = "#000000";
          oriSched.data[k].open = false;
          for (var l = 0; l < curSched.duration.length; l++) {
            var oriSchedId = oriSched.data[k].id.split("-")[1];
            var eachTask = {
              "id": String(i) + "-" + String(oriSchedId) + "-" + String(l),
              "text": "#" + curSched.taskName,
              "start_date": curSched.start[l],
              "duration": curSched.duration[l],
              "parent": "@" + String(i) + "-" + String(oriSchedId),
              "type": "task"
            };
            oriSched.data.push(eachTask);
            var eachLink = {
              "id": String(i) + "-" + String(oriSchedId) + "-" + String(l),
              "source": String(i) + "-" + String(oriSchedId) + "-" + String(l),
              "target": String(i) + "-" + String(oriSchedId) + "-" + String(l + 1),
              "type": "0"
            };
            oriSched.links.push(eachLink);
          }
          break;
        }
      }
    }
  }
  console.log("oriSched with modify task");
  console.log(oriSched);
  gantt.init("new_gantt_here");
  gantt.parse(oriSched);
}

function setPersonalTask(date, name, dataToChange) {
  $.ajax({
    url: "/setPersonalTask",
    type: "POST",
    success: function (res) {
      for (var i = 0; i < res.project.daily_task.length; i++) {
        if (date == res.project.daily_task[i].today) {
          for (var j = 0; j < res.project.employee_num; j++) {
            if (name == res.project.daily_task[i].employee[j].name) {
              changePersonalTask(i, j, dataToChange);
              break;
            }
          }
          break;
        }
      }
    },
    error: function (err) {
      swal.fire({
        title: "getAllData_error",
        text: err,
        icon: "error",
      }).then(() => {
        location.reload();
      });
    }
  });
}

function changePersonalTask(date, name, dataToChange) {
  var data = {
    date: date,
    name: name,
    dataToChange: dataToChange
  };

  $.ajax({
    url: "/setPersonalTask",
    type: "POST",
    data: JSON.stringify(data),
    success: function (res) {
      swal.fire({
        title: "Success",
        icon: "success",
      }).then(() => {
        location.reload();
      });
    },
    error: function (err) {
      swal.fire({
        title: "Error",
        text: err,
        icon: "error",
      }).then(() => {
        location.reload();
      });
    }
  });
}

function setSched(dataToChange) {
  var data = {
    dataToChange: dataToChange
  };

  $.ajax({
    url: "/setNewSched",
    type: "POST",
    data: JSON.stringify(data),
    success: function (res) {
      swal.fire({
        title: "Success",
        icon: "success",
      }).then(() => {
        toStart();
      });
    },
    error: function (err) {
      swal.fire({
        title: "Error",
        text: err,
        icon: "error",
      }).then(() => {
        location.reload();
      });
    }
  });
}


function dateDiff(Date1_, Date2_) {
  var Date1 = [Date1_.slice(0, 4), Date1_.slice(4, 6), Date1_.slice(6, 8)].join('-')
  var Date2 = [Date2_.slice(0, 4), Date2_.slice(4, 6), Date2_.slice(6, 8)].join('-')

  var date1 = new Date(Date1);
  var date2 = new Date(Date2);
  var milliseconds_Time = date2.getTime() - date1.getTime();
  return milliseconds_Time / (1000 * 3600 * 24);
}