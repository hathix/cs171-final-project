// from http://jsfiddle.net/ragingsquirrel3/qkHK6/

/**
 * "Wheel of fortune" esque spinner to show the difficulty of getting a perpetrator arrested
 */
ArrestWheel = function(_parentElement) {
  this.parentElement = _parentElement;

  // total slices, and "winning" slices
  this.slices = 16;
  this.winningSlices = 1;

  this.width = 400;
  this.height = 400;
  this.radius = this.height / 2;

  this.prepareData();
}

/**
 * Generates dummy data for this wheel.
 */
ArrestWheel.prototype.prepareData = function() {
  var vis = this;

  // make dummy data to get the right number of evenly-spaced slices
  vis.data = [];
  for (var i = 0; i < vis.slices; i++) {
    vis.data.push(1);
  }

  vis.initVis();
};

/**
 * Draws the wheel.
 */
ArrestWheel.prototype.initVis = function() {
  var vis = this;

  vis.svg = d3.select("#" + vis.parentElement)
    .append("svg")
    .attr("width", vis.width)
    .attr("height", vis.height);

  vis.wheelHolder = vis.svg.append("g")
    .attr("transform", "translate(" + vis.radius + "," + vis.radius + ")");

  // svg => wheelHolder => wheelGroup (where the wheel is actually drawn )
  vis.wheelGroup = vis.wheelHolder.append("g");


  // prepare the pie layout
  vis.pie = d3.layout.pie()
    .value(function(d) {
      return d;
    });

  // arc generator function
  vis.arc = d3.svg.arc()
    .innerRadius(0)
    .outerRadius(vis.radius);

  // draw pie paths
  vis.arcs = vis.wheelGroup.selectAll("g.slice")
    .data(vis.pie(vis.data))
    .enter()
    .append("g")
    .attr("class", "slice")
    .append("path")
    .attr("fill", function(d, i) {
      // only 1 slice is good
      return i < vis.winningSlices ? "red" : "white";
    })
    .attr("d", vis.arc);


    // click handler to spinner
    vis.svg.on("click", function() {
        vis.spin();
    });
};

ArrestWheel.prototype.spin = function() {
    var vis = this;

    // start a timer to spin the spinner, and have it stop at a random spot
    var startTime = Date.now();
    //  have it spin a few times
    var numRotations = 5 + Math.floor(Math.random() * 5);
    // then
    var endAngle = (numRotations * 360) + Math.random() * 360;


    d3.timer(function(){
        // delta is time, in ms, since the timer started
        var delta = Date.now() - startTime;

        // calcualte the raw angle
        var rawAngle = delta;

        // cap it at the end angle so the spinner eventually stops
        var angle = Math.min(rawAngle, endAngle);

        vis.wheelGroup.attr("transform", "rotate(" + angle + ")");
    });
};
