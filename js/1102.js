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

function init1102() {

  $.getJSON("../ssbapi/1102", function(apidata) {
    $("#label").text(apidata.dataset.label);

    var labels = new Array();
    var regionStats = {};

    for (var i =1; i<21;i++ ) {
      if(i==13) i++;
      var regionName = i+" "+ apidata.dataset.dimension.Region.category.label[(i<10?"0":"")+i];
      regionStats[regionName] = new Array();
    }

    for (label in apidata.dataset.dimension.ContentsCode.category.label) {
      labels.push(apidata.dataset.dimension.ContentsCode.category.label[label]);
    }

    var regionNumber = 0;
    for (key in regionStats) {
      var contentsCount = apidata.dataset.dimension.size[1];
      for (var contentIndex = 0; contentIndex < contentsCount; contentIndex++) {
        var dataIndex = contentIndex + contentsCount * regionNumber;
        regionStats[key].push(apidata.dataset.value[dataIndex]);
      }
      var regionChartElement = $("<canvas width='1024' height='400'></canvas>");
      $("#charts").append("<h2>" + key + "</h2>");
      $("#charts").append(regionChartElement);
      makeGraph(labels, regionStats[key], regionChartElement);
      regionNumber++;
    }

  });
}

$(document).ready(init1102);
