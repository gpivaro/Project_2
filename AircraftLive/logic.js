// Creating our initial map object
// L.map accepts 2 arguments: id of the HTML element to insert the map, and an object containing the initial options for the new map
var myMap = L.map("map", {
  // For Houston uncomment:
  // center: [31.56, -96.47],
  center: [0, 0],
  zoom: 2.1
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


/* Date.prototype.toLocaleDateString()
     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString */
var options = { year: 'numeric', month: 'numeric', day: 'numeric' };
options.timeZone = 'UTC';


/* 
This is the official documentation of the OpenSky Network’s live API. 
The API lets you retrieve live airspace information for research and non-commerical purposes. 
Documentation: https://opensky-network.org/apidoc/rest.html
 */
url = "https://opensky-network.org/api/states/all";


d3.json(url).then((data) => {
  // Store the imported data to a variable
  flightData = [];
  for (var i = 0; i < data.states.length; i++) {
    // conditional test to get only fligths with available location and not on the ground
    if (data.states[i][5] && !data.states[i][8]) {
      var time_position = new Date(data.states[i][3] * 1000);
      var last_contact = new Date(data.states[i][4] * 1000);
      if (data.states[i][16] === 0) {
        position_source = "ADS-B"
      }
      else if (data.states[i][16] === 1) {
        position_source = "ASTERIX"
      }
      else {
        position_source = "MLAT"
      }
      flightData.push({
        "icao24": data.states[i][0],
        "callsign": data.states[i][1],
        "origin_country": data.states[i][2],
        "time_position": time_position.toLocaleTimeString("en-US", options),
        "last_contact": last_contact.toLocaleTimeString("en-US", options),
        "longitude": data.states[i][5],
        "latitude": data.states[i][6],
        "baro_altitude": data.states[i][7],
        "on_ground": data.states[i][8],
        "velocity": data.states[i][9],
        "true_track": data.states[i][10],
        "vertical_rate": data.states[i][11],
        "sensors": data.states[i][12],
        "geo_altitude": data.states[i][13],
        "squawk": data.states[i][14],
        "spi": data.states[i][15],
        "position_source": position_source
      });
    }
  }
  // print the object data
  console.log(flightData);


  flightData.forEach(function (element) {
    // add circles to map for each flight
    L.circle([element.latitude, element.longitude], {
      fillOpacity: 0.75,
      // color: "black",
      fillColor: "red",
      // Adjust radius
      radius: 50000
    }).bindPopup(`<h3>ICAO address: ${element["icao24"]}</h3><hr>
    Callsign: ${element["callsign"]} <br/>
    Origin country: ${element["origin_country"]}<br/>
    Time of position update: ${element["time_position"]} (UTC)<br/>
    Time of last update: ${element["last_contact"]} (UTC)<br/>
    Longitude: ${element["longitude"]}<br/>
    Latitude: ${element["latitude"]}<br/>
    Altitude ${element["baro_altitude"]} m | ${Math.round(element["baro_altitude"] * 3.28084)} ft<br/>
    On ground: ${element["on_ground"]}<br/>
    Velocity: ${element["velocity"]} m/s | ${Math.round(element["velocity"] * 2.23694)} mph <br/>
    True track: ${element["true_track"]}° (north=0°)<br/>
    Vertical rate: ${element["vertical_rate"]} m/s<br/>
    Sensors ID: ${element["sensors"]}<br/>
    Geometric altitude: ${element["geo_altitude"]} m | ${Math.round(element["geo_altitude"] * 3.28084)} ft<br/>
    Transponder code: ${element["squawk"]}<br/>
    Special purpose indicator: ${element["spi"]}<br/>
    Position_source: ${element["position_source"]}<br/>
    For more details: <a href='https://flightaware.com/live/flight/${element["callsign"]}' target="_blank">link</a>
  `).addTo(myMap);

  })



});



var time_now = Date.now() / 1000
var time_onehour = (Date.now() / 1000 + 1000 * 60 * 60)
var departure_url = `https://opensky-network.org/api/flights/departure?airport=EDDF&begin=${time_now}&end=${time_onehour}`
console.log(departure_url)

