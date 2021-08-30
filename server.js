const inquirer = require("inquirer");
const cTable = require("console.table");
const db = require("./db/connection");

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
                        "View All Employees by Manager",
                        'View Department Budgets',
                        'Update Employee Role',
                        'Update Employee Manager',
                        'Add Employee',
                        'Add Role',
                        'Add Department',
                        'Remove Employee',
                        'Remove Role',
                        'Remove Department',
                        'Exit'
                   ]
                }
            ])
            .then((answers) => {
                const {choices} = answers;
          
                  if (choices === 'View All Employees') {
                      viewAllEmployees();
                  }

                  if (choices === 'View All Roles') {
                     viewAllRoles();
                }
          
                  if (choices === 'View All Departments') {
                     viewAllDepartments();
                }
          
                  if (choices === 'View All Employees By Department') {
                     viewEmployeesByDepartment();
                  }

                  if (choices === 'View All Employees By Manager') {
                     viewEmployeesByManager();
                }

                  if (choices === 'View Department Budgets') {
                     viewDepartmentBudget();
                }

                  if (choices === 'Update Employee Role') {
                     updateEmployeeRole();
                }
        
                  if (choices === 'Update Employee Manager') {
                     updateEmployeeManager();
                }
          
                  if (choices === 'Add Employee') {
                     addEmployee();
                  }

                  if (choices === 'Add Role') {
                     addRole();
                }

                  if (choices === 'Add Department') {
                     addDepartment();
                }
          
                  if (choices === 'Remove Employee') {
                     removeEmployee();
                  }
          
                  if (choices === 'Remove Role') {
                     removeRole();
                  }
                    
                  if (choices === 'Remove Department') {
                     removeDepartment();
                  }
          
                  if (choices === 'Exit') {
                     db.end();
                  }
            });
          };

// View All Employees
const viewAllEmployees = () => {
    const sql = `SELECT employee.id, 
                employee.first_name, 
                employee.last_name, 
                roles.title, 
                department.dept_name AS 'department', 
                roles.salary
                FROM employee, roles, department 
                WHERE department.id = roles.department_id 
                AND roles.id = employee.role_id
                ORDER BY employee.id ASC`;

    db.promise().query(sql, (error, response) => {
        if (error) throw error;
        console.table(response);
        promptUser();
    });
};
  
// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
});