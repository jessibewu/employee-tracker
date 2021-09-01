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
                  console.log("New employee has been added!")
                  viewAllEmployees();
                });
              });
            });
          });
       });
    });
  };

// Add new Role
const addRole = () => {
   const sql = 'SELECT * FROM department';
   
   db.query(sql, (error, response) => {
       if (error) throw error;
       let deptNamesArray = [];
       response.forEach((department) => {deptNamesArray.push(department.dept_name);});
       deptNamesArray.push('Create Department');
       
       inquirer.prompt([
           {
             name: 'departmentName',
             type: 'list',
             message: 'Which department is this new role in?',
             choices: deptNamesArray
           }
         ])
         .then((answer) => {
           if (answer.departmentName === 'Create Department') {
             addDepartment();
           } else {
             addRoleResume(answer);
           }
         });
 
       const addRoleResume = (departmentData) => {
         inquirer.prompt([
             {
               name: 'newRole',
               type: 'input',
               message: 'What is the name of this new role?',
               validate: function validateInput(input) {
                  return input !== '';
                  }
             },
             {
               name: 'salary',
               type: 'input',
               message: 'What is the salary of this new role?',
               validate: function validateInput(input) {
                  return input !== '';
                  }
             }
           ])
           .then((answer) => {
             let createdRole = answer.newRole;
             let departmentId;
 
             response.forEach((department) => {
               if (departmentData.departmentName === department.dept_name) {departmentId = department.id;}
             });
 
             let sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
             let criteria = [createdRole, answer.salary, departmentId];
 
             db.query(sql, criteria, (error) => {
               if (error) throw error;
               console.log("New role has been added!");
               viewAllRoles();
             });
           });
       };
     });
   };

// Add new Department
const addDepartment = () => {
   inquirer.prompt([
       {
         name: 'newDepartment',
         type: 'input',
         message: 'What is the name of your new Department?',
         validate: function validateInput(input) {
            return input !== '';
            }
       }
     ])
     .then((answer) => {
       let sql = `INSERT INTO department (dept_name) VALUES (?)`;

       db.query(sql, answer.newDepartment, (error, response) => {
         if (error) throw error;
         console.log("New department has been added!");
         viewAllDepartments();
       });
     });
};

// Remove an Employee
const removeEmployee = () => {
   let sql = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;

   db.query(sql, (error, response) => {
     if (error) throw error;
     let employeeNamesArray = [];
     response.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);});

     inquirer.prompt([
         {
           name: 'chosenEmployee',
           type: 'list',
           message: 'Which employee would you like to remove?',
           choices: employeeNamesArray
         }
       ])
       .then((answer) => {
         let employeeId;

         response.forEach((employee) => {
           if (
             answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`
           ) {
             employeeId = employee.id;
           }
         });

         let sql = `DELETE FROM employee WHERE employee.id = ?`;

         db.query(sql, [employeeId], (error) => {
           if (error) throw error;
           console.log("This employee has been removed!");
           viewAllEmployees();
         });
       });
   });
 };

// Remove a Role
const removeRole = () => {
   let sql = `SELECT roles.id, roles.title FROM roles`;

   db.query(sql, (error, response) => {
     if (error) throw error;
     let roleNamesArray = [];
     response.forEach((roles) => {roleNamesArray.push(roles.title);});

     inquirer.prompt([
         {
           name: 'chosenRole',
           type: 'list',
           message: 'Which role would you like to remove?',
           choices: roleNamesArray
         }
       ])
       .then((answer) => {
         let roleId;

         response.forEach((roles) => {
           if (answer.chosenRole === roles.title) {
             roleId = roles.id;
           }
         });

         let sql = `DELETE FROM roles WHERE roles.id = ?`;
         
         db.query(sql, [roleId], (error) => {
           if (error) throw error;
           console.log("This role has been removed!");
           viewAllRoles();
         });
       });
   });
 };

// Remove a Department
const removeDepartment = () => {
   let sql = `SELECT department.id, department.dept_name FROM department`;

   db.query(sql, (error, response) => {
     if (error) throw error;
     let departmentNamesArray = [];
     response.forEach((department) => {departmentNamesArray.push(department.dept_name);});

     inquirer.prompt([
         {
           name: 'chosenDept',
           type: 'list',
           message: 'Which department would you like to remove?',
           choices: departmentNamesArray
         }
       ])
       .then((answer) => {
         let departmentId;

         response.forEach((department) => {
           if (answer.chosenDept === department.dept_name) {
             departmentId = department.id;
           }
         });

         let sql = `DELETE FROM department WHERE department.id = ?`;

         db.query(sql, [departmentId], (error) => {
           if (error) throw error;
           console.log("This department has been removed!");
           viewAllDepartments();
         });
       });
   });
};

// Update Employee's Role
const updateEmployeeRole = () => {
   let sql = `SELECT * FROM employee`;
 
   db.query(sql, (err, data) => {
      if (err) throw err; 
      const employees = data.map(({ id, first_name, last_name }) => ({ name: first_name + " " + last_name, value: id }));
 
      inquirer.prompt([
       {
         type: 'list',
         name: 'name',
         message: "Which employee would you like to update?",
         choices: employees
       }
     ])
       .then(empChoice => {
         const employee = empChoice.name;
         const params = []; 
         params.push(employee);
 
         let sql = `SELECT * FROM roles`;
 
         db.query(sql, (err, data) => {
           if (err) throw err; 
           const roles = data.map(({ id, title }) => ({ name: title, value: id }));
           
             inquirer.prompt([
               {
                 type: 'list',
                 name: 'role',
                 message: "What is the employee's new role?",
                 choices: roles
               }
             ])
                 .then(roleChoice => {
                 const role = roleChoice.role;
                 params.push(role); 
                 
                 let employee = params[0]
                 params[0] = role
                 params[1] = employee 
                  
                 let sql = `UPDATE employee SET role_id = ? WHERE id = ?`;
 
                 db.query(sql, params, (err, result) => {
                  if (err) throw err;
                  console.log("This employee's role has been updated!");
                  viewAllEmployees();
           });
         });
       });
     });
   });
 };

// Update Employee's Manager
const updateEmployeeManager = () => {
   let sql = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
             FROM employee`;

    db.query(sql, (error, response) => {
     let employeeNamesArray = [];
     response.forEach((employee) => {employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`)});

     inquirer.prompt([
         {
           name: 'chosenEmployee',
           type: 'list',
           message: 'Which employee has a new manager?',
           choices: employeeNamesArray
         },
         {
           name: 'newManager',
           type: 'list',
           message: 'Who is their manager?',
           choices: employeeNamesArray
         }
       ])
       .then((answer) => {
         let employeeId, managerId;
         response.forEach((employee) => {
           if (
             answer.chosenEmployee === `${employee.first_name} ${employee.last_name}`
           ) {
             employeeId = employee.id;
           }

           if (
             answer.newManager === `${employee.first_name} ${employee.last_name}`
           ) {
             managerId = employee.id;
           }
         });

         if (answer.chosenEmployee === answer.newManager) {
            console.log("Invalid Selection!");
            promptUser();
         } else {
           let sql = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;

           db.query(sql, [managerId, employeeId], (error) => {
               if (error) throw error;
               console.log(`This employee's manager has been updated!`);
               viewAllEmployees();
             }
           );
         }
       });
   });
};

// Start server after DB connection
db.connect((error) => {
   if (error) throw error;
    console.log('Database connected.');
    promptUser();
});