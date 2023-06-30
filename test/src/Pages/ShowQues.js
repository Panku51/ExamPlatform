import React, { useEffect, useState } from 'react';
import "../App.css";
import Axios from 'axios';
import myImage from "../assets/delete.png";
import updateImg from "../assets/update1.png";

const ShowQues = () => {
  const [QuesList, setQuesList] = useState([]);
  const [testName, setTestName] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  // useEffect(() => {
  //   Axios.get("http://localhost:5181/ques-fetch").then((response) => {
  //     setQuesList(response.data);
  //   });
  // }, []);

  useEffect(() => {
    Axios.get("http://localhost:5181/fetchFromFile").then((response) => {
      setQuesList(response.data);
    });
  }, []);

  // const remove = (ques) => {
  //   Axios.get(`http://localhost:5181/ques-del/${ques}`).then(() => {
  //     alert("Successfully Deleted");
  //   });
  // };

  const remove = (ques) => {
    Axios.get(`http://localhost:5181/delFromFile/${ques}`).then(() => {
      alert("Successfully Deleted");
    });
  };

  const updateQuestionValue = (index, field, newValue) => {
    setQuesList(prevList => {
      const updatedList = [...prevList];
      updatedList[index][field] = newValue;
      return updatedList;
    });
  };

  // const updateQues = (id) => {
  //   const question = QuesList.find(val => val.id === id);
  //   if (question) {
  //     Axios.post(`http://localhost:5181/ques-update/${id}`, {
  //       question: question.question,
  //       category: question.category,
  //       difficulty: question.difficulty
  //     }).then(() => {
  //       alert("Successfully Updated");
  //     });
  //   }
  // };

  const updateQues = (id) => {
    const question = QuesList.find(val => val.id === id);
    if (question) {
      Axios.post(`http://localhost:5181/ques-update/${id}`, {
        question: question.question,
        option_1: question.option_1,
        option_2: question.option_2,
        option_3: question.option_3,
        option_4: question.option_4,
        option_5: question.option_5,
        answer: question.answer,
        solution: question.solution,
        topic: question.topic,
        subTopic: question.subTopic
      }).then(() => {
        alert("Successfully Updated");
      });
    }
  };

  const handleCheckboxChange = (event, id) => {
    if (event.target.checked) {
      setSelectedQuestions((prevSelected) => [...prevSelected, id]);
    } else {
      setSelectedQuestions((prevSelected) =>
        prevSelected.filter((questionId) => questionId !== id)
      );
    }
  };

  const handleTestNameChange = (event) => {
    setTestName(event.target.value);
  };

  const handleTestCreation = () => {
    Axios.post('http://localhost:5181/create-test', {
      testName: testName,
      selectedQuestions: selectedQuestions,
    })
      .then((response) => {
        alert('Test created successfully');
      })
      .catch((error) => {
        console.error('Error creating test:', error);
        alert('Failed to create test');
      });
  };

  return (
    <>
      <div>
        <h1 className='heading'>Question Pool</h1>
        <br />
      </div>
      {/* <div className='data'>
        <table className="table table-success table-striped">
          <thead>
            <tr>
              <th>Select</th>
              <th>Question</th>
              <th>Question Category</th>
              <th>Question Level</th>
              <th>Action</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {QuesList.map((val, index) => (
              <tr key={index}>
                <td>
                  <center>
                    <input
                      className='checkbox'
                      type="checkbox"
                      checked={selectedQuestions.includes(val.id)}
                      onChange={(e) => handleCheckboxChange(e, val.id)}
                    />
                  </center>
                </td>
                <td>
                  <input
                    type="text"
                    value={val.question}
                    onChange={(e) => updateQuestionValue(index, 'question', e.target.value)}
                  />
                </td>
                <td><input
                  type="text"
                  value={val.category}
                  onChange={(e) => updateQuestionValue(index, 'category', e.target.value)}
                /></td>
                <td><input
                  type="text"
                  value={val.difficulty}
                  onChange={(e) => updateQuestionValue(index, 'difficulty', e.target.value)}
                /></td>
                <td>
                  <center>
                    <button className='heading' onClick={() => updateQues(val.id)}>Update</button>
                  </center>
                </td>
                <td>
                  <center>
                    <button className='heading' onClick={() => remove(val.id)}>Delete</button>
                  </center>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
          <label>Test Name</label>
          <input type="text" id="testName" value={testName} onChange={handleTestNameChange} />
          <button
            className="heading"
            onClick={handleTestCreation}
            disabled={selectedQuestions.length === 0}
          >
            Create Test
          </button>
        </div>

      </div> */}

      <table className="table table-success table-striped">
        <thead>
          <tr>
            <th>Select</th>
            <th>Id</th>
            <th>Question</th>
            <th>option 1</th>
            <th>option 2</th>
            <th>option 3</th>
            <th>option 4</th>
            <th>option 5</th>
            <th>Answer</th>
            <th>solution</th>
            <th>subject</th>
            <th>topic</th>
            <th>Sub-Topic</th>
          </tr>
        </thead>
        <tbody>
          {QuesList.map((val, index) => (
            <tr key={index}>
              <td>
                <center>
                  <input
                    className='checkbox space'
                    type="checkbox"
                    checked={selectedQuestions.includes(val.id)}
                    onChange={(e) => handleCheckboxChange(e, val.id)}
                  />
                  <img className='space' alt='delete' onClick={() => updateQues(val.id)} src={myImage}></img>
                  <img className='space' alt='update' src={updateImg} onClick={() => remove(val.id)}></img>
                </center>
              </td>
              <td>
                {val.id}
              </td>
              <td>
                <input
                  type="text"
                  value={val.question}
                  onChange={(e) => updateQuestionValue(index, 'question', e.target.value)}
                />
              </td>
              <td><input
                type="text"
                value={val.option_1}
                onChange={(e) => updateQuestionValue(index, 'option_1', e.target.value)}
              /></td>
              <td><input
                type="text"
                value={val.option_2}
                onChange={(e) => updateQuestionValue(index, 'option_2', e.target.value)}
              /></td>
              <td>
              <input
                type="text"
                value={val.option_3}
                onChange={(e) => updateQuestionValue(index, 'option_3', e.target.value)}
              />
              </td>
              <td>
              <input
                type="text"
                value={val.option_4}
                onChange={(e) => updateQuestionValue(index, 'option_4', e.target.value)}
              />
              </td>
              <td>
              <input
                type="text"
                value={val.option_5}
                onChange={(e) => updateQuestionValue(index, 'option_5', e.target.value)}
              />
              </td>
              <td>
              <input
                type="text"
                value={val.answer}
                onChange={(e) => updateQuestionValue(index, 'answer', e.target.value)}
              />
              </td>
              <td>
              <input
                type="text"
                value={val.solution}
                onChange={(e) => updateQuestionValue(index, 'solution', e.target.value)}
              />
              </td>
              <td>
              <input
                type="text"
                value={val.subject}
                onChange={(e) => updateQuestionValue(index, 'subject', e.target.value)}
              />
              </td>
              <td>
              <input
                type="text"
                value={val.topic}
                onChange={(e) => updateQuestionValue(index, 'topic', e.target.value)}
              />
              </td>
              <td>
              <input
                type="text"
                value={val.subTopic}
                onChange={(e) => updateQuestionValue(index, 'subTopic', e.target.value)}
              />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <label>Test Name</label>
        <input type="text" id="testName" value={testName} onChange={handleTestNameChange} />
        <button
          className="heading"
          onClick={handleTestCreation}
          disabled={selectedQuestions.length === 0}
        >
          Create Test
        </button>
      </div>
    </>
  );
};

export default ShowQues;