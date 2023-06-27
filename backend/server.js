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
app.use(express.urlencoded({ extended: true }));

const port = 5181;
app.listen(port, function () {
    console.log("server started on port", port);
})

var dbConfig = {
    host: "localhost",
    user: "root",
    password: '',
    database: "TestCreation",
    port: '3309'
}
//to check that connected or not
var dbcon = sql.createConnection(dbConfig);
dbcon.connect(function (err, req, resp) {
    if (err)
        console.log("Nada ", err);
    else
        console.log("Tada");
})

app.post("/create-ques", function (req, resp) {
    var data = [req.body.question, req.body.category, req.body.difficulty];
    dbcon.query("insert into quesBank (question, category, difficulty) values(?,?,?)", data, function (err, result) {
        if (err)
            resp.send(err.message);
        else
            resp.send("success");
    })
})

app.get("/ques-fetch", function (req, resp) {
    dbcon.query("select * from quesBank", function (err, res) {
        if (err)
            resp.send(err);
        else
            resp.send(res);
    })
})

app.get("/ques-del/:id", function (req, resp) {
    var data = req.params.id;
    dbcon.query("delete from quesBank where id=?", data, function (err, res) {
        if (err)
            resp.send(err.message);
        else
            resp.send(res.affectedRows + "Record Deleted");
    })
})

app.post('/ques-update/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    const { question, category, difficulty } = req.body;

    const updateQuery = 'UPDATE quesBank SET question = ?, category = ?, difficulty = ? WHERE id = ?';
    dbcon.query(updateQuery, [question, category, difficulty, id], (err, result) => {
        if (err) {
            console.error('Error updating question in database:', err);
            res.sendStatus(500);
            return;
        }
        console.log('Question updated in the database');
        res.sendStatus(200);
    });
});

app.post("/create-test", (req, res) => {
    const { testName, selectedQuestions } = req.body;
    if (!selectedQuestions || !Array.isArray(selectedQuestions)) {
        res.status(400).send('Invalid or missing questions array');
        return;
    }

    const insertTestQuery = 'INSERT INTO tests (test_name) VALUES (?)';

    dbcon.query(insertTestQuery, [testName], (err, result) => {
        if (err) {
            console.error('Error inserting test into tests table:', err);
            res.sendStatus(500);
            return;
        }

        const testId = result.insertId;

        const testQuestionData = selectedQuestions.map(questionId => [testId, testName, questionId]);
        // console.log(testQuestionData);

        dbcon.query('INSERT INTO test_questions (test_id, test_name, question_id) VALUES ?', [testQuestionData], function (err, result) {
            if (err) {
                console.error('Error saving test questions:', err);
                res.sendStatus(500);
                return;
            }
            console.log('Test created and questions saved successfully');
            res.sendStatus(200);
        });
    });
});

app.get("/searchDifficulty-in-table", function (req, resp) {
    //resp.send("Tada"+ req.query.id);
    dbcon.query("select * from quesBank where difficulty=?", req.query.id, function (err, result) {
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
    dbcon.query("select * from quesBank where category=?", req.query.id, function (err, result) {
        if (err)
            resp.send(err.message);
        else
            console.log('Found ' + result.length + ' questions with category ' + req.query.id);
        console.log(result);
        resp.send(result);
    })
})

//---------------------- ADMIN MODULE---------------------------

app.get("/test-fetch", function (req, resp) {
    const query = 'SELECT test_name FROM tests';

    dbcon.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching test names:', error);
            resp.status(500).json({ error: 'Error fetching test names' });
        } else {
            const testNames = results.map((row) => row.test_name);
            // console.log(testNames);
            resp.send({ testNames });
        }
    });
})

app.post('/create-bundle', (req, res) => {
    const { bundleName, bundleDescription } = req.body;

    dbcon.query(
        'INSERT INTO bundles (bundle_name, bundle_description) VALUES (?, ?)',
        [bundleName, bundleDescription],
        (error, results) => {
            if (error) {
                console.error('Error creating bundle:', error);
                return res.status(500).json({ message: 'Failed to create bundle' });
            }

            const bundleId = results.insertId;
            res.json({ bundleId });
        }
    );
});

app.post('/create-bundle-items', (req, res) => {
    const { bundleId, selectedTests } = req.body;
    const bundleItemsData = selectedTests.map((testId) => [bundleId, 'test', testId]);

    dbcon.query(
        'INSERT INTO bundleItems (bundle_id, item_type, item_id) VALUES ?',
        [bundleItemsData],
        (error) => {
            if (error) {
                console.error('Error creating bundle items:', error);
                return res.status(500).json({ message: 'Failed to create bundle items' });
            }

            res.json({ message: 'Bundle items created successfully' });
        }
    );
});
