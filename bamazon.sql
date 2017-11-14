DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

drop table inventory;

CREATE TABLE products (
  item_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(30) NOT NULL,
  product_sales INTEGER(10),
  department_id INTEGER(11) NOT NULL,
  price FLOAT(10,2),
  stock_quantity INTEGER(10),
  PRIMARY KEY (item_id)
);

CREATE TABLE department (
  department_id INTEGER(11) AUTO_INCREMENT NOT NULL,
  department_name VARCHAR(30) NOT NULL,
  over_head_costs FLOAT(10,2) NOT NULL,
  total_sales float(11,2),
  total_profit FLOAT(10,2),
  PRIMARY KEY (department_id)
);

INSERT INTO department (department_name, over_head_costs)
values("Games", 10000);
INSERT INTO department (department_name, over_head_costs)
values("Groceries", 20000);
INSERT INTO department (department_name, over_head_costs)
values("Electronics", 10000);
INSERT INTO department (department_name, over_head_costs)
values("Appliances", 15000);
INSERT INTO department (department_name, over_head_costs)
values("Make-up", 12000);
INSERT INTO department (department_name, over_head_costs)
values("Sports Clothing", 17000);

INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Horizon: Zero Dawn", 6, 59.99, 8);
INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Super Mario Odyssey", 6, 59.99, 8);
INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Call of Duty: World War II", 6, 59.99, 8);
INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("The Witcher 3", 6, 59.99, 8);
INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Banana", 5, 0.99, 800);
INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Apple", 5, 1.99, 800);
INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Orange", 5, 9.99, 800);
INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Vizio 65 TV", 4, 599.99, 8);
INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Onkyo Receiver", 4, 459.99, 8);
INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Truestar HDMI Splitter", 4, 5.99, 80);
INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("GE Microwave", 3, 399.99, 80);
INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("GE Electric Oven", 3, 199.99, 80);
INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("GE Dishwasher", 3, 299.99, 80);
INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Stila Blush", 2, 19.99, 80);
INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Kat Liquid Eyeliner", 2, 29.99, 80);
INSERT INTO products (product_name, department_id, price, stock_quantity)
VALUES ("Beyond Yoga Leggings", 1, 79.99, 80);


select * from department, products
where department.department_id = products.department_id;

-- Updates the row where the column name is peter --
UPDATE inventory
SET product_sales = 1
WHERE product_id = 1;