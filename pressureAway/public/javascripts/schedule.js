$(document).ready(function () {
  getNewSched();
});

function toStart() {
  window.location.href = "./index.html";
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

function setNewSched() {
  $.ajax({
    url: "/setNewSched",
    type: "POST",
    success: function (res) {
      alert("Data Changed");
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

function drawNewGantt(newTask) {
  var oriSched = sessionStorage.getItem("oriSched");
  oriSched = JSON.parse(oriSched);
  for (var i = 0; i < oriSched.data.length; i++) {
    if (oriSched.data[i].type == "task")
      oriSched.data[i].color = "#dddddd";
  }

  var TASK = [["work8", "work10", "work11", "work13", "work24", "work25", "work26"], []], taskNum = 0, taskIdx, curSched, curTask, parentId;
  var _i = 0, _j = 0, flg = false, TASK_NUM = 0;
  for (let idx in TASK) {
    TASK_NUM += TASK[idx].length;
  }
  console.log("TASK_NUM");
  console.log(TASK_NUM);
  for (var i = 0; i < newTask.length; i++) {
    for (var j = 0; j < newTask[i].task.length; j++) {

      var Name = newTask[i].task[j].taskName;
      for (let idx in TASK[_i]) {
        if (Name == TASK[_i][idx]) {
          flg = true;
          break;
        }
      }
      if (flg) { //Name is modify task
        flg = false;
        ++_j;
        --TASK_NUM;
      }
      else {
        (newTask[i].task).splice(j, 1);
        --j;
      }
      if (TASK_NUM == 0) {
        (newTask[i].task).splice(j + 1);
        break;
      }
      if (_j == TASK[_i].length) {
        ++_i;
        _j = 0;
      }
    }
    if (TASK_NUM == 0) {
      // (newTask).splice(i);
      break;
    }
  }
  console.log("newTask with out no modify task");
  console.log(newTask);

  // for (var i = 1; i <= newTask.length; i++) { //run everyone's schedule
  //   taskIdx = 0; //reset everyone's current schedIdx
  //   taskNum += newTask[i - 1].task.length; //taskNum += everyone's task number
  //   for (var curSchedIndex = 0; curSchedIndex < taskNum; curSchedIndex++) { //run everyone's task
  //     if (taskIdx <= TASK[i].length && oriSched.data[curSchedIndex].text == TASK[i][taskIdx]) { //judge if the task need to be modified
  //       oriSched.data[curSchedIndex].text = "#" + oriSched.data[curSchedIndex].text;
  //       oriSched.data[curSchedIndex].render = "split";
  //       oriSched.data[curSchedIndex].type = "project";
  //       delete oriSched.data[curSchedIndex].color;
  //       parentId = oriSched.data[curSchedIndex].id;
  //       taskIdx++;
  //       for (var j = 0; j < newTask[i - 1].task.length; j++) { //run everyone's task
  //         curSched = oriSched.data[curSchedIndex];
  //         curTask = newTask[i - 1].task[j];
  //         if (curSched.text == curTask.taskName) { //find the task
  //           const modifiedTask = {
  //             text: curTask.taskName + "-" + j,
  //             start_date: curTask.start[0],
  //           }
  //         }
  //       }
  //     }
  //   }

  //   gantt.init("new_gantt_here");
  //   gantt.parse(oriSched);
  // }
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
        text: "Data Changed",
        icon: "success",
      }).then(() => {
        location.reload();
      });
      // alert("Data Changed");
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
        text: "Data Changed",
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


// function getNewSched() { // page 2
//   $.ajax({
//     url: "/getNewSched",
//     type: "POST",
//     success: function (res) {
//       document.getElementById("all_data").innerHTML = JSON.stringify(res);
//     },
//     error: function (err) {
//       swal.fire({
//         title: "Error",
//         text: err,
//         icon: "error",
//       }).then(() => {
//         location.reload();
//       });
//     }
//   });
// }

function dateDiff(Date1_, Date2_) {
  var Date1 = [Date1_.slice(0, 4), Date1_.slice(4, 6), Date1_.slice(6, 8)].join('-')
  var Date2 = [Date2_.slice(0, 4), Date2_.slice(4, 6), Date2_.slice(6, 8)].join('-')

  var date1 = new Date(Date1);
  var date2 = new Date(Date2);
  var milliseconds_Time = date2.getTime() - date1.getTime();
  return milliseconds_Time / (1000 * 3600 * 24);
}