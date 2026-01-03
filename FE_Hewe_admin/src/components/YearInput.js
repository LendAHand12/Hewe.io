import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const YearInput = (props) => {
  const{error}  = props
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div className="picker_box">
      <i className="fa fa-calendar" />
    <DatePicker type="date" 
    // maxDate={new Date()}
     {...props} />
     {error ? (
          <p  
          style={{ paddingTop: 5,
          fontSize:13,
          color:"red" }}>
            {error}
          </p>
        ) : null}
     </div>
  );
};

export default  YearInput