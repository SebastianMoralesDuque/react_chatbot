import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/Chatbot.module.css';

const Chatbot = () => {
  const inputRef = useRef(null);
  const lastMessageRef = useRef(null);
  const navigate = useNavigate();
  const [messages, setMessages] = useState([{ text: '¡Bienvenido al chatbot!', sender: 'bot' }]);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const messagesContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (event) => {
    event.preventDefault();
    if (isBotTyping) {
      return; // No se permite enviar mensajes mientras el bot está escribiendo
    }
    const inputMessage = event.target.message.value.trim();
    if (inputMessage !== '') {
      const messageWithLineBreak = inputMessage + '\n';
      setMessages((prevMessages) => [...prevMessages, { text: messageWithLineBreak, sender: 'user' }]);
      event.target.reset();
  
      try {
        setIsBotTyping(true);
        const botResponse = await sendMessageToBackend(inputMessage);
        setMessages((prevMessages) => [...prevMessages, { text: '', sender: 'bot', isTyping: true }]);
  
        // Simular efecto de escritura
        const writeMessage = (message, index) => {
          if (index === message.length) {
            setMessages((prevMessages) => [
              ...prevMessages.slice(0, -1), // Eliminar el mensaje "isTyping"
              { text: message, sender: 'bot' },
            ]);
            setIsBotTyping(false);
            return;
          }
  
          setTimeout(() => {
            setMessages((prevMessages) => [
              ...prevMessages.slice(0, -1), // Eliminar el último mensaje (el mensaje "isTyping")
              { text: message.slice(0, index + 1), sender: 'bot', isTyping: true },
            ]);
            writeMessage(message, index + 1);
          }, 30); // Retardo de 100ms entre cada carácter
        };
  
        writeMessage(botResponse, 0);
      } catch (error) {
        console.error(error);
        setIsBotTyping(false);
      }
    }
  };
  
    
  const sendMessageToBackend = async (message) => {
    try {
      const response = await axios.post('http://localhost:8000/chat/send-message/', { message });
      if (response.status === 200) {
        const botResponse = response.data.message;
        if (botResponse) {
          return botResponse;
        } else {
          console.error('La respuesta del bot no tiene una propiedad "message"');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRedirect = () => {
    navigate('/ChatbotApp');
  };

  return (
    <div className={styles['chatbot-container']}>
      <div className={styles['messages-container-wrapper']}>
        <div id="messages-container" className={styles['messages-container']} ref={messagesContainerRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`${styles['message']} ${message.sender === 'user' ? styles['user'] : styles['bot']}`}
              style={{ backgroundColor: message.color }}
              ref={index === messages.length - 1 ? lastMessageRef : null}
            >
              <span
                className={`${styles['message-text']} ${message.sender === 'bot' ? styles['typing-animation'] : ''}`}
              >
                {message.text}
                {message.isTyping && <span className={styles['typing-indicator']}></span>}
              </span>
            </div>
          ))}
          <div ref={lastMessageRef}></div>
        </div>
      </div>
      <form onSubmit={handleSendMessage}>
        <input ref={inputRef} type="text" name="message" placeholder="Escribe un mensaje..." autoFocus />
        <button type="submit">Enviar</button>
      </form>
      <div className={styles['input-group-space']}></div>
      <button className={`${styles['button-goto-chatbot']}`} onClick={handleRedirect}>
        Ir a ChatbotApp
      </button>
    </div>
  );
};

export default Chatbot;
