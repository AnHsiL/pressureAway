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
      // console.log("res");
      // console.log(res);
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

function drawNewGantt(newSched) {
  var dataToGantt = sessionStorage.getItem("oriSched");
  dataToGantt = JSON.parse(dataToGantt);
  for (var i = 0; i < dataToGantt.data.length; i++) {
    if (dataToGantt.data[i].type == "task")
      dataToGantt.data[i].color = "#dddddd";
  }


  gantt.init("new_gantt_here");
  gantt.parse(dataToGantt);
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