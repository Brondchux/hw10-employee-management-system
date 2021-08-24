// DEPENDENCIES =================
require("dotenv").config();
require("console.table");
const inquirer = require("inquirer");
const mysql = require("mysql");

// FUNCTIONS ==================
const askQuestions = async (questionsArray) => {
	return await inquirer.prompt(questionsArray);
};

const initQuestions = () => {
	return [
		{
			message: "What will you like to do today?",
			type: "list",
			name: "userChoice",
			choices: [
				"Add Employee",
				"Add Department",
				"Add Role",
				"View Employees",
				"View Departments",
				"View Roles",
				"View Manager Employees",
				"Update Employee Roles",
				"Update Employee Manager",
				"Remove Employee",
				"Remove Department",
				"Remove Role",
			],
		},
	];
};

const allowedActions = ({ userChoice }) => {
	switch (userChoice) {
		case "Add Employee":
			addEmployee();
			break;
		case "Add Department":
			addDepartment();
			break;
		case "Add Role":
			addRole();
			break;
		case "View Employees":
			viewEmployees();
			break;
		case "View Departments":
			viewDepartments();
			break;
		case "View Roles":
			viewRoles();
			break;
		case "Update Employee Roles":
			updateEmployeeRole();
			break;
		case "Remove Employee":
			removeEmployee();
			break;
		case "Remove Department":
			removeDepartment();
			break;
		case "Remove Role":
			removeRole();
			break;
		default:
			console.log(
				"Work in progress, we'll get to that soon. Meanwhile try out other actions :)"
			);
			connection.end();
			break;
	}
};

const init = async () => {
	const usersAnswer = await askQuestions(initQuestions());
	allowedActions(usersAnswer);
};

const connection = mysql.createConnection({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_NAME,
	port: 3306,
});

connection.connect((err) => {
	if (err)
		return console.log(`Unable to connect to database due to error: \n ${err}`);
});

// Add employee
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
		if (err) return console.log(`Unable to addEmployee due to error: ${err}`);
		console.log(`Employee added successfully!`);
		init();
	});
};

// View employees
const viewEmployees = () => {
	connection.query("SELECT * FROM employees", (err, result) => {
		if (err) return console.log(`Unable to viewEmployees due to error: ${err}`);
		console.table("\nShowing all employees", result);
		init();
	});
};

// Remove employee
const removeEmployee = async () => {
	connection.query("SELECT * FROM employees", async (err, result) => {
		if (err) console.log(`Unable to listEmployees due to error: ${err}`);

		const employeeNames = result.map(
			({ id, firstname, lastname }) => `${id} ${firstname} ${lastname}`
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
				if (err)
					return console.log(`Unable to removeEmployee due to error: ${err}`);
				console.log(`Employee removed successfully!`);
			}
		);

		init();
	});
};

// Update employee
const updateEmployeeRole = () => {
	connection.query("SELECT * FROM employees", async (err, result) => {
		if (err) console.log(`Unable to listEmployees due to error: ${err}`);

		const employeeNames = result.map(
			({ id, firstname, lastname }) => `${id} ${firstname} ${lastname}`
		);

		// Ask questions & receive answers
		const answers = await inquirer.prompt([
			{
				message: "Which employee will you like to update their role?",
				type: "list",
				name: "updateEmployeeId",
				choices: employeeNames,
			},
			{
				message: "Select a new role for employee?",
				type: "list",
				name: "updatedEmployeeRole",
				choices: employeeNames,
			},
		]);
		({ updateEmployeeId, updatedEmployeeRole } = answers);
		connection.query(
			"UPDATE employees SET role = ? WHERE id = ?",
			[updatedEmployeeRole, updateEmployeeId.split(" ")[0]],
			(err, result) => {
				if (err)
					return console.log(`Unable to removeEmployee due to error: ${err}`);
				console.log(`Employee updated successfully!`);
			}
		);

		init();
	});
};

// Add role
const addRole = async () => {
	connection.query("SELECT * FROM departments", async (err, result) => {
		if (err)
			return console.log(`Unable to listDepartments due to error: ${err}`);
		const departmentsArray = result.map(({ id, name }) => `${id} ${name}`);

		// Ask questions & receive answers
		const answers = await inquirer.prompt([
			{
				message: "What is the role title?",
				type: "input",
				name: "title",
			},
			{
				message: "What is the role salary?",
				type: "input",
				name: "salary",
			},
			{
				message: "Select a department for this role?",
				type: "list",
				name: "department_id",
				choices: departmentsArray,
			},
		]);
		connection.query(
			"INSERT INTO roles SET ?",
			{ ...answers, department_id: answers.department_id.split(" ")[0] },
			(err) => {
				if (err) return console.log(`Unable to addRole due to error: ${err}`);
				console.log(`Role added successfully!`);
				init();
			}
		);
	});
};

// View roles
const viewRoles = () => {
	connection.query("SELECT * FROM roles", (err, result) => {
		if (err) return console.log(`Unable to viewRoles due to error: ${err}`);
		console.table("\nShowing all roles", result);
		init();
	});
};

// Add department
const addDepartment = async () => {
	// Ask questions & receive answers
	const answers = await inquirer.prompt([
		{
			message: "What is the department name?",
			type: "input",
			name: "name",
		},
	]);
	connection.query("INSERT INTO departments SET ?", answers, (err, result) => {
		if (err) return console.log(`Unable to addDepartment due to error: ${err}`);
		console.log(`Department added successfully!`);
		init();
	});
};

// View departments
const viewDepartments = () => {
	connection.query("SELECT * FROM departments", (err, result) => {
		if (err)
			return console.log(`Unable to viewDepartments due to error: ${err}`);
		console.table("\nShowing all departments", result);
		init();
	});
};

// INITIALIZATION =================
init();
