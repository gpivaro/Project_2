import requests
import pymongo
import time
from datetime import datetime

# Query the live aircraft data from Opensky API¶

# Intervar to query the API
x = 60
# loop over to retrieve data every x seconds
while True:

    try:
        # Save config information.
        url = "https://opensky-network.org/api/states/all"

        # Build partial query URL
        query_url = f"{url}"

        #  Perform a request for data
        response = requests.get(query_url).json()

        # Map data to the dictorary
        aircraft_live_data = []
        for i in range(len(response["states"])):
            data = {}
            # Test for null and strip spaces in case not null
            if response["states"][i][0]:
                data["icao24"] = response["states"][i][0].strip()
            if response["states"][i][1]:
                data["callsign"] = response["states"][i][1].strip()
            if response["states"][i][2]:
                data["origin_country"] = response["states"][i][2].strip()
            data["time_position"] = response["states"][i][3]
            data["last_contact"] = response["states"][i][4]
            data["longitude"] = response["states"][i][5]
            data["latitude"] = response["states"][i][6]
            data["baro_altitude"] = response["states"][i][7]
            data["on_ground"] = response["states"][i][8]
            data["velocity"] = response["states"][i][9]
            data["true_track"] = response["states"][i][10]
            data["vertical_rate"] = response["states"][i][11]
            data["sensors"] = response["states"][i][12]
            data["geo_altitude"] = response["states"][i][13]
            if response["states"][i][14]:
                data["squawk"] = response["states"][i][14].strip()
            data["spi"] = response["states"][i][15]
            data["position_source"] = response["states"][i][16]
            
            aircraft_live_data.append(data)

        # Save data to MongoDB


        # Use flask_pymongo to set up mongo connection
        conn =  "mongodb://localhost:27017/project_3"
        client =  pymongo.MongoClient(conn)

        # identify the collection and drop any existing data for this demonstration
        db = client.project_3
        # db.live_aircraft_data.drop()

        db.live_aircraft_data.insert_many(aircraft_live_data)

        print("---------------------")
        dt_object = datetime.fromtimestamp(response["time"])
        print(f"At: {dt_object} | Total data points retrieved: {len(response['states'])}")

        time.sleep(x)

    except:
        print("Failed to retrieve data")
        time.sleep(15)
        

