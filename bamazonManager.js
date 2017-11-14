var mysql = require("mysql");
var inquirerUserPrompt = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) {
    throw err;
  };
  console.log("");
});

function showAll() {
  connection.query("SELECT * FROM products, department where products.department_id = department.department_id", function(err, res) {
    if (err) {
      throw err;
    };
    console.log("\n\nItem_id | Product_name | Department_name | Price | Stock_quantity");
    console.log("-----------------------------------------------------------------");
    for (var i = 0; i < res.length; i++) {
      // console.log(res[i].item_id + "       " + res[i].product_name + "                         " + res[i].department_name + " " + res[i].price + " " + res[i].stock_quantity);
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);

    }
    // console.log(res);
    main();
    // connection.end();
  });
};

function showLow() {
  connection.query("SELECT * FROM products, department where products.department_id = department.department_id and products.stock_quantity<5", function(err, res) {
    if (err) {
      throw err;
    };
    console.log("\n\nItem_id | Product_name | Department_name | Price | Stock_quantity");
    console.log("-----------------------------------------------------------------");
    for (var i = 0; i < res.length; i++) {
      // console.log(res[i].item_id + "       " + res[i].product_name + "                         " + res[i].department_name + " " + res[i].price + " " + res[i].stock_quantity);
      console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);

    }
    // console.log(res);
    main();
    // connection.end();
  });
};

function insertProduct() {
  var choiceArray = [];
  connection.query("SELECT department_name, department_id FROM department", function(err, res) {
  if (err) {
    throw err;
  };
    for (var i = 0; i < res.length; i++) {
    choiceArray.push(res[i].department_id+"-"+res[i].department_name);
    };
  });
  inquirerUserPrompt
  .prompt ([
    {
      name: "product_name",
      type: "input",
      message: "What is the name of the product you would like to add?"
    },
    {
      name: "department",
      type: "list",
      choices: function() {
        return choiceArray;
      },
      message: "Which department does this fall into?"
    },
    {
      name: "price",
      type: "input",
      message: "How much does it cost?"
    },
    {
      name: "product_quantity",
      type: "input",
      message: "How many do we have?"
    }
  ])
  .then(function(answer) {
    var departmentID = answer.department.split("-");
    connection.query("INSERT INTO products SET ?", 
      {
        product_name: answer.product_name,
        department_id: departmentID[0],
        price: answer.price,
        stock_quantity: answer.product_quantity
      }, function(err, res) {
    if (err) {
      throw err;
    };
      console.log(answer.product_name+" Added to Bamazon!");
      main();
    });
  });
};

function addInventory() {
    var choiceArray = [];
    var newPrdQtd = 0;
    var productID = [];
    connection.query("SELECT item_id, product_name, stock_quantity FROM products", function(err, res) {
    if (err) {
      throw err;
    };
      for (var i = 0; i < res.length; i++) {
      choiceArray.push(res[i].item_id+"-"+res[i].product_name);
      };
    });
    inquirerUserPrompt
    .prompt ([
      {
        name: "product",
        type: "list",
        choices: function() {
          return choiceArray;
        },
        message: "Which product you want to add Inventory?"
      },
      {
        name: "product_quantity",
        type: "input",
        message: "How many?"
      }
    ])
    .then(function(answer) {
      productID = answer.product.split("-");
      connection.query("SELECT stock_quantity FROM products WHERE ?", 
          {
            item_id: productID[0]
          }
        , function(err,res) {
      if (err) {
        throw err;
      };
        console.log(res);
        newPrdQtd = parseInt(answer.product_quantity) + res[0].stock_quantity;
        console.log("on select " + newPrdQtd);
          connection.query("UPDATE products SET ? WHERE ?", 
            [
              {
                stock_quantity: newPrdQtd
              },
              {
                item_id: productID[0]
              }
            ], function(err) {
          if (err) {
            throw err;
          };
            console.log("on update " + newPrdQtd);
            console.log(productID[1]+" Updated on Bamazon!");
            main();
          });
        });
      });
  };

function main() {
  inquirerUserPrompt
  .prompt ([
  {
    name: "action",
    type: "list",
    message: "What would you like to do?",
    choices: ["View Products for Sale", "View low Inventory", "Add to Inventory", "Add New Product", "Quit"]
  }
  ])
  .then(function(answer) {
    console.log(answer.action);
    switch(answer.action) {

      case "View Products for Sale":
      showAll();
      break;

      case "View low Inventory":
      showLow();
      break;

      case "Add to Inventory":
      addInventory();
      break;

      case "Add New Product":
      insertProduct()
      break;

      case "Quit":
      default:
      connection.end();
      console.log("Bye!");
      process.exit(1);
    }
  })
};

main();
