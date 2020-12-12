

function distCalc(origin, destination) {
    var from = turf.point(origin);
    var to = turf.point(destination);
    var options = { units: 'miles' };
    return distance = turf.distance(from, to, options);
    // console.log(distance)
}

// function to access the api and get the json data
function getDataICAO(icao24) {
    url_icao24 = `api/v1.0/aircrafts-data/icao24/${icao24}`
    d3.json(url_icao24).then((importData) => { createMarker(importData) });
};


// function to access the api and get the json data
function getDataCallsign(callsign) {
    url_icao24 = `/api/v1.0/aircrafts-data/callsign/${callsign}`
    d3.json(url_icao24).then((importData) => { createMarker(importData) });
};

// function to access the api and get the json data to populate the dropdown menus
function loadDropdown() {
    url_icao24 = `/api/v1.0/aircrafts-data`
    d3.json(url_icao24).then((importData) => {
        var icao24Array = []
        var callsignArray = []
        importData.forEach(element => {
            if (element.icao24 != '') {
                icao24Array.push(element.icao24)
            };
            if (element.callsignArray != '') {
                callsignArray.push(element.callsign)
            };
        })

        // Sort arrays
        icao24Array.sort();
        callsignArray.sort();

        // Remove empty strings on the array
        var newIcao24Array = icao24Array.filter(function (e) {
            return e === 0 ? '0' : e
        })
        var newcallsignArray = callsignArray.filter(function (e) {
            return e === 0 ? '0' : e
        })

        // console.log(newcallsignArray);

        /* Data binding with the enter function to populate 
                the dropdown menu with subject ids available */
        d3.select('#selectICAO24')
            .selectAll('option')
            .data(newIcao24Array)
            .enter()
            .append('option')
            .attr("value", function (data, index) {
                return data;
            })
            .text(function (data, index) {
                return data;
            });

        /* Data binding with the enter function to populate 
            the dropdown menu with subject ids available */
        d3.select('#selectCallsign')
            .selectAll('option')
            .data(newcallsignArray)
            .enter()
            .append('option')
            .attr("value", function (data, index) {
                return data;
            })
            .text(function (data, index) {
                return data;
            });

    });
};

// Event listener to update page based on the dropdown selection
function updatePageICAO() {
    // Select the dropdown and set the variable with the value of the dropdown
    var dropdown = d3.select('#selectICAO24');
    var dropdownValue = dropdown.property('value');
    console.log(dropdownValue);

    // Pass the selected value to the function that will 
    // get the data based on the selected value
    getDataICAO(dropdownValue);
};

// Event listener to update page based on the dropdown selection
function updatePageCallsign() {
    // Select the dropdown and set the variable with the value of the dropdown
    var dropdown = d3.select('#selectCallsign');
    var dropdownValue = dropdown.property('value');
    console.log(dropdownValue);

    // Pass the selected value to the function that will 
    // get the data based on the selected value
    getDataCallsign(dropdownValue);
};


// function to create the markers and the marker layer
function createMarker(data) {
    // create array of markers
    var markersArray = [];
    var latlngsPolyline = [];
    var allAircrafts = [];
    var allFligths = [];
    data.forEach(element => {
        // console.log([element.latitude, element.longitude]);
        var marker = L.circle([element.latitude, element.longitude], {
            radius: 5000,
            color: "red"
        }).bindPopup(`<h5>Aircraft Info:</h5><hr>
                            ICAO address: ${element["icao24"]}<br/>
                            Callsign: <a href='https://flightaware.com/resources/registration/${element["callsign"]}' target="_blank">${element["callsign"]}</a><br/>
                            Origin country: ${element["origin_country"]}<br/>
                            Time of position update: ${formatDate(element["time_position"])}<br/>
                            Time of last update: ${formatDate(element["last_contact"])}<br/>
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
                    `, { "background": "#2c3e50" });


        markersArray.push(marker);
        latlngsPolyline.push([element.latitude, element.longitude]);
        if (allAircrafts.includes(element["icao24"])) {
            5
        } else {
            allAircrafts.push(element["icao24"])
        }
        if (allFligths.includes(element["callsign"])) {
            5
        } else {
            allFligths.push(element["callsign"])
        }


    });

    // Verify how many differents flight for the same aircraft
    // or how many different aircrafts for the same flight
    console.log(allAircrafts);
    console.log(allAircrafts.length);
    console.log(allFligths);
    console.log(allFligths.length);
    document.getElementById('aircraftICAOFlight').textContent = `${allAircrafts.length} `;
    document.getElementById('aircraftCallsignICAO').textContent = `${allFligths.length} `;

    // create a layer group with the array of markers
    markersLayer = L.featureGroup(markersArray);

    createLayer(markersLayer);



    // Add lines based on the coordinates
    var polyline = L.polyline(latlngsPolyline, { color: 'blue' }).addTo(mapAirplanes);

    // zoom the map to the polyline
    mapAirplanes.fitBounds(polyline.getBounds());


    // airportsData();

    // calculate the total distance
    var totalDist = 0
    for (var i = 0; i < latlngsPolyline.length - 1; i++) {
        totalDist = totalDist + distCalc(latlngsPolyline[i + 1], latlngsPolyline[i])
    }
    totalDist = Math.round(totalDist);
    document.getElementById('totalDistance').textContent = `${totalDist.toLocaleString()} (mi).`;

    // Aircraft name or flight name
    document.getElementById('aircraftICAO').textContent = `${data[1].icao24} `;
    document.getElementById('aircraftCallsign').textContent = `${data[1].callsign} `;


};

// Add layer to the map
function createLayer(layer) {
    // Remove previous layers
    remLayers();

    // Add baselayer and layerGroup
    baseLayer.addTo(mapAirplanes);
    layer.addTo(mapAirplanes);

}

// Remove all layers to the map
function remLayers() {
    mapAirplanes.eachLayer(function (layer) {
        // console.log(layer);
        mapAirplanes.removeLayer(layer);
    });
};


// Handler for the dropdown change for ICAO24
d3.select('#selectICAO24').on('change', updatePageICAO);

// Handler for the dropdown change for Callsign
d3.select('#selectCallsign').on('change', updatePageCallsign);


loadDropdown();

var mapAirplanes = L.map('mapAircraft', {
    scrollWheelZoom: false //Disable scroll wheel zoom on Leaflet
}).setView([1, -0.09], 2);
var baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});

// var baseLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
//     attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
// });





function airportsData() {
    airports_api_url = "/api/v1.0/airports-data"
    d3.json(airports_api_url).then((importedData) => {
        airportLayerG(importedData)
    })
}

function airportLayerG(data) {
    // add marker for the airports
    airportArray = [];
    data.forEach(function (element) {
        if (element.Country) {
            circles = L.circle([element.Latitude, element.Longitude], {
                fillOpacity: 0.75,
                color: "green",
                fillColor: "black",
                // Adjust radius
                radius: 100
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


    // create a layerGroup for each aircraft markers.
    // Now we can handle them as one group instead of referencing each individually.
    var airportLayer = L.layerGroup(airportArray);

    airportLayer.addTo(mapAirplanes);
}

// Return date formated to local string
function formatDate(myDate) {
    /* Date.prototype.toLocaleDateString()
     https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString */
    var timeOptions = { year: 'numeric', month: 'numeric', day: 'numeric' };
    // timeOptions.timeZone = 'UTC';
    // Retrieve the newest meas time and convert the format
    var newestData = new Date(myDate * 1000);
    var newestDataTime = newestData.toLocaleTimeString("en-US", timeOptions);
    return newestDataTime
}

getDataICAO('ace6e2');
// getDataCallsign('DAL952')