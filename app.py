from flask import Flask, jsonify, render_template, url_for
from sqlalchemy import create_engine
import pandas as pd
import os
import json
import geopy.distance
import requests
from flask_sqlalchemy import SQLAlchemy
import psycopg2
from datetime import datetime, timedelta

# Import database user and password
try:
    from api_keys import mysql_hostname
    from api_keys import mysql_port
    from api_keys import mysql_user_project2
    from api_keys import mysql_pass_project2
except:
    pass



#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Database
#################################################

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

# Query database for airport data that will be always the same
airports_df_all = pd.read_sql(
            f"""
            SELECT 
                * 
            FROM 
                {table_airports};
            """,
            engine)


app.config['SQLALCHEMY_DATABASE_URI'] = database_uri
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Create class to manipulate the aircraft table data
class Aircrafts(db.Model):
    __tablename__ = 'aircraft_data'

    id  = db.Column(db.Integer, primary_key=True)
    icao24 = db.Column(db.String(20))
    callsign = db.Column(db.String(20))
    origin_country = db.Column(db.String(50))
    time_position = db.Column(db.Integer)
    last_contact = db.Column(db.Integer)
    longitude = db.Column(db.Float)
    latitude = db.Column(db.Float)
    baro_altitude = db.Column(db.Float)
    on_ground = db.Column(db.Boolean)
    velocity = db.Column(db.Float)
    true_track = db.Column(db.Float)
    vertical_rate = db.Column(db.Float)
    sensors = db.Column(db.String(20))
    geo_altitude = db.Column(db.Float)
    squawk = db.Column(db.String(20))
    spi = db.Column(db.Boolean)
    position_source = db.Column(db.Integer)
    time = db.Column(db.Integer)

    def __repr__(self):
        return '<Listing %r>' % (self.id)


#################################################
# Flask Routes
#################################################
# Use Flask to create your routes.

# Home page.
@app.route("/")
def welcome():
    return render_template("index_Gabriel_v4.html")


# Home page.
@app.route("/sarah")
def home():
    return render_template("index_sarah.html")

# Return the APIs route available
@app.route("/api/v1.0/")
def api_routes():
    return (
        f"<h3>API end points available:</h3>"
        f"/aircrafts-data/<br/>"
        f"/airports-data/enter_country_name<br/>"
        f"/aircrafts-data/icao24/enter_icao24<br/>"
        f"/aircrafts-data/callsign/enter_callsign<br/>"
        f"/aircrafts-data/byhour"
        f"/api/v1.0/aircrafts-delete"
    )

# Return a json with the query results for the aircrafts table
@app.route("/api/v1.0/aircrafts-data/<string:country>")
def api_aircrafts(country):
    
    
    # current_timestamp = db.session.query(Aircrafts.time).order_by(desc(Aircrafts.id)).first()
    # # query_results = db.session.query(Aircrafts.id).filter(Aircrafts.origin_country == f"'{country}'").filter(Aircrafts.time == current_timestamp[0]).all()
    # # query_results = db.session.query(Aircrafts).filter(Aircrafts.origin_country == f"'{country}'").filter(Aircrafts.time == current_timestamp[0]).all()
    # aircraft_df = pd.read_sql(db.session.query(Aircrafts).filter(Aircrafts.origin_country == f"'{country}'").filter(Aircrafts.time == current_timestamp[0]).all(),engine)
    # print(aircraft_df)

    # MySQL query to return all table elements that have not 
    # null latitute and have the newest time stamp
    
    if country != 'ALL':
        aircraft_df = pd.read_sql(
            f"""
            SELECT
                * 
            FROM 
                {table_airplanes}
            WHERE 
                (longitude IS NOT NULL
            AND origin_country = '{country}')
            AND time = (SELECT 
                MAX(time)
            FROM
                project_2.aircraft_data)
            ORDER BY 
                id
            DESC;
            """,
            engine)

    else:
            aircraft_df = pd.read_sql(
            f"""
            SELECT
                * 
            FROM 
                {table_airplanes}
            WHERE 
                longitude IS NOT NULL
            AND time = (SELECT 
                MAX(time)
            FROM
                project_2.aircraft_data)
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
        airports_df = airports_df_all
        
    else:
        airports_df = airports_df_all.loc[airports_df_all['Country']==f"{country}"]
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



# Clear old entries on the aircraft table
@app.route("/api/v1.0/aircrafts-delete")
def aircrafts_delete():

    # Delete records older than 7 days
    current_records = db.session.query(Aircrafts).count()
    print(current_records)
    db.session.query(Aircrafts.id, Aircrafts.time).filter(Aircrafts.time < round(datetime.timestamp(datetime.now() - timedelta(days=7)))).delete()
    db.session.commit()
    new_current_records = db.session.query(Aircrafts).count()
    print(new_current_records)
    print(f"Records deleted: {current_records - new_current_records} | Current records on db: {new_current_records}")

    return f"Records deleted: {current_records - new_current_records} | Current records on db: {new_current_records}"



# The server is set to run on the computer IP address on the port 5100
# Go to your http://ipaddress:5100
if __name__ == "__main__":
    app.run(debug=True)



    