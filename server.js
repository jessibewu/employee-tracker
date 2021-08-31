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
                  // View:
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
                  // Update:
                  if (choices === 'Update Employee Role') {
                     updateEmployeeRole();
                }
        
                  if (choices === 'Update Employee Manager') {
                     updateEmployeeManager();
                }
                  // Add:
                  if (choices === 'Add Employee') {
                     addEmployee();
                  }

                  if (choices === 'Add Role') {
                     addRole();
                }

                  if (choices === 'Add Department') {
                     addDepartment();
                }
                  // Remove: 
                  if (choices === 'Remove Employee') {
                     removeEmployee();
                  }
          
                  if (choices === 'Remove Role') {
                     removeRole();
                  }
                    
                  if (choices === 'Remove Department') {
                     removeDepartment();
                  }
                  // Exit:
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
                roles.salary, 
                department.dept_name AS department, 
                e2.first_name AS manager FROM employee 
                LEFT JOIN employee as e2 ON e2.id = employee.manager_id 
                JOIN roles ON employee.role_id = roles.id 
                JOIN department ON roles.department_id = department.id 
                ORDER BY employee.id`;

    db.promise().query(sql, (error, response) => {
        if (error) throw error;
        console.table(response);
        promptUser();
    });
};

// View all Roles
const viewAllRoles = () => {
    const sql = `SELECT * FROM role`;

    db.promise().query(sql, (error, response) => {
        if (error) throw error;
        console.table(response);
        promptUser();
    });
};

// View All Departments
const viewAllDepartments = () => {
   const sql = `SELECT * FROM department`;

   db.promise().query(sql, (error, response) => {
       if (error) throw error;
       console.table(response);
       promptUser();
   });
};

// View All Employees By Department
const viewEmployeesByDepartment = () => {
   const sql = `SELECT employee.first_name, 
               employee.last_name, 
               department.dept_name AS department
               FROM employee 
               LEFT JOIN roles ON employee.role_id = roles.id 
               LEFT JOIN department ON roles.department_id = department.id`;

   db.promise().query(sql, (error, response) => {
       if (error) throw error;
       console.table(response);
       promptUser();
   });
};

// View All Employees By Manager
const viewEmployeesByManager = () => {
   const sql = `SELECT employee.first_name, 
               employee.last_name, 
               roles.title,
               e2.first_name AS manager
               FROM employee 
               LEFT JOIN employee AS e2 ON e2.id = employee.manager_id 
               JOIN roles ON employee.role_id = roles.id 
               JOIN department ON roles.department_id = department.id 
               ORDER BY manager ASC`;

   db.promise().query(sql, (error, response) => {
       if (error) throw error;
       console.table(response);
       promptUser();
   });
};

// View Department Budgets
const viewDepartmentBudget = () => {
   const sql = `SELECT department_id AS id, 
               department.dept_name AS department,
               SUM(salary) AS budget
               FROM roles
               JOIN department ON roles.department_id = department.id GROUP BY roles.department_id`;

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