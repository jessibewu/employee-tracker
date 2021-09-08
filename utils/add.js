const inquirer = require('inquirer');
const cTable = require('console.table');
const app = require('../server');
const db = require('../db/connection');

const add = {

// Add Employee
addEmployee() {
    // Add new employee first/last name:
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
 
       // Then select employee's roles:
       const roleSql = `SELECT roles.id, roles.title FROM roles`;
 
       db.promise().query(roleSql).then(([data]) => {
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
 
       // Then select employee's manager:
       const managerSql = `SELECT * FROM employee`;
 
       db.promise().query(managerSql).then(([data]) => {
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
                
                // Add newEmployee to current data:
                const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                            VALUES (?, ?, ?, ?)`;

                db.promise().query(sql, newEmployee).then(() => {
                  console.log("New employee has been added!")
                  app.promptUser();
                }).catch((error) => console.log(error));

            });
          });
        });
      });
    });
  },
   
// Add new Role
addRole() {
    // Select and push dept names + 'Create Dept' to an array if dept doesn't exist
    const sql = 'SELECT * FROM department';
   
    db.promise().query(sql).then(([response]) => {
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
           // If want to create a new dept
           if (answer.departmentName === 'Create Department') {
             add.addDepartment();
           } 
             // If not, select an existing dept
             else {
             addRoleResume(answer);
           }
         });
       
       // If selected an existing dept: set name/salary for the new role 
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
 
             // Add updated roles title/salary to current data
             let sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
             let criteria = [createdRole, answer.salary, departmentId];
 
             db.promise().query(sql, criteria).then(() => {
              console.log("New role has been added!")
              app.promptUser();
            }).catch((error) => console.log(error));
          });
      };
    });
  },
 
// Add new Department
addDepartment() {
    // Provide new dept name
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
      // Then add new dept to current data
      .then((answer) => {
        let sql = `INSERT INTO department (dept_name) VALUES (?)`;
 
        db.promise().query(sql, answer.newDepartment).then(() => {
          console.log("New department has been added!");
          app.promptUser();
        });
      });
 }
}

 module.exports = add;