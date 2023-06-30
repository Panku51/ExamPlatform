const { response } = require("express");
var express = require("express");
const { url } = require("inspector");
const multer = require('multer');
var path = require("path");
var app = express();
var sql = require("mysql");
const cors = require('cors');
require('dotenv').config();
const fs = require('fs');
// Library for the document read
const { promisify } = require('util');
const Docxtemplater = require('docxtemplater');
const PizZip = require('pizzip');
const MathJax = require('mathjax-node');


app.use(express.static("public"));
app.use(cors());
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.PORT, function () {
    console.log("server started on port", process.env.PORT);
})

var dbConfig = {
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database,
    port: process.env.port
}
//to check that connected or not
var dbcon = sql.createConnection(dbConfig);
dbcon.connect(function (err, req, resp) {
    if (err)
        console.log("Error : ", err);
    else
        console.log("Database Successfully Connected");
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
app.get("/fetchFromFile", function (req, resp) {
    dbcon.query("select * from Ques", function (err, res) {
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

app.get("/delFromFile/:id", function (req, resp) {
    var data = req.params.id;
    dbcon.query("delete from Ques where id=?", data, function (err, res) {
        if (err)
            resp.send(err.message);
        else
            resp.send(res.affectedRows + "Record Deleted");
    })
})
// app.post('/ques-update/:id', (req, res) => {
//     const id = req.params.id;
//     console.log(id);
//     const { question, category, difficulty } = req.body;

//     const updateQuery = 'UPDATE quesBank SET question = ?, category = ?, difficulty = ? WHERE id = ?';
//     dbcon.query(updateQuery, [question, category, difficulty, id], (err, result) => {
//         if (err) {
//             console.error('Error updating question in database:', err);
//             res.sendStatus(500);
//             return;
//         }
//         console.log('Question updated in the database');
//         res.sendStatus(200);
//     });
// });

app.post('/ques-update/:id', (req, res) => {
    const id = req.params.id;
    console.log(id);
    const { question, option_1,option_2,option_3,option_4,option_5,answer,solution,subject,topic,subTopic } = req.body;

    const updateQuery = 'UPDATE Ques SET question = ?, option_1 = ?, option_2 = ?, option_3 = ?, option_4 =?, option_5=?,answer=?,solution=?,subject=?,topic=?,subTopic=? WHERE id = ?';
    dbcon.query(updateQuery, [question,option_1,option_2,option_3,option_4,option_5,answer,solution,subject,topic,subTopic, id], (err, result) => {
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

//---------------------- ADMIN MODULE ---------------------------

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
//-----------------------------------FILE READ AND UPLOAD DATA IN DATABASE--------------------------------------

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.post('/upload-file', upload.single('formFile'), function (req, res) {
    if (!req.file) {
        res.status(400).send('No file uploaded.');
        return;
    }

    const filename = req.file.filename;
    const filepath = req.file.path;

    dbcon.query('INSERT INTO files (filename) VALUES (?)', [filename], function (err, result) {
        if (err) {
            console.error('Error inserting filename into database:', err);
            res.status(500).send('Error inserting filename into database');
        } else {
            console.log('File uploaded successfully and inserted into the database');
            res.send('success');
            readDocxFile(filepath);
        }
    });
});


// Configure MathJax
MathJax.start();

async function readDocxFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'binary');

    const zip = new PizZip(content);

    const doc = new Docxtemplater();
    doc.loadZip(zip);

    // Custom parser for expressions
    doc.setOptions({
      parser: function (tag) {
        return {
          get: tag === '.' ? function (s) { return s; } : compileExpression(tag),
        };
      },
    });

    doc.setData({});

    doc.render();

    const extractedText = doc.getFullText();

    const questions = parseQuestionsAndOptions(extractedText);
    console.log('Questions:', questions);
    insertQuestionsAndOptions(questions);

    return questions;
  } catch (error) {
    console.error('Error reading DOCX file:', error);
    throw error;
  }
}

function compileExpression(exp) {
  return function (scope) {
    const options = {
      math: exp,
    };

    // Use MathJax to render the equation
    return MathJax.typeset(options).then((data) => data.html);
  };
}


function parseQuestionsAndOptions(extractedText) {
    const regex = /Question: (.*) Options: (.*) Answer:(.*) Solution: (.*) Subject:(.*) Topic:(.*) Sub-Topic:(.*)/gm;
    let match;
    const questions = [];

    while ((match = regex.exec(extractedText))) {
        const question = match[1].trim();
        const options = match[2].trim().split(',').map((option) => option.trim());
        const answer = match[3].trim();
        const solution = match[4].trim();
        const subject = match[5].trim();
        const topic = match[6].trim();
        const subTopic = match[7].trim();

        questions.push({ question, options, answer, solution, subject, topic, subTopic });
    }

    return questions;
}

async function insertQuestionsAndOptions(questions) {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS Ques (
        id INT AUTO_INCREMENT PRIMARY KEY,
        question TEXT,
        ${questions[0].options
            .map((_, index) => `option_${index + 1} TEXT`)
            .join(', ')}
        ,
        answer TEXT,
        solution TEXT,
        subject TEXT,
        topic TEXT,
        subTopic TEXT
      )
    `;

    await new Promise((resolve, reject) => {
        dbcon.query(createTableQuery, (error) => {
            if (error) {
                console.error('Error creating table:', error);
                reject(error);
                return;
            }
            console.log('Table created successfully!');
            resolve();
        });
    });

    const insertQuery = `
      INSERT INTO Ques (question, ${questions[0].options
            .map((_, index) => `option_${index + 1}`,)
            .join(', ')}, answer, solution, subject, topic, subTopic)
      VALUES ${questions
            .map(
                ({ question, options, answer , solution, subject, topic, subTopic }) =>
                    `('${question}', '${options.join("', '")}' , '${answer}', '${solution}', '${subject}','${topic}','${subTopic}')`
            )
            .join(', ')}
    `;

    await new Promise((resolve, reject) => {
        dbcon.query(insertQuery, (error) => {
            if (error) {
                console.error('Error inserting data into the database:', error);
                reject(error);
                return;
            }
            console.log('Data inserted successfully!');
           // response.send("Data Inserted Successfully");
            resolve();
        });
    });
}
//--------------------------- 