const inquirer = require('inquirer');
const cTable = require('console.table');
const app = require('../server');
const db = require('../db/connection');

const add = {

// Add Employee
addEmployee() {
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
                   app.promptUser();
                 });
               });
             });
           });
        });
     });
   },

// Add new Role
addRole() {
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
             add.addDepartment();
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
               app.promptUser();
             });
           });
       };
     });
    },
 
 // Add new Department
addDepartment() {
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
          app.promptUser();
        });
      });
 }
}

 module.exports = add;