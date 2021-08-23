DROP DATABASE IF EXISTS employee_tracker_db;

CREATE DATABASE employee_tracker_db;

USE employee_tracker_db;

CREATE TABLE employee(
    id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    firstname VARCHAR(25) NOT NULL,
    lastname VARCHAR(25) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER
);

CREATE TABLE role (
    id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER
);

CREATE TABLE department (
    id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);

SELECT * FROM employee;
SELECT * FROM role;
SELECT * FROM department;