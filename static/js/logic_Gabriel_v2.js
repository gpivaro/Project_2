/* ************************************************************************************************ */
/* ************************************************************************************************ */
/* ************************************************************************************************ */
/* ************************************************************************************************ */
/* Setup parameters and functions */

// Responsive chart and hide control buttons on Plotly charts
var config = {
    responsive: true,
    displayModeBar: false
};


// To use OpenStreetMap instead of MapBox
// Define variables for our tile layers
// To use OpenStreetMap instead of MapBox
var attribution =
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
var titleUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var OpenStreetTiles = L.tileLayer(titleUrl, { attribution });



/* Date.prototype.toLocaleDateString()
     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString */
var timeOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
// timeOptions.timeZone = 'UTC';

//   Markers With Custom Icons
var aircraftIcon = L.icon({
    iconUrl: '/static/images/Airplane_wwwroot_uploads_svg_symbol_0qvhey5-airplane-vector.svg',

    iconSize: [38 / 3, 95 / 3], // size of the icon
    //     shadowSize:   [50, 64], // size of the shadow
    iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
    //     shadowAnchor: [4, 62],  // the same for the shadow
    popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});


/* ************************************************************************************************ */
/* ************************************************************************************************ */
/* ************************************************************************************************ */
/* ************************************************************************************************ */
/*  Aircrafts live data */

/* 
This is the official documentation of the OpenSky Network’s live API. 
The API lets you retrieve live airspace information for research and non-commerical purposes. 
Documentation: https://opensky-network.org/apidoc/rest.html
 */

aircrafts_api_url = "/api/v1.0/aircrafts-data"
airports_api_url = "/api/v1.0/airports-data"

d3.json(aircrafts_api_url).then((aircraftsData) => {
    return aircraftsData
}).then(
    function (aircraftsData) {
        d3.json(airports_api_url).then((importedData) => {

            var flightData = aircraftsData;

            // Retrieve the newest meas time and convert the format
            var newestData = new Date(flightData[0].time * 1000);
            var newestDataTime = newestData.toLocaleTimeString("en-US", timeOptions);

            // add marker to map for each flight
            aircrafts = []
            flightData.forEach(function (element) {
                circles = L.marker([element.latitude, element.longitude], {
                    icon: aircraftIcon,
                    // fillOpacity: 0.75,
                    // color: "red",
                    // fillColor: "blue",
                    // Adjust radius
                    // radius: 20000
                }).bindPopup(`<h5>Aircraft Info:</h5><hr>
                            ICAO address: ${element["icao24"]}<br/>
                            Callsign: <a href='https://flightaware.com/resources/registration/${element["callsign"]}' target="_blank">${element["callsign"]}</a><br/>
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
                    `, { "background": "#2c3e50" })

                aircrafts.push(circles);

            });


            var airportData = importedData;


            airportArray = [];
            airportData.forEach(function (element) {
                if (element.Country) {
                    circles = L.circle([element.Latitude, element.Longitude], {
                        fillOpacity: 0.75,
                        color: "green",
                        fillColor: "black",
                        // Adjust radius
                        radius: 2000
                    }).bindPopup(`<h5>${element["Name"]}</h5><hr>
                          Airport ID: ${element["AirportID"]}<br/>
                          City: ${element["City"]}<br/>
                          Country: ${element["Country"]}<br/>
                          DST: ${element["DST"]}<br/>
                          IATA: ${element["IATA"]}<br/>
                          ICAO: ${element["ICAO"]}<br/>
                          Altitude: ${element["Altitude"]} m<br/>
                          Latitude: ${element["Latitude"]}<br/>
                          Longitude: ${element["Longitude"]}<br/>
                          Source: ${element["Source"]}<br/>
                          Timezone: ${element["Timezone"]}<br/>
                          Type: ${element["Type"]}<br/>
                          Tz database time zone: ${element["Tzdatabasetimezone"]}<br/>
                          For more details: <a href='https://ourairports.com/airports/${element["ICAO"]}' target="_blank">link</a>`
                    )
                    airportArray.push(circles);
                }
            });

            // Define a baseMaps object to hold our base layers
            var baseMaps = {
                //"Street Map": streetmap,
                //"Dark Map": darkmap,
                "OpenStreet": OpenStreetTiles
            };

            // create a layerGroup for each state's markers.
            // Now we can handle them as one group instead of referencing each individually.
            var airportLayer = L.layerGroup(airportArray);

            var aircraftsLayer = L.layerGroup(aircrafts);

            // Create overlay object to hold our overlay layer	
            var overlayMaps = {
                "Airports": airportLayer,
                "Aircrafts": aircraftsLayer
            };

            // Create our map, giving it the streetmap and earthquakes layers to display on load
            var myMap = L.map("map", {
                center: [39, -99],
                zoom: 4,
                layers: [OpenStreetTiles, airportLayer, aircraftsLayer]

            });


            // Leaflet.Terminator https://github.com/joergdietrich/Leaflet.Terminator
            L.terminator().addTo(myMap);


            // Create a layer control
            // Pass in our baseMaps and overlayMaps
            // Add the layer control to the map
            L.control.layers(baseMaps, overlayMaps, {
                collapsed: false
            }).addTo(myMap);




        });
    }
);







