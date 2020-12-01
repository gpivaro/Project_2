// Creating our initial map object

// L.map accepts 2 arguments: id of the HTML element to insert the map, and an object containing the initial options for the new map
var myMap = L.map("map", {
  center: [29.76, -95.37],
  zoom: 11
});

// Adding a tile layer (the background map image) to our map.
// Leaflet doesn't have out-of-the-box tile layers, but it allows us to usetile layer APIs. Here, we're using mapbox.
// We use the addTo method to add objects to our map
// Documentation for tileLayer:https://leafletjs.com/reference-1.6.0.html#tilelayer
L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "streets-v11",
  accessToken: API_KEY
}).addTo(myMap);

url = "https://opensky-network.org/api/states/all";


d3.json(url).then((data) => {

  // Store the imported data to a variable
  var flightData = data;
  // Print the data
  console.log(flightData);

  console.log(flightData.states);

  console.log(flightData.states[1]);

  console.log(flightData.states[1][5]);

  console.log(flightData.states[1][6]);


  liveData = [];
  for (var i = 0; i < flightData.states.length; i++) {
    if (flightData.states[i][5]) {
      // console.log(flightData.states[i][6]);
      liveData.push({ "name": flightData.states[i][1], "lat": flightData.states[i][5], "lon": flightData.states[i][6] });
    }
  }
  console.log(liveData);


});