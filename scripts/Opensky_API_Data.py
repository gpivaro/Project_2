import requests
import time
from datetime import datetime
from MySQL_Connect import add_to_database


""" Query the live aircraft data from Opensky API  
and add record to the MySQL database """



# Intervar to query the API
x = 60*5
# loop over to retrieve data every x seconds
n = 0

# while True:

try:
    # Save config information.
    url = "https://opensky-network.org/api/states/all"

    # Build partial query URL
    query_url = f"{url}"

    #  Perform a request for data
    response = requests.get(query_url).json()


    # Test for null and strip spaces in case not null
    for i in range(len(response["states"])):
        aircraft_live_data = list(range(0,17))
        if response["states"][i][0]:
            aircraft_live_data[0] = response["states"][i][0].strip()
        else:
            aircraft_live_data[0] = response["states"][i][0]
        if response["states"][i][1]:
            aircraft_live_data[1] = response["states"][i][1].strip()
        else:
            aircraft_live_data[1] =  response["states"][i][1]
        if response["states"][i][2]:
            aircraft_live_data[2] =  response["states"][i][2].strip()
        else:
            aircraft_live_data[2] =  response["states"][i][2]
        aircraft_live_data[3] =  response["states"][i][3]
        aircraft_live_data[4] =  response["states"][i][4]
        aircraft_live_data[5] =  response["states"][i][5]
        aircraft_live_data[6] =  response["states"][i][6]
        aircraft_live_data[7] =  response["states"][i][7]
        aircraft_live_data[8] =  response["states"][i][8]
        aircraft_live_data[9] =  response["states"][i][9]
        aircraft_live_data[10] =  response["states"][i][10]
        aircraft_live_data[11] =  response["states"][i][11]
        aircraft_live_data[12] =  response["states"][i][12]
        aircraft_live_data[13] =  response["states"][i][13]
        if response["states"][i][14]:
            aircraft_live_data[14] =  response["states"][i][14].strip()
        else:
            aircraft_live_data[14] =  response["states"][i][14]
        aircraft_live_data[15] =  response["states"][i][15]
        aircraft_live_data[16]  = response["states"][i][16]

        record1 = (aircraft_live_data[0], 
                    aircraft_live_data[1],
                    aircraft_live_data[2],
                    aircraft_live_data[3],
                    aircraft_live_data[4],
                    aircraft_live_data[5],
                    aircraft_live_data[6],
                    aircraft_live_data[7],
                    aircraft_live_data[8],
                    aircraft_live_data[9],
                    aircraft_live_data[10],
                    aircraft_live_data[11],
                    aircraft_live_data[12],
                    aircraft_live_data[13],
                    aircraft_live_data[14],
                    aircraft_live_data[15],
                    aircraft_live_data[16]
                    )

        add_to_database(record1)

    n += 1
    print("---------------------")
    dt_object = datetime.fromtimestamp(response["time"])
    print(f"{n} | At: {dt_object} | Total data points retrieved: {len(response['states'])}")
    # time.sleep(x)

except:
    print("Failed to retrieve data")
