-- prepares a MySQL server for the project

CREATE DATABASE IF NOT EXISTS barber_dev_db;
CREATE USER IF NOT EXISTS 'barber_dev'@'localhost' IDENTIFIED BY 'barber_dev_pwd';
GRANT ALL PRIVILEGES ON `barber_dev_db`.* TO 'barber_dev'@'localhost';
GRANT SELECT ON `performance_schema`.* TO 'barber_dev'@'localhost';
FLUSH PRIVILEGES;



