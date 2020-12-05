DROP TABLE IF exists `project_2`.`airport_data`;

CREATE TABLE `project_2`.`airport_data` (
    AirportID INT NOT NULL,
    Name VARCHAR(70),
    City VARCHAR(70),
    Country VARCHAR(70),
    IATA VARCHAR(70),
    ICAO VARCHAR(70),
    Latitude FLOAT,
    Longitude FLOAT,
    Altitude FLOAT,
    Timezone VARCHAR(70),
    DST VARCHAR(70),
    Tzdatabasetimezone VARCHAR(70),
    Type VARCHAR(70),
    Source VARCHAR(70),
    PRIMARY KEY (AirportID)
);