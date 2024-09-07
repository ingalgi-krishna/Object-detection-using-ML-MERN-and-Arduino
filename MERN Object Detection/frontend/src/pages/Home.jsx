import React, { useState } from 'react';
import axios from 'axios';

const Home = () => {
    const [objectName, setObjectName] = useState('');

    const handleSubmit = async () => {
        try {
            await axios.post('http://localhost:5000/api/objects', { name: objectName });
            setObjectName('');
        } catch (error) {
            console.error('Error saving object:', error);
        }
    };

    return (
        <div>
            <h1>Object Detection</h1>
            <input
                type="text"
                value={objectName}
                onChange={(e) => setObjectName(e.target.value)}
                placeholder="Enter detected object"
            />
            <button onClick={handleSubmit}>Save Object</button>
        </div>
    );
};

export default Home;
