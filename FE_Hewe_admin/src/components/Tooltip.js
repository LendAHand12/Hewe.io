import React, {useState} from "react";
import './Tooltip.css'

const TooltipN = ({text, children}) => {
    const [isVisible, setIsVisible]=useState(true)
  return (
    <div>
      <div className="tooltip-container"
    //    onMouseEnter={()=>{setIsVisible(true)}} onMouseLeave={()=>{setIsVisible(false)}}
       >
        {children}
       { isVisible && <div class="tooltip-content">{text}</div>}
    
      </div>
    </div>
  );
};

export default TooltipN;
