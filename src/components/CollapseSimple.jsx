import { Minus, Plus } from 'lucide-react';
import React, { useState } from 'react';

const Collapse = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <button type="button" className={`collapsible-collapse ${isOpen ? 'active-collapse' : ''}`} onClick={toggle}>
        {title}
        {isOpen ? <Minus style={{ float:"right" }} /> : <Plus style={{ float:"right" }} />}
      </button>
      <div className="content" style={{ display: isOpen ? 'block' : 'none', marginTop:"10px" }}>
        {children}
      </div>
    </div>
  );
};

export default Collapse;