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
			addEmployee(); // done
			break;
		case "Add Department":
			addDepartment(); // done
			break;
		case "Add Role":
			addRole(); // done
			break;
		case "View Employees":
			viewEmployees(); // done
			break;
		case "View Departments":
			viewDepartments(); // done
			break;
		case "View Roles":
			viewRoles(); // done
			break;
		case "Update Employee Roles":
			updateEmployeeRole(); // done
			break;
		case "Remove Employee":
			removeEmployee(); // done
			break;
		case "Remove Department":
			removeDepartment(); // done
			break;
		case "Remove Role":
			removeRole(); // done
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
	connection.query("SELECT id, title FROM roles", async (err, result) => {
		if (err) return console.log(`Unable to listRoles due to error: ${err}`);
		const rolesArray = result.map(({ id, title }) => `${id} ${title}`);

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
			{
				message: "What is the employee role?",
				type: "list",
				name: "role_id",
				choices: rolesArray,
			},
		]);
		connection.query(
			"INSERT INTO employees SET ?",
			{ ...answers, role_id: answers.role_id.split(" ")[0] },
			(err) => {
				if (err)
					return console.log(`Unable to addEmployee due to error: ${err}`);
				console.log(`Employee added successfully!`);
				init();
			}
		);
	});
};

// View employees
const viewEmployees = () => {
	// connection.query("SELECT * FROM employees", (err, result) => {
	connection.query(
		`SELECT employees.id, CONCAT(employees.firstname, " ", employees.lastname) AS employee, roles.title AS role, roles.salary, departments.name AS department
		FROM employees
		RIGHT JOIN roles ON employees.role_id = roles.id
		INNER JOIN departments ON roles.id = departments.id ORDER BY employees.id DESC`,
		(err, result) => {
			if (err)
				return console.log(`Unable to viewEmployees due to error: ${err}`);
			console.table("\nShowing all employees", result);
			init();
		}
	);
};

// Remove employee
const removeEmployee = async () => {
	connection.query(
		"SELECT id, firstname, lastname FROM employees",
		async (err, result) => {
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
				(err) => {
					if (err)
						return console.log(`Unable to removeEmployee due to error: ${err}`);
					console.log(`Employee removed successfully!`);
				}
			);
			init();
		}
	);
};

// Update employee
const updateEmployeeRole = () => {
	connection.query(
		"SELECT id, firstname, lastname FROM employees",
		async (err, result) => {
			if (err) console.log(`Unable to listEmployees due to error: ${err}`);

			const employeesArray = result.map(
				({ id, firstname, lastname }) => `${id} ${firstname} ${lastname}`
			);

			connection.query("SELECT id, title FROM roles", async (err, result) => {
				if (err) return console.log(`Unable to listRoles due to error: ${err}`);
				const rolesArray = result.map(({ id, title }) => `${id} ${title}`);

				// Ask questions & receive answers
				const answers = await inquirer.prompt([
					{
						message: "Which employee will you like to update their role?",
						type: "list",
						name: "updateEmployeeId",
						choices: employeesArray,
					},
					{
						message: "Select a new role for employee?",
						type: "list",
						name: "updatedEmployeeRole",
						choices: rolesArray,
					},
				]);
				({ updateEmployeeId, updatedEmployeeRole } = answers);

				connection.query(
					"UPDATE employees SET role_id = ? WHERE id = ?",
					[updatedEmployeeRole.split(" ")[0], updateEmployeeId.split(" ")[0]],
					(err) => {
						if (err)
							return console.log(
								`Unable to updateEmployee due to error: ${err}`
							);
						console.log(`Employee updated successfully!`);
					}
				);

				init();
			});
		}
	);
};

// Add role
const addRole = async () => {
	connection.query("SELECT id, name FROM departments", async (err, result) => {
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

// Remove role
const removeRole = async () => {
	connection.query("SELECT id, title FROM roles", async (err, result) => {
		if (err) console.log(`Unable to listRoles due to error: ${err}`);

		const rolesArray = result.map(({ id, title }) => `${id} ${title}`);

		// Ask questions & receive answers
		const answers = await inquirer.prompt([
			{
				message: "Which role will you like to remove?",
				type: "list",
				name: "deleteRoleId",
				choices: rolesArray,
			},
		]);
		({ deleteRoleId } = answers);
		connection.query(
			"DELETE FROM roles WHERE ?",
			{ id: deleteRoleId.split(" ")[0] },
			(err) => {
				if (err)
					return console.log(`Unable to removeRole due to error: ${err}`);
				console.log(`Role removed successfully!`);
			}
		);
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

// Remove department
const removeDepartment = async () => {
	connection.query("SELECT id, name FROM departments", async (err, result) => {
		if (err) console.log(`Unable to listDepartments due to error: ${err}`);

		const departmentsArray = result.map(({ id, name }) => `${id} ${name}`);

		// Ask questions & receive answers
		const answers = await inquirer.prompt([
			{
				message: "Which department will you like to remove?",
				type: "list",
				name: "deleteDepartmentId",
				choices: departmentsArray,
			},
		]);
		({ deleteDepartmentId } = answers);
		connection.query(
			"DELETE FROM departments WHERE ?",
			{ id: deleteDepartmentId.split(" ")[0] },
			(err) => {
				if (err)
					return console.log(`Unable to removeDepartment due to error: ${err}`);
				console.log(`Department removed successfully!`);
			}
		);
		init();
	});
};

// INITIALIZATION =================
init();
