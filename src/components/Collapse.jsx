import { Minus, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';

const Collapsible = ({ id, title, isChecked, onCheckboxChange, children, isOpenByDefault, colorConfirm, contentConfirm, nbFiles, nbComments }) => {
  const [isOpen, setIsOpen] = useState(isOpenByDefault || false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };
  
  useEffect(() => {
    if (isOpenByDefault) {
      setIsOpen(true);
    }
  }, [isOpenByDefault]);

  return (
    <div style={{ marginBottom: '10px' }}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ padding:"17px", border:"1px solid #e8e1e1", alignItems:"center" }}>
          <input type="checkbox" checked={isChecked} onChange={() => onCheckboxChange(id)} />
        </div>   
        <div style={{ width:"20px" }}></div>   
        <button type="button" style={{ fontSize: '18px', flexGrow: 1 }} className={`collapsible-collapse ${isOpen ? 'active-collapse' : ''}`} onClick={toggle}>
          {title}
          <span className={`${colorConfirm}`} style={{ marginLeft:"10px" }}>( {contentConfirm} )</span> 
          {nbFiles >= 1 ?
            <span className={`text-light`} style={{ marginLeft:"10px" }}>( {`${nbFiles} Piece${nbFiles>1 ? 's':''} Jointe${nbFiles>1 ? 's':''}`} )</span> 
          : null }
          {nbComments >= 1 ?
            <span className={`text-light`} style={{ marginLeft:"10px" }}>( {`${nbComments} Commentaire${nbComments>1 ? 's':''}`} )</span> 
          : null }
          {isOpen ? <Minus style={{ float: 'right' }} /> : <Plus style={{ float: 'right' }} />}
        </button>
      </div>
      <div className="content" style={{ display: isOpen ? 'block' : 'none', marginTop: '10px' }}>
        {children}
      </div>
    </div>
  );
};

export default Collapsible;
