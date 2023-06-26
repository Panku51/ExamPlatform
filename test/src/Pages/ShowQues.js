import React, { useEffect, useState } from 'react';
import "../App.css";
import Axios from 'axios';

const ShowQues = () => {
  const [QuesList, setQuesList] = useState([]);
  const [testName, setTestName] = useState('');
  const [selectedQuestions, setSelectedQuestions] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:5181/ques-fetch").then((response) => {
      setQuesList(response.data);
    });
  }, []);

  const remove = (ques) => {
    Axios.get(`http://localhost:5181/ques-del/${ques}`).then(() => {
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

  const updateQues = (id) => {
    const question = QuesList.find(val => val.id === id);
    if (question) {
      Axios.post(`http://localhost:5181/ques-update/${id}`, {
        question: question.question,
        category: question.category,
        difficulty: question.difficulty
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
      <div className='data'>
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
                <input
                    type="checkbox"
                    checked={selectedQuestions.includes(val.id)}
                    onChange={(e) => handleCheckboxChange(e, val.id)}
                  />
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
                  <button className='heading' onClick={() => updateQues(val.id)}>Update</button>
                </td>
                <td>
                  <button className='heading' onClick={() => remove(val.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div>
        <input type="text" id="testName" value={testName} onChange={handleTestNameChange} />
        <button
          className="heading"
          onClick={handleTestCreation}
          disabled={selectedQuestions.length === 0}
        >
          Create Test
        </button>
      </div>

      </div>
    </>
  );
};

export default ShowQues;