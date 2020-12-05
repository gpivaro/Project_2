DROP TABLE IF exists `project_2`.`aircraft_data`;

CREATE TABLE `project_2`.`aircraft_data` (
    id INT NOT NULL AUTO_INCREMENT,
    icao24 VARCHAR(20),
    callsign VARCHAR(20),
    origin_country VARCHAR(50),
    time_position INT,
    last_contact INT,
    longitude FLOAT,
    latitude FLOAT,
    baro_altitude FLOAT,
    on_ground BOOLEAN,
    velocity FLOAT,
    true_track FLOAT,
    vertical_rate FLOAT,
    sensors VARCHAR(20),
    geo_altitude FLOAT,
    squawk VARCHAR(20),
    spi BOOLEAN,
    position_source INT,
    PRIMARY KEY (id)
);