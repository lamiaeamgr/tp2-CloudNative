import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PublishersPage = () => {
  const [publishers, setPublishers] = useState([]);

  useEffect(() => {
    const fetchPublishers = async () => {
      try {
        const response = await axios.get('/publishers/all');
        setPublishers(response.data);
      } catch (error) {
        console.error('Error fetching publishers:', error);
      }
    };

    fetchPublishers();
  }, []);

  return (
    <div>
      <h2>Publishers</h2>
      <ul>
        {publishers.map(publisher => (
          <li key={publisher._id}>{publisher.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default PublishersPage;
