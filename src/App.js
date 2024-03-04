import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AuthorsPage from './AuthorsPage';
import PublishersPage from './PublishersPage';
import BooksPage from './BooksPage';

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/authors">
            <AuthorsPage />
          </Route>
          <Route path="/publishers">
            <PublishersPage />
          </Route>
          <Route path="/books">
            <BooksPage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
