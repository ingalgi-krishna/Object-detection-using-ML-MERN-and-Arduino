import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './styles.css';  // Import the CSS file

function Home() {
    const [objects, setObjects] = useState([]);

    useEffect(() => {
        async function fetchObjects() {
            try {
                const response = await axios.get('http://localhost:5000/api/objects');
                console.log('Fetched objects:', response.data);  // Debug log
                setObjects(response.data);
            } catch (error) {
                console.error('Error fetching objects:', error);
            }
        }

        fetchObjects();
    }, []);

    return (
        <div>
            <h2>Detected Objects</h2>
            {objects.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {objects.map((obj) => (
                            <tr key={obj._id}>
                                <td>{obj.name}</td>
                                <td>{new Date(obj.timestamp).toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No objects detected.</p>
            )}
        </div>
    );
}

function About() {
    return <h2>About</h2>;
}

function App() {
    return (
        <Router>
            <nav>
                <h1>Object Detection Dashboard</h1>
                <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about">About</Link></li>
                </ul>
            </nav>
            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                </Routes>
            </main>
            <footer>
                <p>&copy; 2024 Object Detection System - Krishna Ingalgi</p>
            </footer>
        </Router>
    );
}

export default App;
