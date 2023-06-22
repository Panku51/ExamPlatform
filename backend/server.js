const { response } = require("express");
var express = require("express");
const { url } = require("inspector");
var path = require("path");
var app = express();
var sql = require("mysql");
const cors = require('cors');

app.use(express.static("public"));
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));// for the conversion of binary to json,otherwise it will show undefined.

const port = 5181;
app.listen(port, function () {
    console.log("server started on port", port);
})

var dbConfig = {
    host: "localhost",
    user: "root",
    password: '',
    database: "TestCreation",
    port :'3309'
}
//to check that connected or not
var dbcon = sql.createConnection(dbConfig);
dbcon.connect(function (err, req, resp) {
    if (err)
        console.log("Nada ", err);
    else
        console.log("Tada");
})

app.get("/", function (req, resp) {
    var filepath = path.join(path.resolve(), "public","index.html");
    resp.sendFile(filepath);
})

app.post("/ques",function (req, resp){
    var filepath = path.join(path.resolve(), "public","Ques.html");
    resp.sendFile(filepath);
})

app.post("/create-ques",function(req,resp){
    var data = [req.body.question, req.body.category, req.body.difficulty];
    dbcon.query("insert into quesBank values(?,?,?)", data, function (err,result) {
        if (err)
            resp.send(err.message);
        else
            resp.send("success");
    })
})

app.post("/showQues", function(req,resp){
    var filepath = path.join(path.resolve(), "public","showQues.html");
    resp.sendFile(filepath);
})

app.get("/ques-fetch", function (req, resp) {
    dbcon.query("select * from quesBank", function (err, res) {
        if (err)
            resp.send(err);
        else
            resp.send(res);
    })
})

app.get("/searchDifficulty-in-table", function (req, resp) {
    //resp.send("Tada"+ req.query.id);
    dbcon.query("select * from quesBank where difficulty=?",req.query.id, function (err, result) {
        if (err)
            resp.send(err.message);
        else
        console.log('Found ' + result.length + ' questions with difficulty level ' + req.query.id);
        console.log(result);
        resp.send(result);
    })
})

app.get("/searchCategory-in-table", function (req, resp) {
    //resp.send("Tada"+ req.query.id);
    dbcon.query("select * from quesBank where category=?",req.query.id, function (err, result) {
        if (err)
            resp.send(err.message);
        else
        console.log('Found ' + result.length + ' questions with category ' + req.query.id);
        console.log(result);
        resp.send(result);
    })
})