// airports_api_url = "/api/v1.0/airports-data"
// d3.json(airports_api_url).then((importedData) => {
//     // console.log(importedData);

//     var airportData = importedData;


//     airportArray = [];
//     airportData.forEach(function (element) {
//         if (element.Country) {
//             circles = L.circle([element.Latitude, element.Longitude], {
//                 fillOpacity: 0.75,
//                 color: "green",
//                 fillColor: "black",
//                 // Adjust radius
//                 radius: 2000
//             }).bindPopup(`<h5>${element["Name"]}</h5><hr>
//                   Airport ID: ${element["AirportID"]}<br/>
//                   City: ${element["City"]}<br/>
//                   Country: ${element["Country"]}<br/>
//                   DST: ${element["DST"]}<br/>
//                   IATA: ${element["IATA"]}<br/>
//                   ICAO: ${element["ICAO"]}<br/>
//                   Altitude: ${element["Altitude"]} m<br/>
//                   Latitude: ${element["Latitude"]}<br/>
//                   Longitude: ${element["Longitude"]}<br/>
//                   Source: ${element["Source"]}<br/>
//                   Timezone: ${element["Timezone"]}<br/>
//                   Type: ${element["Type"]}<br/>
//                   Tz database time zone: ${element["Tzdatabasetimezone"]}<br/>
//                   For more details: <a href='https://ourairports.com/airports/${element["ICAO"]}' target="_blank">link</a>`
//             )
//             airportArray.push(circles);
//         }
//     });

//     // Define a baseMaps object to hold our base layers
//     var baseMaps = {
//         //"Street Map": streetmap,
//         //"Dark Map": darkmap,
//         "OpenStreet": OpenStreetTiles
//     };

//     // create a layerGroup for each state's markers.
//     // Now we can handle them as one group instead of referencing each individually.
//     var airportLayer = L.layerGroup(airportArray);

//     // Create overlay object to hold our overlay layer	
//     var overlayMaps = {
//         "Airports": airportLayer
//     };

//     // Create our map, giving it the streetmap and earthquakes layers to display on load
//     var myMap = L.map("map", {
//         center: [39, -99],
//         zoom: 5,
//         layers: [OpenStreetTiles, airportLayer]

//     });


//     // Leaflet.Terminator https://github.com/joergdietrich/Leaflet.Terminator
//     L.terminator().addTo(myMap);


//     // Create a layer control
//     // Pass in our baseMaps and overlayMaps
//     // Add the layer control to the map
//     L.control.layers(baseMaps, overlayMaps, {
//         collapsed: false
//     }).addTo(myMap);


// });

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [{
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});