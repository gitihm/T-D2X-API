const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors')
const Config = require("./Config");
const app = express();
// npm i json2csv lodash tree-kill cors express body-parser


app.use(cors())
app.use(
    bodyParser.urlencoded({
      extended: true
    })
  );
app.use(bodyParser.json());

require("./app/routes/mlRouter")(app);
app.listen(Config.PORT, ()=> {
    console.log(`Server Running at http://localhost:${Config.PORT}`);
  });