import React, { useState } from "react";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import '../components/Navbar/timeInput.css'
// CSS Modules, react-datepicker-cssmodules.css
// import 'react-datepicker/dist/react-datepicker-cssmodules.css';

const TimeInput = (props) => {
  const{error}  = props
  const [startDate, setStartDate] = useState(new Date());
  return (
    <div className="picker_box timeInput">
      <i className="fa fa-calendar" />
    <DatePicker type="date" maxDate={new Date()}
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

export default  TimeInput