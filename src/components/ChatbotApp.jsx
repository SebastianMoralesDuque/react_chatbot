import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from '../styles/ChatbotApp.module.css';
import FormElements from './FormElements';
import Pagination from './Pagination';
import Notification from './Notification';
import OverlayLoader from './OverlayLoader';

const { stringify } = JSON;

const ITEMS_PER_PAGE = 1;
const MAX_VISIBLE_PAGES = 5;

const ChatbotApp = () => {
  const [tag, setTag] = useState('');
  const [questions, setQuestions] = useState(['']);
  const [responses, setResponses] = useState(['']);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState('');
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const handleTagChange = (event) => {
    setTag(event.target.value);
  };

  const handleQuestionChange = (index, event) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = event.target.value;
    setQuestions(updatedQuestions);
  };

  const handleResponseChange = (index, event) => {
    const updatedResponses = [...responses];
    updatedResponses[index] = event.target.value;
    setResponses(updatedResponses);
  };

  const handleAddPair = () => {
    setQuestions(['', ...questions]);
    setResponses(['', ...responses]);
  };

  const handleRemovePair = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions);

    const updatedResponses = [...responses];
    updatedResponses.splice(index, 1);
    setResponses(updatedResponses);

    if (currentPage > 1 && updatedQuestions.length <= (currentPage - 1) * ITEMS_PER_PAGE) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const qaPairs = {
      tag: tag,
      patterns: questions,
      responses: responses,
    };

    try {
      const response = await axios.post('http://localhost:8000/chat/add-qa-pairs/', stringify(qaPairs), {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        setMessage('Se han agregado correctamente las preguntas y respuestas.');
        setTag('');
        setQuestions(['']);
        setResponses(['']);
        setCurrentPage(1);
      } else {
        setMessage('Ha ocurrido un error al agregar las preguntas y respuestas.');
      }
    } catch (error) {
      console.error(error);
      setMessage('Ha ocurrido un error al agregar las preguntas y respuestas.');
    }
  };

  const process_data = async () => {
    try {
      setProcessing(true);
      await axios.post('http://localhost:8000/chat/process-data/');
      navigate('/');
    } catch (error) {
      console.error(error);
    } finally {
      setProcessing(false);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;

  const filteredQuestions = questions.slice(startIndex, endIndex);
  const filteredResponses = responses.slice(startIndex, endIndex);

  const totalPages = Math.ceil(questions.length / ITEMS_PER_PAGE);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  let visiblePages = pageNumbers;

  if (totalPages > MAX_VISIBLE_PAGES) {
    const firstVisiblePage = Math.max(1, currentPage - Math.floor(MAX_VISIBLE_PAGES / 2));
    const lastVisiblePage = Math.min(totalPages, firstVisiblePage + MAX_VISIBLE_PAGES - 1);

    visiblePages = pageNumbers.slice(firstVisiblePage - 1, lastVisiblePage);
  }

  const handleRedirect = () => {
    navigate('/');
  };

  return (
    <div className={styles['chatbot-app-container']}>
      <form onSubmit={handleSubmit}>
        <div className={`${styles['formContainer']}`}>
          <FormElements
            tag={tag}
            questions={filteredQuestions}
            responses={filteredResponses}
            handleTagChange={handleTagChange}
            handleQuestionChange={handleQuestionChange}
            handleResponseChange={handleResponseChange}
            handleRemovePair={handleRemovePair}
            startIndex={startIndex}
            styles={styles}
          />
        </div>
        <div className={styles['submit-button-container']}>
          <button type="button" onClick={handleAddPair}>Agregar Par</button>
          <button type="submit" className={styles['submit-button']}>Enviar</button>
        </div>
      </form>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        visiblePages={visiblePages}
        handlePageChange={handlePageChange}
        styles={styles}
      />

      {message && <Notification message={message} styles={styles} />}
      <div className={styles['input-group-space']}></div> {/* Espacio adicional */}

      {/* Botón para redirigir sin procesar datos */}
      <div className={`${styles['button-container']}`}>
        <button
          className={`${styles['redirect-button2']}`}
          onClick={handleRedirect}
        >
          Chatbot App
        </button>
        <button
          className={`${styles['redirect-button']}`}
          onClick={process_data}
          disabled={processing}
        >
          Entrenar red
        </button>
      </div>

      {processing && <OverlayLoader styles={styles} />}
    </div>
  );
};

export default ChatbotApp;