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
  var myBarChart = new Chart(ctx).Bar(chartData, {
    animation:false,
    barValueSpacing : 1
  });
}

function init1102() {

  $.getJSON("../ssbapi/1076", function(apidata) {
    $("#label").text(apidata.dataset.label);

    var contents = new Array();
    var regionStats = {};
    var regions = new Array();

    var contentsCount = apidata.dataset.dimension.size[1];
    var regionCount = apidata.dataset.dimension.size[0];
    for (var i = 1; i < regionCount + 1; i++) {
      if (i == 13) i++;
      var regionName = i + " " + apidata.dataset.dimension.Region.category.label[(i < 10 ? "0" : "") + i];
      regions.push(regionName);
      regionStats[regionName] = new Array();
    }

    for (var age = 0; age < contentsCount; age++) {
      var key = ((age < 10) ? "00" : (age < 100 ? "0" : "")) + age;
      contents.push(apidata.dataset.dimension.Alder.category.label[key]);
    }

    var regionNumber = 0;
    for (key in regionStats) {
      for (var contentIndex = 0; contentIndex < contentsCount; contentIndex++) {
        var dataIndex = contentIndex + contentsCount * regionNumber;
        regionStats[key].push(apidata.dataset.value[dataIndex]);
      }
      var regionChartElement = $("<canvas width='1024' height='400'></canvas>");
      $("#charts").append("<h3>" + key + "</h3>");
      $("#charts").append(regionChartElement);
      makeGraph(contents, regionStats[key], regionChartElement);
      regionNumber++;
    }

  });
}

$(document).ready(init1102);
