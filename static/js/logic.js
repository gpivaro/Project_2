// Creating our initial map object
// L.map accepts 2 arguments: id of the HTML element to insert the map, and an object containing the initial options for the new map
var myMap = L.map("map", {
  // For Houston uncomment:
  // center: [31.56, -96.47],
  center: [0, 0],
  zoom: 2.1,
  scrollWheelZoom: false //Disable scroll wheel zoom on Leaflet
});

// Adding a tile layer (the background map image) to our map.
// Leaflet doesn't have out-of-the-box tile layers, but it allows us to usetile layer APIs. Here, we're using mapbox.
// We use the addTo method to add objects to our map
// Documentation for tileLayer:https://leafletjs.com/reference-1.6.0.html#tilelayer
// L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//   attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
//   maxZoom: 18,
//   id: "dark-v10",
//   // id: "streets-v11",
//   accessToken: API_KEY
// }).addTo(myMap);



// To use OpenStreetMap instead of MapBox
var attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>contributors';
var titleUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
var tiles = L.tileLayer(titleUrl, { attribution });
tiles.addTo(myMap);



// Leaflet.Terminator https://github.com/joergdietrich/Leaflet.Terminator
L.terminator().addTo(myMap);


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

  // document.getElementById('waitLoading').textContent = "Wait... the map is being loaded!";


  // Create and object with the data organized by key value pair
  var flightData = [];
  for (var i = 0; i < data.states.length; i++) {
    // conditional test to get only fligths with available location and not on the ground
    if (data.states[i][5] && !data.states[i][8]) {
      var time_position = new Date(data.states[i][3] * 1000);
      var last_contact = new Date(data.states[i][4] * 1000);
      // conditional test to label the position source method
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
  };

  // print the object data
  // console.log(flightData.length);

  // Display on the screen the number of cleaned data points 
  document.getElementById('numAircrafts').textContent = flightData.length;

  // add marker to map for each flight
  flightData.forEach(function (element) {
    L.circle([element.latitude, element.longitude], {
      fillOpacity: 0.75,
      color: "red",
      fillColor: "blue",
      // Adjust radius
      radius: 20000
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
  `, { "background": "#2c3e50" }).addTo(myMap);

  })


  // Create an array with the origin countries
  countrytData = [];
  for (var i = 0; i < flightData.length; i++) {
    // conditional test to get only fligths with
    if (countrytData.includes(flightData[i].origin_country)) {
      var n = 1;
    } else {
      countrytData.push(flightData[i].origin_country)
    }
  };
  // console.log(countrytData);


  // Create an object with the aircrafts by origin country
  originCountryAircraft = [];
  for (var i = 0; i < countrytData.length; i++) {
    // conditional test to get only fligths with
    n = 0;
    for (var j = 0; j < flightData.length; j++) {
      if (countrytData[i] === flightData[j].origin_country) {
        n += 1
      }
    }
    originCountryAircraft.push({ "country": countrytData[i], "aircrafts": n });
  };
  // console.log(originCountryAircraft);


  // Sort the samples in descending order of sample values
  originCountryAircraft.sort((a, b) => b.aircrafts - a.aircrafts);
  // Select the top origin country number of aircrafts
  top10originCountryAircraft = originCountryAircraft.slice(0, 10);
  // console.log(top10originCountryAircraft);

  // Reverse the list due to the Plotly requeriments
  top10originCountryAircraft.reverse()

  // Trace1 to display the data
  var trace1 = {
    x: top10originCountryAircraft.map(element => element.aircrafts),
    y: top10originCountryAircraft.map(element => element.country),
    orientation: "h",
    type: "bar"
  };

  // create an array to be plotted
  var chartData = [trace1];


  // Responsive chart
  var config = { responsive: true };

  var layout = {
    title: "Aircraft by Country of Origin",
    xaxis: {
      title: "Number of aircrafts"
    },
    yaxis: {
      automargin: true,
    }
  }

  // Render the plot to the div tag id "plot"
  Plotly.newPlot("barChart", chartData, layout, config);


  var trace2 = {
    x: flightData.map(element => element.baro_altitude * 3.28084),
    type: 'histogram',
  };
  var histData = [trace2];


  var layout = {
    title: "Aircraft Altitude Distribution",
    xaxis: {
      title: "Altitude (ft) "
    },
    yaxis: {
      title: "Frequency",
      automargin: true,
    }
  };

  Plotly.newPlot('baroAltitudeHist', histData, layout, config);


  var posSource = [];
  var ADSB = 0; var ASTERIX = 0; var MLAT = 0;
  for (var i = 0; i < flightData.length; i++) {
    // conditional test to get position source type
    if (flightData[i].position_source === "ADS-B") {
      ADSB += 1;
    }
    else if (flightData[i].position_source === "ASTERIX") {
      ASTERIX += 1;
    }
    else if (flightData[i].position_source === "MLAT") {
      MLAT += 1;
    }
  };
  posSource.push({ "Type": "ADS-B", "Qtd": ADSB }, { "Type": "ASTERIX", "Qtd": ASTERIX }, { "Type": "MLAT", "Qtd": MLAT });
  // console.log(posSource);


  // console.log(Object.entries(posSource));
  // console.log(Object.keys(posSource));

  var data = [{
    values: posSource.map(element => element.Qtd),
    labels: posSource.map(element => element.Type),
    // text: 'CO2',
    textposition: 'inside',
    domain: { column: 1 },
    // name: 'CO2 Emissions',
    hoverinfo: 'label+percent+name',
    hole: .4,
    type: 'pie'
  }];

  var layout = {
    title: 'Aircraft Position Source',
    height: 400,
    width: 600,
    showlegend: true,
    // grid: { rows: 1, columns: 1 }
  };

  Plotly.newPlot('positionSourcePlot', data, layout);



  var trace3 = {
    x: flightData.map(element => element.baro_altitude * 3.28084),
    y: flightData.map(element => element.velocity * 2.23694),
    // text: flightData.map(element => element.callsign),
    text: flightData,
    hovertemplate: 'Callsign: %{text.callsign}<extra></extra>' +
      '<br>Vertical rate: %{text.vertical_rate}',
    mode: 'markers',
    type: 'scatter'
  };


  var data = [trace3];

  var layout = {
    title: "Aircraft Speed vs. Altitude",
    xaxis: {
      title: "Altitude (ft) "
    },
    yaxis: {
      title: "Speed (mph) ",
      automargin: true,
    }
  }

  Plotly.newPlot('scatterVelAltitude', data, layout, config);


});


// Data for the airport locations
airports_url = "https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat"

d3.csv("data/airports.csv").then((importedData) => {
  // console.log(importedData);

  var airportData = importedData;
  // Cast the data value to a number for each piece of data
  airportData.forEach(function (d) {
    d["Airport ID"] = +d["Airport ID"];
    d["Altitude"] = +d["Altitude"];
    d["Latitude"] = +d["Latitude"];
    d["Longitude"] = +d["Longitude"];
  });

  // console.log(airportData);

  airportData.forEach(function (element) {
    if (element.Country === "Brazil") {
      L.circle([element.Latitude, element.Longitude], {
        fillOpacity: 0.75,
        color: "green",
        fillColor: "black",
        // Adjust radius
        radius: 2000
      }).bindPopup(`<h3>Airport ID: ${element["Airport ID"]}</h3><hr>
                  Airport ID: ${element["Airport ID"]}<br/>
                  Name: ${element["Name"]}<br/>
                  City: ${element["City"]}<br/>
                  Country: ${element["Country"]}<br/>
                  DST: ${element["DST"]}<br/>
                  IATA: ${element["IATA"]}<br/>
                  ICAO: ${element["ICAO"]}<br/>
                  Altitude: ${element["Altitude"]}<br/>
                  Latitude: ${element["Latitude"]}<br/>
                  Longitude: ${element["Longitude"]}<br/>
                  Source: ${element["Source"]}<br/>
                  Timezone: ${element["Timezone"]}<br/>
                  Type: ${element["Type"]}<br/>
                  Tz database time zone: ${element["Tz database time zone"]}<br/>`
      ).addTo(myMap);
    }
  });


  // Create an array with the airports by countries
  countryAirPorts = [];
  for (var i = 0; i < airportData.length; i++) {
    // conditional test to get only fligths with
    if (countryAirPorts.includes(airportData[i].Country)) {
      var n = 1;
    } else {
      countryAirPorts.push(airportData[i].Country)
    }
  };

  // console.log(countryAirPorts);

  // Create an object with the aircrafts by origin country
  totalAirportsCountry = [];
  for (var i = 0; i < countryAirPorts.length; i++) {
    // conditional test to get only fligths with
    n = 0;
    for (var j = 0; j < airportData.length; j++) {
      if (countryAirPorts[i] === airportData[j].Country) {
        n += 1
      }
    }
    totalAirportsCountry.push({ "country": countryAirPorts[i], "airports": n });
  };

  function filterCountry(d) {
    return d.country === 'Brazil';
  };

  var currentCountryAirport = totalAirportsCountry.filter(filterCountry);
  console.log(currentCountryAirport[0].airports);
  // Display on the screen the number of cleaned data points 
  document.getElementById('numAirports').textContent = `${currentCountryAirport[0].country}
                                                  ${currentCountryAirport[0].airports}`;


  // Sort the samples in descending order of sample values
  totalAirportsCountry.sort((a, b) => b.airports - a.airports);

  // Select the top origin country number of aircrafts
  top10CountryAirports = totalAirportsCountry.slice(0, 10);


  // Reverse the list due to the Plotly requeriments
  top10CountryAirports.reverse()

  // console.log(top10CountryAirports);

  // Trace1 to display the data
  var trace1 = {
    x: top10CountryAirports.map(element => element.airports),
    y: top10CountryAirports.map(element => element.country),
    orientation: "h",
    type: "bar",
    marker: {
      color: 'rgb(142,124,195)'
    }
  };

  // create an array to be plotted
  var chartData = [trace1];


  // Responsive chart
  var config = { responsive: true };

  var layout = {
    title: "Airports by Country",
    xaxis: {
      title: "Number of airports"
    },
    yaxis: {
      automargin: true,
    }
  }

  // Render the plot to the div tag id "plot"
  Plotly.newPlot("barChartAirports", chartData, layout, config);
});

// https://flightaware.com/live/flight/AFR853/history/20201201/2115Z/SOCA/LFPO/tracklog

