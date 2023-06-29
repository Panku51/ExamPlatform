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

    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleFileUpload = () => {
        if (!selectedFile) {
            alert('Please select a file.');
            return;
        }

        const formData = new FormData();
        formData.append('formFile', selectedFile);

        Axios.post('http://localhost:5181/upload-file', formData)
            .then(() => {
                alert('File uploaded successfully.');
            })
            .catch((error) => {
                console.error('Error uploading file:', error);
            });
    };


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
                <div className='row'>
                    <center><h3>OR  <hr></hr></h3></center>
                    <center>
                        <div className="col-10">
                            <label htmlFor="formFile" className="form-label">
                                <h1>Upload a file</h1>
                            </label>
                            <input
                                className="form-control"
                                type="file"
                                id="formFile"
                                name="formFile"
                                onChange={handleFileChange}
                            />
                            <br />
                            <button type="submit" onClick={handleFileUpload}>Submit File</button>
                        </div>
                    </center>
                </div>
                <div>
                    <br></br>
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