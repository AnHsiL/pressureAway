gantt.config.columns = [
  { name: "text", tree: true, resize: true, label: "Task" },
  { name: "start_date", align: "center", resize: true },
  { name: "duration", align: "center", resize: true },
  { name: "add", resize: true, hide: true }
]

gantt.plugins({
  tooltip: true,
  marker: true,
});

var dateToStr = gantt.date.date_to_str(gantt.config.task_date);
var id = gantt.addMarker({
  start_date: new Date(),
  css: "today_line",
  title: dateToStr(new Date()),
  content: "Today: " + dateToStr(new Date()),
});

// set gantt_marker_content
gantt.templates.marker_text = function (marker) {
  return marker.title;
};
setInterval(function () {
  var today = gantt.getMarker(id);
  today.start_date = new Date();
  today.title = dateToStr(today.start_date);
  gantt.updateMarker(id);
}, 1000 * 60);

gantt.config.scale_height = 50;
gantt.config.readonly = true;
gantt.config.open_split_tasks = true;

gantt.templates.grid_file = function (item) {
  return "<div class='gantt_tree_icon'></div>";
};

var weekendsStyle = function (date) {
  var DateToStr = gantt.date.date_to_str("%D");
  if (DateToStr(date) == "Sun" || DateToStr(date) == "Sat") return "weekends";
  else if (dateToStr(date) == dateToStr(new Date())) return "today";
  return "";
};

gantt.config.scales = [
  { unit: "month", step: 1, format: "%F, %Y" },
  { unit: "day", step: 1, format: "%j, %D", css: weekendsStyle },
];