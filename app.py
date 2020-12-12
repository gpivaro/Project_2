from flask import Flask, jsonify, render_template, url_for
from sqlalchemy import create_engine
# from flask_sqlalchemy import SQLAlchemy
import pandas as pd
import os
import json
import geopy.distance
import requests

# # Import database user and password
try:
    from api_keys import mysql_hostname
    from api_keys import mysql_port
    from api_keys import mysql_user_project2
    from api_keys import mysql_pass_project2
except:
    pass



# Database name and database tables
database_name = "project_2"
table_airplanes = "aircraft_data"
table_airports = "airport_data"

# MySQL specific connection string
try:
    database_uri = os.environ['DATABASE_URL']
except KeyError:
    database_uri = f"mysql+mysqlconnector://{mysql_user_project2}:{mysql_pass_project2}@{mysql_hostname}:{mysql_port}/{database_name}"


# Create the engine to connect to the database
engine = create_engine(database_uri)


#################################################
# Flask Setup
#################################################
app = Flask(__name__)


# # SQLite for performance reason
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///site.db'
# db = SQLAlchemy(app)


#################################################
# Flask Routes
#################################################
# Use Flask to create your routes.

# Route

# Home page.
@app.route("/")
def welcome():
    return render_template("index_Gabriel_v3.html")

# Home page.
@app.route("/aircrafts")
def aircraft_analysis():
    return render_template("icao24_View_Gabriel.html")

# Home page.
@app.route("/sarah")
def home():
    return render_template("index_sarah.html")

# Return the APIs route available
@app.route("/api/v1.0/")
def api_routes():
    return (
        f"<h3>API routes available:</h3>"
        f"/aircrafts-data<br/>"
        f"/airports-data<br/>"
        f"/api/v1.0/aircrafts-data/icao24/<icao24><br/>"
        f"/api/v1.0/aircrafts-data/callsign/<callsign><br/>"
        f"/api/v1.0/aircrafts-data/byhour"
    )

# Return a json with the query results for the aircrafts table
@app.route("/api/v1.0/aircrafts-data")
def api_aircrafts():
    # MySQL query to return all table elements that have not 
    # null latitute and have the newest time stamp
    aircraft_df = pd.read_sql(
        f"""
        SELECT
            * 
        FROM 
            {table_airplanes}
        WHERE 
            longitude IS NOT NULL
        AND 
            time = (SELECT MAX(time) 
        FROM 
            {table_airplanes})
        ORDER BY 
            id
        DESC;
        """,
         engine)

    result = aircraft_df.to_json(orient="records")
    parsed = json.loads(result)

    return jsonify(parsed)

# Return a json with the query results for the airports table
@app.route("/api/v1.0/airports-data/<country>")
def api_airports(country):

    if f"{country}" == 'ALL':
        airports_df = pd.read_sql(
            f"""
            SELECT 
                * 
            FROM 
                {table_airports};
            """,
            engine)
    else:
        airports_df = pd.read_sql(
            f"""
            SELECT 
                * 
            FROM 
                {table_airports}
            WHERE
                Country = '{country}' 
            ORDER BY 
                AirportID;
            """,
            engine)

    result = airports_df.to_json(orient="records")
    parsed = json.loads(result)

    return jsonify(parsed)

# Return a json with the query results for the aircrafts table for a specific icao24
@app.route("/api/v1.0/aircrafts-data/icao24/<icao24>")
def api_aircrafts_icao24(icao24):

    aircraft_df = pd.read_sql(
        f"""
        SELECT 
            *
        FROM
            {table_airplanes}
        WHERE
            longitude IS NOT NULL 
        AND
            icao24 = '{str(icao24)}';
        """,
         engine)

    result = aircraft_df.to_json(orient="records")
    parsed = json.loads(result)
    return jsonify(parsed)


# Return a json with the query results for the aircrafts table for a specific callsign
@app.route("/api/v1.0/aircrafts-data/callsign/<callsign>")
def api_aircrafts_callsign(callsign):

    aircraft_df = pd.read_sql(
        f"""
        SELECT 
            *
        FROM
            {table_airplanes}
        WHERE
            longitude IS NOT NULL
        AND
            callsign = '{str(callsign)}';
        """,
         engine)

    result = aircraft_df.to_json(orient="records")
    parsed = json.loads(result)
    return jsonify(parsed)


# Return a json with the query results for the aircrafts table for a specific callsign
@app.route("/api/v1.0/aircrafts-data/byhour")
def api_aircrafts_byhour():

    aircraft_hour = pd.read_sql(
        f"""
        SELECT 
            COUNT(*) AS totalDataPoints,
            FROM_UNIXTIME(time, '%Y-%m-%d %H') AS timeData
        FROM
            {table_airplanes}
        WHERE
            longitude IS NOT NULL
        GROUP BY FROM_UNIXTIME(time, '%Y-%m-%d %H');
        """,
         engine)

    result = aircraft_hour.to_json(orient="records")
    parsed = json.loads(result)
    return jsonify(parsed)



# # Return a json with the query results for the aircraft table
# @app.route("/api/v1.0/aircraft-icao24/<icao24>")
# def api_aircraft_data(icao24):

#     df = pd.read_sql(f"""
#                     SELECT 
#                         *
#                     FROM
#                         {table_airplanes}
#                     WHERE
#                         longitude IS NOT NULL
#                     AND
#                         icao24 = '{icao24}';
#                     """,
#             engine)

#     # Calculate the distance between two coordinates
#     df['distance_traveled'] = ''
#     for index,row in df.iterrows():
#     #     print((row['latitude'],row['longitude']))
#         try:
#             coords_1 = (df['latitude'].iloc[index],df['longitude'].iloc[index])
#             coords_2 = ((df['latitude'].iloc[index+1],df['longitude'].iloc[index+1]))
#             distance_mi = round(geopy.distance.geodesic(coords_1, coords_2).mi*10)/10
#             df['distance_traveled'].iloc[index] = distance_mi
#         except:
#             pass

#     result = df.to_json(orient="records")
#     parsed = json.loads(result)
#     return jsonify(parsed)


# The server is set to run on the computer IP address on the port 5100
# Go to your http://ipaddress:5100
if __name__ == "__main__":
    app.run(debug=True)



    