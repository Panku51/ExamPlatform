import React from 'react'
import Axios from 'axios';
import { useState } from 'react';
import { Link } from 'react-router-dom';

function CreateQues() {

    // let navigate = useNavigate();
    const [question, setQuestion] = useState('')
    const [category, setCategory] = useState('')
    const [difficulty, setDifficulty] = useState('')

    const submit = () => {
        Axios.post('http://localhost:5181/create-ques', {
            question: question,
            category: category,
            difficulty: difficulty
        }).then(() => {
            alert("successfully added");
        })
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1 className='heading'>Test Creation</h1> <hr></hr> <br></br>
                <div className='form'>
                    <label for="question">Question:</label><br></br>
                    <input type="text" id="question" name="question" onChange={(e) => {
                        setQuestion(e.target.value);
                    }}></input> <br></br> <br></br>
                    <div className='row'>
                        <div className='col-md-6'>
                            <label for="category">Category:</label><br></br>
                            <select id="category" name="category" onChange={(e) => {
                                setCategory(e.target.value);
                            }}>
                                <option value="general">General</option>
                                <option value="history">History</option>
                                <option value="science">Science</option>
                                <option value="math">Math</option>
                            </select>
                        </div>
                        <div className='col-md-6'>
                            <label for="difficulty">Difficulty:</label><br></br>
                            <select id="difficulty" name="difficulty" onChange={(e) => {
                                setDifficulty(e.target.value);
                            }}>
                                <option value="easy">Easy</option>
                                <option value="medium">Medium</option>
                                <option value="hard">Hard</option>
                            </select><br></br>
                        </div>
                    </div> <br></br>
                    <button type="submit" onClick={submit} value="Submit">Submit</button>
                </div>
                <div>
                    {/* <button onClick={()=>{navigate("/Ques")}} className='heading'>Show Ques</button> */}
                    <center>
                        <Link to="/Ques"> <button className='heading'>Show Ques</button> </Link>
                    </center>
                </div>
            </header>
        </div>
    )
}

export default CreateQues