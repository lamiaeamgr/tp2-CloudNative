import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AuthorsPage = () => {
  const [authors, setAuthors] = useState([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await axios.get('/authors/all');
        setAuthors(response.data);
      } catch (error) {
        console.error('Error fetching authors:', error);
      }
    };

    fetchAuthors();
  }, []);

  return (
    <div>
      <h2>Authors</h2>
      <ul>
        {authors.map(author => (
          <li key={author._id}>{author.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default AuthorsPage;
