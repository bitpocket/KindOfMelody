(function() {
  var width = 640,
    height = 480,
    radius = Math.min(width, height) / 2;

  function Rad(angle) {
    return (Math.PI * angle) / 180;
  }

  var n = 7,
    gapAngle = 4,
    fieldAngle = 30 - gapAngle,
    startAngle = -105 + gapAngle / 2,
    endAngle = 105,
    innerRadiusRatio = .9,
    outerRadiusRatio = .5,
    textRadius = 1.05;

  var ProgresToOuterRadiusScale = d3.scale.linear()
    .domain([0, 100])
    .range([innerRadiusRatio, outerRadiusRatio]);

  function GetPieLined() {
    var res = [];
    for (var i = 0; i < n; i++) {
      res.push({
        start: Rad(startAngle + i * (fieldAngle + gapAngle)),
        size: Rad(fieldAngle),
        lineColor: "#333",
        fillColor: "white",
        stroke: 2.2
      });

      res.push({
        start: Rad(startAngle + i * (fieldAngle + gapAngle)),
        size: Rad(fieldAngle),
        lineColor: "#333",
        fillColor: "#333",
        isProgress: true,
        stroke: 2.2,
        progress: Math.random() * 100,
        textAngle: startAngle + (i + 0.4) * (fieldAngle + gapAngle),
      });
    }
    return res;
  }

  var dataLined = GetPieLined();

  var arc = d3.svg.arc()
    .outerRadius(function(d, i) {
      if (d.isProgress) {
        return radius * ProgresToOuterRadiusScale(100 - d.progress);
      } else
        return radius * innerRadiusRatio;
    })
    .innerRadius(radius * outerRadiusRatio)
    .startAngle(function(d, i) {
      return d.start;
    })
    .endAngle(function(d, i) {
      return d.start + d.size;
    });

  var labelArc = d3.svg.arc()
    .outerRadius(radius * textRadius)
    .innerRadius(radius * textRadius)
    .startAngle(function(d, i) {
      return d.start;
    })
    .endAngle(function(d, i) {
      return d.start + d.size;
    });

  var chart = d3.select("#svg-cont1").append("svg:svg")
    .attr("class", "chart")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("viewBox", "0 0 640 480")
    .attr("preserveAspectRatio", "xMaxYMax")
    .append("svg:g")
    .attr("transform", "translate(320,290)");

  chart.selectAll(".linedArc")
    .data(dataLined)
    .enter().append("svg:path")
    .style("fill", function(d, i) {
      return d.fillColor;
    })
    .style("stroke", function(d, i) {
      return d.lineColor;
    })
    .style("stroke-width", function(d, i) {
      return d.stroke;
    })
    .attr("d", arc);

  chart.selectAll("text")
    .data(dataLined)
    .enter().append("text")
    .attr("transform", function(d) {
      return "translate(" + labelArc.centroid(d) + ") rotate(" + (d.textAngle ? d.textAngle : 0) + ")";
    })
    .text(function(d) {
      if (d.isProgress) {
        return Math.round(d.progress) + "%"
      } else return "";
    })
    .attr("text-anchor", "middle")
    .attr("font-family", "Raleway")
    .attr("font-size", "25px");;

  function transition() {
    for (var i = 0; i < dataLined.length; i++) {
      if (dataLined[i].isProgress)
        dataLined[i].progress = Math.random() * 100;
    }

    chart.selectAll("g > path")
      .transition()
      .duration(500)
      .attr("d", arc);

    chart.selectAll("g > text")
      .transition()
      .duration(500)
      .tween("text", function(d) {
        if (d.isProgress) {
          var i = d3.interpolate(this.textContent.replace("%", ""), d.progress);

          return function(t) {
            this.textContent = Math.round(i(t)) + "%";
          };
        } else return function(t) {
          this.textContent = "";
        }
      })

    setTimeout(function() {
      transition();
    }, 2000);
  }

  transition();

})();
