import React, { useState, useEffect } from 'react';

const ListileUser = ({ label , content , classState }) => {
    let customContent = content;
    let customclassState = classState;
    if (customContent == 'asset') {
      customContent = 'activé';
      customclassState = 'text-primary'
    }
    if (customContent == 'idle') {
      customContent = 'desactivé';
      customclassState = 'text-danger'
    }    
    return (
      <>
        <p className='p-line'>
            <span>{label} :</span><br />
            <span className={`${customclassState}`}>
              {customContent}
            </span>
        </p><br />
      </>
    );
  };
  
export default ListileUser;
