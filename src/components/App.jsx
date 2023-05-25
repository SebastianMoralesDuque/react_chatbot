import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styles from '../styles/Chatbot.module.css';
import Chatbot from './Chatbot';
import ChatbotApp from './ChatbotApp';

const App = () => {
  return (
    <Router>
      <div className={styles['App']}>
        <h1>Chatbot</h1>
        <Routes>
          <Route path="/" element={<Chatbot />} />
          <Route path="/ChatbotApp" element={<ChatbotApp />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

//asasda