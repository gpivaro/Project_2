from flask import Flask, jsonify, render_template
from sqlalchemy import create_engine
import pandas as pd
import os
import json

# Import DB user and password
from api_keys import mysql_hostname
from api_keys import mysql_port
from api_keys import mysql_user_project2
from api_keys import mysql_pass_project2

# MySQL specific connection string
database_name = "project_2"
table_airplanes = "aircraft_data"
table_airports = "airport_data"


database_url = f"mysql+mysqlconnector://{mysql_user_project2}:{mysql_pass_project2}@{mysql_hostname}:{mysql_port}/{database_name}"


# Create the engine
engine = create_engine(database_url)


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
    return render_template("index.html")



# Return a json with the query results for the aircrafts table
@app.route("/api/v1.0/aircrafts-data")
def api_aircrafts():

    aircraft_df = pd.read_sql(f"SELECT * FROM {table_airplanes} ORDER BY id DESC LIMIT 15", engine)

    result = aircraft_df.to_json(orient="records")
    parsed = json.loads(result)

    return jsonify(parsed)

# Return a json with the query results for the airports table
@app.route("/api/v1.0/airports-data")
def api_airports():

    airports_df = pd.read_sql(f"SELECT * FROM {table_airports} ORDER BY AirportID DESC LIMIT 15", engine)

    result = airports_df.to_json(orient="records")
    parsed = json.loads(result)

    return jsonify(parsed)


# The server is set to run on the computer IP address on the port 5100
# Go to your http://ipaddress:5100
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5100, debug=True)