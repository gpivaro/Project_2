-- Count the total data per day  
SELECT 
    COUNT(*) AS totalDataPoints,
    FROM_UNIXTIME(time, '%Y-%m-%d') AS timeData
FROM
    project_2.aircraft_data
GROUP BY FROM_UNIXTIME(time, '%Y-%m-%d');
-- 

-- Query the last 7 days
SELECT 
    count(*)
FROM
    project_2.aircraft_data
WHERE
    FROM_UNIXTIME(time, '%Y-%m-%d') > NOW() - INTERVAL 7 DAY;
    


SELECT 
    count(*)
FROM
    project_2.aircraft_data
WHERE
    FROM_UNIXTIME(time, '%Y-%m-%d') < NOW() - INTERVAL 7 DAY;


-- DELETE FROM project_2.aircraft_data 
-- WHERE
--     FROM_UNIXTIME(time, '%Y-%m-%d') < NOW() - INTERVAL 7 DAY;
