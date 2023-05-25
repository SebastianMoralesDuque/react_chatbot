import React from 'react';

const OverlayLoader = ({ styles }) => {
  return (
    <div className={styles['overlay']}>
      <div className={styles['loader']}></div>
      <p className={styles['loading-message']}></p>
    </div>
  );
};

export default OverlayLoader;
