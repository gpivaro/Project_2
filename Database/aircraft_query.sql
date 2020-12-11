SELECT 
    *
FROM
    project_2.aircraft_data
ORDER BY id DESC
LIMIT 15;


-- SELECT 
--     *
-- FROM
--     project_2.aircraft_data
-- WHERE
--     callsign = 'DAL82'
-- ORDER BY id DESC;

-- MySQL Select By Newest Timestamp 
SELECT 
    *
FROM
    project_2.aircraft_data
WHERE
    longitude IS NOT NULL
        AND time = (SELECT 
            MAX(time)
        FROM
            project_2.aircraft_data);
            
SELECT 
    *
FROM
    project_2.aircraft_data
WHERE
    icao24 = 'a8aac8';
    
    
-- SELECT 
--     COUNT(*), dataday = DAY()
-- FROM
--     project_2.aircraft_data
-- GROUP BY dataday;

SELECT 
    FROM_UNIXTIME(time,'%Y-%m-%d %H:%i:%s')
FROM
    project_2.aircraft_data
LIMIT 5000;


-- Count the total data per hour  
SELECT 
    COUNT(*) AS totalDataPoints,
    FROM_UNIXTIME(time, '%Y-%m-%d %H') AS timeData
FROM
    project_2.aircraft_data
GROUP BY FROM_UNIXTIME(time, '%Y-%m-%d %H');



SELECT DISTINCT
    icao24,
    AVG(velocity) AS averageVelocity,
    COUNT(id) AS totalNum
FROM
    project_2.aircraft_data
GROUP BY icao24
ORDER BY averageVelocity DESC
LIMIT 10;
