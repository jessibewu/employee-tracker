const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");
const view = require("./utils/view");
const add = require("./utils/add");
const remove = require("./utils/remove");
const update = require("./utils/update");

// Prompt for user choices
const promptUser = () => {
    inquirer.prompt([
                {
                    type: "list",
                    name: "choices",
                    message: "What would you like to do?",
                    choices: [
                        'View All Employees',
                        'View All Roles',
                        'View All Departments',
                        'View All Employees By Department',
                        "View All Employees By Manager",
                        'View Department Budgets',
                        'Add Employee',
                        'Add Role',
                        'Add Department',
                        'Remove Employee',
                        'Remove Role',
                        'Remove Department',
                        'Update Employee Role',
                        'Update Employee Manager',
                        'Exit'
                   ]
                }
            ])
            .then((answers) => {
                const {choices} = answers;
                  // View:
                  if (choices === 'View All Employees') {
                      view.viewAllEmployees();
                  }

                  if (choices === 'View All Roles') {
                    view.viewAllRoles();
                  }
          
                  if (choices === 'View All Departments') {
                    view.viewAllDepartments();
                  }
          
                  if (choices === 'View All Employees By Department') {
                    view.viewEmployeesByDepartment();
                  }

                  if (choices === 'View All Employees By Manager') {
                    view.viewEmployeesByManager();
                  }

                  if (choices === 'View Department Budgets') {
                    view.viewDepartmentBudget();
                  }

                  // Add:
                  if (choices === 'Add Employee') {
                    add.addEmployee();
                  }

                  if (choices === 'Add Role') {
                    add.addRole();
                  }

                  if (choices === 'Add Department') {
                    add.addDepartment();
                  }
                  // Remove: 
                  if (choices === 'Remove Employee') {
                     remove.removeEmployee();
                  }
          
                  if (choices === 'Remove Role') {
                    remove.removeRole();
                  }
                    
                  if (choices === 'Remove Department') {
                    remove.removeDepartment();
                  }
                  
                  // Update:
                  if (choices === 'Update Employee Role') {
                     update.updateEmployeeRole();
                  }
        
                  if (choices === 'Update Employee Manager') {
                    update.updateEmployeeManager();
                  }
                  // Exit:
                  if (choices === 'Exit') {
                    db.end();
                  }
            });
          };

// Start server after DB connection
db.connect((error) => {
   if (error) throw error;
    console.log('Database connected.');
    promptUser();
});

exports.promptUser = promptUser;