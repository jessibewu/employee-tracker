INSERT INTO department (dept_name)
VALUES
  ("Executive"), 
  ("Finance"), 
  ("Human Resources"), 
  ("Information Technology"), 
  ("Operations"), 
  ("Sales");

INSERT INTO roles (title, salary, department_id)
VALUES
  ("Manager", 80000, 1),
  ("Assistant Manager", 970000, 1),
  ("Accountant", 65000, 2),
  ("HR Coordinator", 65000, 3),
  ("Software Developer", 115000, 4),
  ("Administrator", 40000, 5),
  ("Director", 120000, 6),
  ("Compliance Associate", 50000, 6),
  ("Sales Rep", 60000, 6);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Ron', 'Bank', 1, null),
  ('Sara', 'Wolf', 2, 1),
  ('Pete', 'Gaveston', 3, null),
  ('Charles', 'Le', 4, null),
  ('Kath', 'Smith', 5, null),
  ('Dora', 'Carrington', 6, 1),
  ('Edward', 'Bellamy', 7, null),
  ('Montague', 'Summers', 8, 7),
  ('Octavia', 'Butler', 9, 7),
  ('John', 'Lee', 5, null);

