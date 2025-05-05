--DataBase: ramaisdb
CREATE DATABASE IF NOT EXISTS ramaisdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ramaisdb;

-- Table: extensions
CREATE TABLE IF NOT EXISTS extensions (
    id INT PRIMARY KEY,
    extension_number VARCHAR(255) NOT NULL,
    user VARCHAR(255),
    logged_user BOOLEAN DEFAULT NULL
);

-- Table: range_config
CREATE TABLE IF NOT EXISTS range_config (
    id INT PRIMARY KEY AUTO_INCREMENT,
    start INT NOT NULL,
    end INT NOT NULL
);

-- Table: log_entries
CREATE TABLE IF NOT EXISTS log_entries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user VARCHAR(255),
    action VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
