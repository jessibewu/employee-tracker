const inquirer = require('inquirer');
const cTable = require('console.table');
const app = require('../server');
const db = require('../db/connection');


const view = {

// View All Employees
viewAllEmployees() {
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

    db.promise().query(sql).then(([response]) => {
        console.table(response);
        app.promptUser();
    }).catch((error) => console.log(error));
},

// View all Roles
viewAllRoles() {
    const sql = `SELECT * FROM roles`;

    db.promise().query(sql).then(([response]) => {
        console.table(response);
        app.promptUser();
    }).catch((error) => console.log(error));
},

// View All Departments
viewAllDepartments() {
   const sql = `SELECT * FROM department`;

   db.promise().query(sql).then(([response]) => {
        console.table(response);
        app.promptUser();
    }).catch((error) => console.log(error));
},

// View All Employees By Department
viewEmployeesByDepartment() {
   const sql = `SELECT employee.first_name, 
               employee.last_name, 
               department.dept_name AS department
               FROM employee 
               LEFT JOIN roles ON employee.role_id = roles.id 
               LEFT JOIN department ON roles.department_id = department.id`;

   db.promise().query(sql).then(([response]) => {
        console.table(response);
        app.promptUser();
    }).catch((error) => console.log(error));
},

// View All Employees By Manager
viewEmployeesByManager() {
   const sql = `SELECT employee.first_name, 
               employee.last_name, 
               roles.title,
               e2.first_name AS manager
               FROM employee 
               LEFT JOIN employee AS e2 ON e2.id = employee.manager_id 
               JOIN roles ON employee.role_id = roles.id 
               JOIN department ON roles.department_id = department.id 
               ORDER BY manager ASC`;

   db.promise().query(sql).then(([response]) => {
        console.table(response);
        app.promptUser();
    }).catch((error) => console.log(error));
},

// View Department Budgets
viewDepartmentBudget() {
   const sql = `SELECT department_id AS id, 
               department.dept_name AS department,
               SUM(salary) AS budget
               FROM roles
               JOIN department ON roles.department_id = department.id 
               GROUP BY roles.department_id`;

   db.promise().query(sql).then(([response]) => {
        console.table(response);
        app.promptUser();
    }).catch((error) => console.log(error));
}
}

module.exports = view;