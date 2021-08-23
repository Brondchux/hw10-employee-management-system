// DEPENDENCIES =================
require("dotenv").config();
const mysql = require("mysql");
const { init } = require("./controller/index");

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
});

// INITIALIZATION =================
connection.connect((err) => {
	if (err) {
		return console.log(`Unable to connect to database due to error: \n ${err}`);
	}
	console.log(
		`\n=================\n MySQL Connection established and threadID is ${connection.threadId} \n=================\n`
	);
	init();
});

connection.end();
