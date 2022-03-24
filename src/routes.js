import React, { useState, Component } from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  Redirect,
  useLocation,
} from 'react-router-dom';

import IndexPage from './pages/index/index.js';

export default class Index extends Component {
  render() {
    return (
      <Router>
        <Routes>
          <Route path='*' element={<IndexPage />} />
        </Routes>
      </Router>
    );
  }
}