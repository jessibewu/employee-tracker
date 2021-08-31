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
                  
                  // Update:
                  if (choices === 'Update Employee Role') {
                     updateEmployeeRole();
                  }
        
                  if (choices === 'Update Employee Manager') {
                     updateEmployeeManager();
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

    db.query(sql, (error, response) => {
        if (error) throw error;
        console.table(response);
        promptUser();
    }); //.catch((error))
};

// View all Roles
const viewAllRoles = () => {
    const sql = `SELECT * FROM roles`;

    db.query(sql, (error, response) => {
        if (error) throw error;
        console.table(response);
        promptUser();
    });
};

// View All Departments
const viewAllDepartments = () => {
   const sql = `SELECT * FROM department`;

   db.query(sql, (error, response) => {
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

   db.query(sql, (error, response) => {
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

   db.query(sql, (error, response) => {
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
               JOIN department ON roles.department_id = department.id 
               GROUP BY roles.department_id`;

   db.query(sql, (error, response) => {
       if (error) throw error;
       console.table(response);
       promptUser();
   });
};

// Add Employee
const addEmployee = () => {
   // Add New Employee - first & last name:
   inquirer.prompt([
      {
        type: 'input',
        name: 'fistName',
        message: "What is the employee's first name? (Required)",
        validate: function validateName(input) {
         return input !== '';
         }
      },
      {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name? (Required)",
        validate: function validateName(input) {
         return input !== '';
         }
      }
    ])
      .then(answer => {
      const newEmployee = [answer.fistName, answer.lastName]

      // Then select Roles:
      const roleSql = `SELECT roles.id, roles.title FROM roles`;

      db.query(roleSql, (error, data) => {
        if (error) throw error; 
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
        inquirer.prompt([
              {
                type: 'list',
                name: 'role',
                message: "What is the employee's role?",
                choices: roles
              }
            ])
              .then(roleChoice => {
                const role = roleChoice.role;
                newEmployee.push(role);

      // Then select Managers:
      const managerSql =  `SELECT * FROM employee`;

         db.query(managerSql, (error, data) => {
            if (error) throw error;
            const managers = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
            inquirer.prompt([
               {
                  type: 'list',
                  name: 'manager',
                  message: "Who is the employee's manager?",
                  choices: managers
               }
            ])
            .then(managerChoice => {
               const manager = managerChoice.manager;
               newEmployee.push(manager);
               
               // Insert newEmployee to table:
               const sql =   `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                           VALUES (?, ?, ?, ?)`;

               db.query(sql, newEmployee, (error) => {
                  if (error) throw error;
                  console.log("Employee has been added!")
                  viewAllEmployees();
                });
              });
            });
          });
       });
    });
  };


// Update Employee Role
// const updateEmployeeRole = () => {
//    const sql = `SELECT employee.id, 
//                employee.first_name, 
//                employee.last_name, 
//                roles.id AS "role_id"
//                FROM employee, roles, department 
//                WHERE department.id = roles.department_id 
//                AND roles.id = employee.role_id`;

//    db.query(sql, (error, response) => {
//       if (error) throw error;
//       console.table(response);
//       promptUser();
//    });
// };











// Start server after DB connection
db.connect((error) => {
   if (error) throw error;
    console.log('Database connected.');
    promptUser();
});