var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "Summer2018!!",
  database: "bamazon_DB"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  startBuying();
});

function startBuying() {
  var query = "SELECT * FROM products";

  connection.query(query, function (err, res) {
    console.log("-------------------------------------------------------------------------");
    console.log("ID   PRODUCT NAMES                DEPARTMENT NAME  PRICE      TOTAL UNITS")
    console.log("-------------------------------------------------------------------------");

    for (var i = 0; i < res.length; i++) {
      console.log(+res[i].item_id + " " + res[i].product_name + "   " + res[i].department_name + "  " + res[i].price + "  " + res[i].stock_quantity);
    }

    inquirer.prompt([
      {
        name: "itemId",
        type: "input",
        message: "What is the item id would you like to buy?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many of this item would you like to buy?",
      }]).then(function (answer) {
        var selectedId = parseInt(answer.itemId);
        var selectedQuantity = answer.quantity;
        var idx = 0;
        for (var i = 0; i < res.length; i++) {
          if (selectedId === res[i].item_id) {
            idx = i;
            break;
          }
        }
        var selectedProduct = res[idx].product_name;
        if (selectedQuantity < res[idx].stock_quantity) {
          console.log("Your total for " + "(" + answer.quantity + ")" + " - " + res[idx].product_name + " is: $" + res[idx].price.toFixed(2) * selectedQuantity);
          connection.query("UPDATE products SET ? WHERE ?", [{
            stock_quantity: res[idx].stock_quantity - selectedQuantity
          }, {
            item_id: res[idx].item_id
          }], function (err, res) {
            startBuying();
          });
        }
        else {
          console.log("Sorry, We do not have enough inventory at this time, we only have " + res[chosenId].StockQuantity + " in our Inventory.");
          startBuying();
        }
      })

  })
}