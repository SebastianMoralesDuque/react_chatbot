import React from 'react';

const Notification = ({ message, styles }) => {
  return <p className={styles['message']}>{message}</p>;
};

export default Notification;
