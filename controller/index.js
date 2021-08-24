// DEPENDENCIES ==================
const Inquirer = require("inquirer");
const { addRole, viewRoles, removeRole } = require("./roles");
const {
	addEmployee,
	viewEmployees,
	removeEmployee,
	updateEmployeeRole,
} = require("./employees");
const {
	addDepartment,
	viewDepartments,
	removeDepartment,
} = require("./departments");

// FUNCTIONS ==================

const askQuestions = async (questionsArray) => {
	return await Inquirer.prompt(questionsArray);
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
			init();
			break;
	}
};

const init = async () => {
	const usersAnswer = await askQuestions(initQuestions());
	allowedActions(usersAnswer);
};

// EXPORTS ==================
module.exports = { init };
