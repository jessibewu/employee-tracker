INSERT INTO department (dept_name)
VALUES
  ('Product Management'),
  ('Graphics'),
  ('Logistics'),
  ('Purchasing'),
  ('Warehouse');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('Merchandising Assistant', 53000, 1),
  ('Merchandising Associate', 72000, 1),
  ('Merchandising Manager', 80000, 1),
  ('Graphics Designer', 60000, 2),
  ('Senior Graphics Designer', 70000, 5),
  ('Logistics Coordinator', 45000, 3),
  ('Purchaser', 45000, 3),
  ('Shipper', 40000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
  ('Ron', 'Bank', 1, 1),
  ('Sara', 'Wolf', 1, null),
  ('Pete', 'Gaveston', 1, 2),
  ('Charles', 'Le', 2, 2),
  ('Kath', 'Smith', 2, null),
  ('Dora', 'Carrington', 3, 1),
  ('Edward', 'Bellamy', 3, null),
  ('Montague', 'Summers', 4, null),
  ('Octavia', 'Butler', 4, null),
  ('Unica', 'Zurn', 5, null),
  ('John', 'Lee', 5, null);

