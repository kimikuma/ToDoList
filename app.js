const mysql = require("mysql2");
require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

const connection = mysql.createConnection ({
 host: process.env.DB_HOST,
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
 database: "list_app",
 debug: true
});

connection.connect((err)=>{
  if(err) {
    console.log("接続エラー");
    console.log(err);
    return;
  }  
  console.log('接続成功');
})


app.get("/", (req, res) => {
  res.render("top.ejs");
})

app.get('/index',(req, res)=> {
  connection.query(
    'SELECT * FROM item',
    (error, results)=> {
      res.render('index.ejs', {items: results});
    }
  )
})

app.get('/new', (req, res)=> {
  res.render("new.ejs")
})

app.post('/create', (req, res)=> {
  connection.query(
    "INSERT INTO item (name,do) VALUES (?,?)",
    [req.body.itemName,req.body.itemDo],
    (error, results)=> {
      res.redirect("/index");
    }
  )
})

app.get('/edit/:id', (req, res)=> {
  connection.query(
    "SELECT * FROM item WHERE id=?",
    [req.params.id],
    (error, results)=> {
      res.render("edit.ejs", {item: results[0]});
    }
  )
})

app.post('/update/:id', (req, res)=> {
  connection.query(
   "UPDATE item SET name=?,do=? WHERE id=?",
    [req.body.itemName,req.body.itemDo,req.params.id],
    (error, results)=> {
      res.redirect("/index");
    }
  )
})

app.post('/delete/:id', (req, res)=> {
  connection.query(
    "DELETE FROM item WHERE id=?",
    [req.params.id],
    (error, results)=> {
      res.redirect('/index');
    }
  )
})

app.listen(3000);