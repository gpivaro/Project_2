from flask import Flask, jsonify, render_template
from sqlalchemy import create_engine
import pandas as pd
import os
import json

# Import database user and password
from api_keys import mysql_hostname
from api_keys import mysql_port
from api_keys import mysql_user_project2
from api_keys import mysql_pass_project2

# mysql_hostname = os.environ['MYSQL_HOSTNAME']
# print(mysql_hostname)
# mysql_port = os.environ['MYSQL_PORT']
# print(mysql_port)
# mysql_user_project2 = os.environ['MYSQL_USERNAME']
# mysql_pass_project2 = os.environ['MYSQL_PASSWORD']



# Database name and database tables
database_name = "project_2"
table_airplanes = "aircraft_data"
table_airports = "airport_data"

# MySQL specific connection string
try:
    database_uri = os.environ['DATABASE_URL']
except KeyError:
    database_uri = f"mysql+mysqlconnector://{mysql_user_project2}:{mysql_pass_project2}@{mysql_hostname}:{mysql_port}/{database_name}"

print(database_uri)

# Create the engine to connect to the database
engine = create_engine(database_uri)


#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################
# Use Flask to create your routes.

# Routes

# /
# Home page.
@app.route("/")
def welcome():
    return render_template("index_Gabriel.html")


# Return the APIs route available
@app.route("/api/v1.0/")
def api_routes():

    return (
        f"<h3>API routes available:</h3>"
        f"/aircrafts-data<br/>"
        f"/airports-data<br/>"
        f"/api/v1.0/aircrafts-data/icao24/<icao24><br/>"
        f"/api/v1.0/aircrafts-data/callsign/<callsign><br/>"
    )

# Return a json with the query results for the aircrafts table
@app.route("/api/v1.0/aircrafts-data")
def api_aircrafts():

    # MySQL query to return all table elements that have not null latitute and have the newest time stamp
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
@app.route("/api/v1.0/airports-data")
def api_airports():

    airports_df = pd.read_sql(
        f"""
        SELECT 
            * 
        FROM 
            {table_airports} 
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
            icao24 = '{str(icao24)}';
        """,
         engine)

    result = aircraft_df.to_json(orient="records")
    parsed = json.loads(result)


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
            callsign = '{str(callsign)}';
        """,
         engine)

    result = aircraft_df.to_json(orient="records")
    parsed = json.loads(result)
    return jsonify(parsed)


# The server is set to run on the computer IP address on the port 5100
# Go to your http://ipaddress:5100
if __name__ == "__main__":
    app.run(debug=True)