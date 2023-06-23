import React, { useEffect, useState } from 'react'
import "../App.css"
import Axios from 'axios';

const ShowQues = () => {
  const [QuesList, setQuesList] = useState([]);

  useEffect(() => {
    Axios.get("http://localhost:5181/ques-fetch").then((response) => {
      setQuesList(response.data)
    });
  }, []);

  return (
    <>
    <div><h1 className='heading'>Question Pool</h1> <br></br></div>
    <div className='data'>
        <table class="table table-success table-striped">
          <tr> <th>Question</th> <th> Question Category </th> <th>Question Level</th>  </tr>
          {QuesList.map((val) => {
            return <>
              <tr>
                <td>{val.question}</td>  <td>{val.category}</td>  <td>{val.difficulty}</td> <td><button>Delete</button></td> </tr></>
          })}
        </table>
        </div>
    </>
      )
}

      export default ShowQues;