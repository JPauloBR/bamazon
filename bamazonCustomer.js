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

    // connection.end();
  });
};

function main() {
  showAll();
  inquirerUserPrompt
  .prompt ([
    {
      name: "item_id",
      type: "input",
      message: "What is the item_id of the Item that you would like to purchase today? (Quit with Q)",
      validate: function(value) {
        if(value == "q" || value == "Q"){
          connection.end();
          process.exit(1);
        }
        else return true;

      }
    },
    {
      name: "quantity",
      type: "input",
      message: "How many would you like? (Quit with Q)",
      validate: function(value) {
        if(value == "q" || value == "Q") {
          connection.end();
          process.exit(1);
        }
        else return true;

      }
    }
    ])
  .then(function(answers) {
      buyingProduct(answers.item_id, parseInt(answers.quantity));
  });
};

function buyingProduct(item_id, quantity) {
  connection.query("SELECT stock_quantity, product_sales, price FROM products where item_id = ?", [item_id], function(err, res) {
    if (err) {
      throw err;
    };
    if(quantity > res[0].stock_quantity) {
      inquirerUserPrompt
      .prompt ([
      {
        name: "quantity",
        type: "input",
        message: "Insufficient quantity!. Please select a different quantity (Q to Quit or R to Return)",
        validate: function(value) {
          if(value == "q" || value == "Q") {
            connection.end();
            process.exit(1);
          }
          else return true;
        }
      }
        ])
        .then(function(answers) {
          if(answers.quantity == "r" || answers.quantity == "R")
            main();
          else buyingProduct(item_id, parseInt(answers.quantity));
        })
    }
    else {
      // console.log(typeof res[0].stock_quantity);
      // console.log(typeof quantity);
      // console.log(typeof res[0].product_sales);
      var actual_stock_quantity = res[0].stock_quantity - quantity;
      var actual_product_sales = res[0].product_sales + quantity;
      var total_price = res[0].price * quantity;
      connection.query("update products set ? where ?", 
        [
          {
            stock_quantity: actual_stock_quantity,
            product_sales: actual_product_sales
          },
          {
            item_id: item_id
          }
        ]
        , function(err) {
        if (err) {
          throw err;
        };
        console.log("You've bought " + quantity + " units");
        console.log("You total cost is $" + parseFloat(total_price).toFixed(2));
        console.log("-------------------------------------\n");
        main();
      });
    }

    // connection.end();
  });
}

main();