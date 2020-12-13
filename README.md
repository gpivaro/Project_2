# 18 Project 2: Global Air Traffic Live Tracker


## Rice University Data Analytics and Visualization Boot Camp 2020


This repository contains the following scenario:
 

## Live Track Dashboard

This project consists in the creation of a web application dashboard that provide real-time information about the global air traffic. The main view of the dashboard is the following.

![1.png](Resources/Images/1.png)

The project was deployed in two version. A light version using only JavaScript/HTML/CSS that tracks only real time results that can be accesed [here](https://gpivaro.github.io/Project_2/). The full version of this project has a back-end compose of Python and MySQL and it is available [here](https://airtraffic-live.herokuapp.com/).
 
 ---

## Background

### Data Source

The main data source to build our live tracker dashboard is the free API from [The OpenSky Network](https://opensky-network.org/). A short description of the The OpenSky Network is the following.

![OpenSky.png](Resources/OpenSky.png)

The OpenSky Network [live REST API](https://opensky-network.org/api) provides JSON object with geolocation info about the aircrafts using [Automatic Dependent Surveillance–Broadcast (ADS-B)](https://en.wikipedia.org/wiki/Automatic_Dependent_Surveillance%E2%80%93Broadcast). This project queries the The OpenSky Network API every 5 min for the full version of this [dashboard](https://airtraffic-live.herokuapp.com/) and every user access for the [light version](https://airtraffic-live.herokuapp.com/).

Besides the live data described above, this application utilizes airport information based on the data available 


### Dashboard Visualizations

The main functionality of the dashboard is two maps shown at the top of this page. The dashboard is intended to provide means for the user access several different information as described below.

* General information

The dashboard provides the following information. 

![5.png](Resources/Images/5.png)
![6.png](Resources/Images/6.png)
![7.png](Resources/Images/7.png)
![8.png](Resources/Images/8.png)
![9.png](Resources/Images/9.png)

#### Aircrafts and Airports by Country

![2.png](Resources/Images/2.png)

#### Altitude and Speed Relationship

![3.png](Resources/Images/3.png)

#### Position Source And Live Aircraft Distribution

![4.png](Resources/Images/4.png)




### Expansion Opportunites

* https://openflights.org/data.html#airport

* https://www.airport-data.com/

* https://www.airport-data.com/api/doc.php

* http://www.flyingnut.com/adsbmap/grids/aircraft.html

* https://raw.githubusercontent.com/jpatokal/openflights/master/data/airports.dat

* https://public-api.adsbexchange.com/VirtualRadar/AircraftList.json

* https://www.adsbexchange.com/

* https://www.adsbexchange.com/data/#

* https://www.airport-data.com/airport/36TS/

* http://www.virtualradarserver.co.uk/Documentation/Formats/AircraftList.aspx

* http://www.flyingnut.com/adsbmap/adsbObs.php

* http://www.flyingnut.com/adsbmap/

* https://flightaware.com/live/flight/AFR853/history/20201201/2115Z/SOCA/LFPO/tracklog

* https://www.airport-data.com/aircraft/N139CH.html


Convert icao24 to registration number:
http://www.avionictools.com/icao.php
Ex: icao24 -> a8102a  ---->  N61898
Use the registration number (N...) to search for aircraft
https://flightaware.com/resources/registration/N61898




#### Weather API:




---

#### Next Steps:

* Connect a database and query the main API every x seconds to keep track of the aircrafts movement.

* Associate the aircrafts with the airports (to/from).

* Track the airports traffic.

* Insert dropdown menus for user interaction.

* Add layers for aircrafts, airports, weather, etc.

* Add a search field to the user search by aircraft or airport

* Add stats for individual flights and airports



