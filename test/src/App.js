import { useState } from 'react';
import './App.css';
import Axios from 'axios'

function App() {

  const [question, setQuestion] = useState('')
  const [category, setCategory] = useState('')
  const [difficulty, setDifficulty] = useState('')

  const submit = () => {
    Axios.post('http://localhost:5181/create-ques', {
      question: question,
      category: category,
      difficulty: difficulty
    }).then(()=> {
      alert("successfully added");
    })
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1 style={{ padding: "5px", textAlign: 'center' }}>Test Creation</h1> <hr></hr> <br></br>
        <div className='form'>
            <label for="question">Question:</label><br></br>
            <input type="text" id="question" name="question" onChange={(e)=>{
              setQuestion(e.target.value)
            }}></input> <br></br>
            <label for="category">Category:</label><br></br>
            <select id="category" name="category"  onChange={(e)=>{
              setCategory(e.target.value)}}>
              <option value="general">General</option>
              <option value="history">History</option>
              <option value="science">Science</option>
              <option value="math">Math</option>
            </select><br></br>
            <label for="difficulty">Difficulty:</label><br></br>
            <select id="difficulty" name="difficulty"  onChange={(e)=>{
              setDifficulty(e.target.value)}}>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select><br></br>
            <button type="submit" onClick={submit} value="Submit">Submit</button>
        </div>
      </header>
    </div>
  );
}

export default App;
