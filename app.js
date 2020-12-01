url="https://opensky-network.org/api/states/all";
// Use d3 to import the data

  
// Create a map object
var myMap = L.map("map", {
    center: [37.09, -102.71],
    zoom: 4.5
});

// // Adding tile layer
// L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//     maxZoom: 18,
//     id: "streets-v11",
//     accessToken: API_KEY
// }).addTo(myMap);



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
    for (var i = 0; i< flightData.states.length; i++){
if (flightData.states[i][5]){
		// console.log(flightData.states[i][6]);
   		liveData.push({"name": flightData.states[i][1], "lat": flightData.states[i][5], "lon": flightData.states[i][6]});
    	}
    }
console.log(liveData);






});