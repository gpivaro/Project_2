SELECT 
    table_schema `project_2.aircraft_data`,
    SUM(data_length + index_length) / 1024 / 1024 'database size in MB',
    SUM(data_free) / 1024 / 1024 'free space in MB'
FROM
    information_schema.TABLES
GROUP BY table_schema; 
