import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = () => {
    const [objects, setObjects] = useState([]);

    useEffect(() => {
        const fetchObjects = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/objects');
                setObjects(response.data);
            } catch (error) {
                console.error('Error fetching objects:', error);
            }
        };

        fetchObjects();
    }, []);

    return (
        <div>
            <h1>History</h1>
            <ul>
                {objects.map((obj) => (
                    <li key={obj._id}>{obj.name} - {new Date(obj.timestamp).toLocaleString()}</li>
                ))}
            </ul>
        </div>
    );
};

export default History;
