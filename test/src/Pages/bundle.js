import React, { useEffect, useState } from 'react';
import Axios from 'axios';

const Bundle = () => {
  const [tests, setTests] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [bundleName, setBundleName] = useState('');
  const [bundleDescription, setBundleDescription] = useState('');

  useEffect(() => {
    fetchTestNames();
  }, []);

  const fetchTestNames = async () => {
    try {
      const response = await Axios.get('http://localhost:5181/test-fetch');
      const data = response.data;
      setTests(data.testNames);
    } catch (error) {
      console.error('Error fetching test names:', error);
    }
  };

  const handleTestSelection = (test) => {
    if (selectedTests.includes(test)) {
      setSelectedTests(selectedTests.filter((selectedTest) => selectedTest !== test));
    } else {
      setSelectedTests([...selectedTests, test]);
    }
  };

  const handleCreateBundle = async () => {
    try {
      // Create the bundle in the 'bundles' table
      const bundleResponse = await Axios.post('http://localhost:5181/create-bundle', {
        bundleName,
        bundleDescription,
      });
      const bundleId = bundleResponse.data.bundleId;

      // Insert selected tests into the 'bundleItems' table
      await Axios.post('http://localhost:5181/create-bundle-items', {
        bundleId,
        selectedTests,
      });

      // Reset the form
      setBundleName('');
      setBundleDescription('');
      setSelectedTests([]);

      console.log('Bundle created successfully!');
    } catch (error) {
      console.error('Error creating bundle:', error);
    }
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <div className="col-11">
            <br />
            <h2>New Bundle</h2>
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Bundle Name"
                value={bundleName}
                onChange={(e) => setBundleName(e.target.value)}
              />
            </div>
            <h2>Bundle Description</h2>
            <div className="input-group input-group-lg">
              <input
                type="text"
                className="form-control"
                placeholder="Bundle Description"
                value={bundleDescription}
                onChange={(e) => setBundleDescription(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-11">
            <br />
            <h2>Select Items</h2> <hr />
            {tests.length > 0 && (
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Select Items
                </button>
                <ul className="dropdown-menu">
                 .{tests.map((test, index) => (
                    <li key={index}>
                      <button
                        className={`dropdown-item ${selectedTests.includes(test) ? 'active' : ''}`}
                        type="button"
                        onClick={() => handleTestSelection(test)}
                      >
                        {test}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
        {selectedTests.length > 0 && (
          <div className="row">
            <div className="col-11">
              <br />
              <br />
              <h2>Selected Tests</h2> <hr />
              <br />
              <ul className='sTests'>
                {selectedTests.map((test, index) => (
                  <li key={index}>{test}</li>
                ))}
              </ul>
              <button className="btn btn-primary" onClick={handleCreateBundle}>
                Create Bundle
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Bundle;
