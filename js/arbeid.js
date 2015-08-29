function makeGraph(labels, values, element) {
  var ctx = element.get(0).getContext("2d");
  var chartData = {
    labels: labels,
    datasets: [{
      label: "Engraph",
      fillColor: "rgba(220,220,220,0.5)",
      strokeColor: "rgba(0,0,0,0.8)",
      highlightFill: "rgba(220,220,220,0.75)",
      highlightStroke: "rgba(220,220,220,1)",
      data: values
    }]
  };
  var myBarChart = new Chart(ctx).Bar(chartData);
}

function initArbeid() {

  $.getJSON("../ssbapi/1052", function(apidata) {
    $("#1052label").text(apidata.dataset.label);

    var labels = new Array();
    var percent = new Array();
    var kilo = new Array();

    for (label in apidata.dataset.dimension.Tid.category.label) {
      labels.push(label.substr(0,4) + "/"+label.substr(5,6));
    }

    apidata.dataset.value.forEach(function(element, index) {
      if ((index % 2) == 0) {
        kilo.push(element);
      } else {
        percent.push(element);
      }
    });

    makeGraph(labels, kilo, $("#1052chart_kilo"));
    makeGraph(labels, percent, $("#1052chart_percent"));

  });
}

$(document).ready(initArbeid);
