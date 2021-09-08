const inquirer = require('inquirer');
const cTable = require('console.table');
const app = require('../server');
const db = require('../db/connection');

const update = {

// Update Employee's Role
updateEmployeeRole() {
    let sql = `SELECT * FROM employee`;
  
    db.promise().query(sql).then(([data]) => {
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
  
          db.promise().query(sql).then(([data]) => {
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
  
                  db.promise().query(sql, params).then(() => {
                    console.log("This employee's role has been updated!");
                    app.promptUser();
                  }).catch((error) => console.log(error));
                });
            });
        });
    });
  },
 
 // Update Employee's Manager
 updateEmployeeManager() {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name, employee.manager_id
              FROM employee`;
 
     db.promise().query(sql).then(([response]) => {
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
             app.promptUser();
          } else {
            let sql = `UPDATE employee SET employee.manager_id = ? WHERE employee.id = ?`;
 
            db.promise().query(sql, [managerId, employeeId]).then(() => {
              console.log(`This employee's manager has been updated!`);
              app.promptUser();
            }).catch((error) => console.log(error));
          }
      });
    });
  }
}

module.exports = update;