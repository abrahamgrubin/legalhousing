var loadData = function(){
  $.ajax({
    type: 'GET',
    url: '/visualization.json',
    dataType: 'json',
    success: function(data){
      var listings = data.filter(function(point){
        return point.latitude && point.discriminatory;
      });
      drawPieChart(data);
      mapOfBoston(data);
      //initMap(listings);
    },
    failure: function(result){
      alert('ERROR');
    }
  })
}

function drawPieChart(data){
  d3plus.viz()
    .container("#viz")
    .data(data)
    .type("pie")
    .id("discriminatory")
    .size("id")
    .draw()
}

function mapOfBoston(data){
  var discriminatoryPoints = {
    type: 'FeatureCollection',
    features: []
  }
  for (var key in data) {
    var discriminatory = data[key].discriminatory,
    latitude = data[key].latitude;
    if (discriminatory && latitude && latitude != 5.5){
    var newPoint = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [data[key].latitude, data[key].longitude],
        properties: data[key]
      }
    }
    discriminatoryPoints.features.push(newPoint);
  }
}
console.log(discriminatoryPoints.features);
  var width = 700,
      height = 580;
  var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);
  var svg = d3.select( "body" )
    .append( "svg" )
    .attr( "width", width )
    .attr( "height", height );
  var neighborhoods = svg.append( "g" ).attr( "id", "neighborhoods" );
  var albersProjection = d3.geo.albers()
    .scale( 190000 )
    .rotate( [71.057,0] )
    .center( [0, 42.313] )
    .translate( [width/2,height/2] );
  var geoPath = d3.geo.path()
      .projection( albersProjection );
  neighborhoods.selectAll( "path" )
    .data( neighborhoods_json.features )
    .enter()
    .append( "path" )
    .attr( "d", geoPath )
    .on("mouseover", function(d) {
      div.transition()
          .duration(200)
          .style("opacity", .9);
      div	.html(d.properties.Name)
          .style("left", (d3.event.pageX) + "px")
          .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d) {
            div.transition()
            .duration(500)
            .style("opacity", 0);
        });
        var dListing = svg.append( "g" ).attr( "id", "dListing" );
        dListing.selectAll( "path" )
          .data(discriminatoryPoints.features)
          .enter()
          .append( "path" )
          .attr( "d", geoPath );
  }

$(document).ready(function(){
  loadData();
});
