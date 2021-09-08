const inquirer = require('inquirer');
const cTable = require('console.table');
const app = require('../server');
const db = require('../db/connection');

const remove = {

// Remove an Employee
removeEmployee() {
    let sql = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;
 
    db.promise().query(sql).then(([response]) => {
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
 
          db.promise().query(sql, [employeeId]).then(() => {
            console.log("This employee has been removed!");
            app.promptUser();
          }).catch((error) => console.log(error));
        });
    });
  },
 
 // Remove a Role
 removeRole() {
    let sql = `SELECT roles.id, roles.title FROM roles`;
 
    db.promise().query(sql).then(([response]) => {
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
          
          db.promise().query(sql, [roleId]).then(() => {
            console.log("This role has been removed!");
            app.promptUser();
          });
      });
    });
  },
 
 // Remove a Department
 removeDepartment() {
    let sql = `SELECT department.id, department.dept_name FROM department`;
 
    db.promise().query(sql).then(([response]) => {
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
 
          db.promise().query(sql, [departmentId]).then(() => {
            console.log("This department has been removed!");
            app.promptUser();
          });
      });
    });
  }
}

module.exports = remove;