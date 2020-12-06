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
