// DEPENDENCIES =====================
const inquirer = require("inquirer");
const mysql = require("mysql");

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: 3306,
});

connection.connect((err) => {
	if (err) {
		return console.log(`Unable to connect to database due to error: \n ${err}`);
	}
});

const addEmployee = async () => {
	// Ask questions & receive answers
	const answers = await inquirer.prompt([
		{
			message: "What is the employee firstname?",
			type: "input",
			name: "firstname",
		},
		{
			message: "What is the employee lastname?",
			type: "input",
			name: "lastname",
		},
	]);
	connection.query("INSERT INTO employees SET ?", answers, (err, result) => {
		if (err) {
			console.log(`Unable to addEmployee due to error: ${err}`);
		}
		console.log(`Employee added successfully!`);
		connection.end();
	});
};

const viewEmployees = () => {
	connection.query("SELECT * FROM employees", (err, result) => {
		if (err) {
			console.log(`Unable to viewEmployees due to error: ${err}`);
		}
		console.table("\nShowing all employees", result);
		connection.end();
	});
};

const removeEmployee = async () => {
	connection.query("SELECT * FROM employees", async (err, result) => {
		if (err) {
			console.log(`Unable to listEmployees due to error: ${err}`);
		}

		const employeeNames = result.map(
			(employee) => `${employee.id} ${employee.firstname} ${employee.lastname}`
		);

		// Ask questions & receive answers
		const answers = await inquirer.prompt([
			{
				message: "Which employee will you like to remove?",
				type: "list",
				name: "deleteEmployeeId",
				choices: employeeNames,
			},
		]);
		({ deleteEmployeeId } = answers);
		connection.query(
			"DELETE FROM employees WHERE ?",
			{ id: deleteEmployeeId.split(" ")[0] },
			(err, result) => {
				if (err) {
					console.log(`Unable to removeEmployee due to error: ${err}`);
				}
				console.log(`Employee removed successfully!`);
			}
		);

		connection.end();
	});
};

const updateEmployeeRole = () => {};

module.exports = {
	addEmployee,
	viewEmployees,
	removeEmployee,
	updateEmployeeRole,
};
