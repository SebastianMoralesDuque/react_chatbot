import React from 'react';

const FormElements = ({
  tag,
  questions,
  responses,
  handleTagChange,
  handleQuestionChange,
  handleResponseChange,
  handleRemovePair,
  startIndex,
  styles,
}) => {
  return (
    <>
      {questions.map((question, index) => (
        <div className={styles.formGroup} key={index}>
          <div className={styles['input-group']}>
            <div className={styles['form-group']}>
              <label htmlFor="tag-input" style={{ color: '#fff' }}>Etiqueta:</label>
              <div className={styles['tag-input-container']}>
                <input
                  type="text"
                  id="tag-input"
                  name="tag-input"
                  value={tag}
                  onChange={handleTagChange}
                  required
                  autoFocus
                />
              </div>
            </div>
            <div className={styles['input-group-space']}></div> {/* Espacio adicional */}
            <label htmlFor={`question-${index}`} style={{ color: '#fff' }}>Pregunta:</label>
            <textarea
              id={`question-${index}`}
              name={`question-${index}`}
              value={question}
              onChange={(event) => handleQuestionChange(index + startIndex, event)}
              required
              className={styles['text-field']}
            />
            <div className={styles['input-group-space']}></div> {/* Espacio adicional */}
          </div>
          <div className={styles['input-group']}>
            <label htmlFor={`response-${index}`} style={{ color: '#fff' }}>Respuesta:</label>
            <textarea
              id={`response-${index}`}
              name={`response-${index}`}
              value={responses[index]}
              onChange={(event) => handleResponseChange(index + startIndex, event)}
              required
              className={styles['text-field']}
            />
            <div className={styles['input-group-space']}></div> {/* Espacio adicional */}
          </div>
          <div className={`${styles['button-container']} ${styles['form-group-container']}`}>
            <button type="button" className={styles['remove-button']} onClick={() => handleRemovePair(index + startIndex)}>Eliminar</button>
          </div>
          <div className={styles['button-space']}></div> {/* Espacio adicional */}
        </div>
      ))}
    </>
  );
};

export default FormElements;
