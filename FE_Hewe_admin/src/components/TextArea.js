import React from 'react'
import './TextArea.css'
export default function TextArea(props) {
    const {error} = props;
    return (
      <>
        <div className='placeholderChanges'><textarea {...props} >
          </textarea></div>
        {error ? (
          <p  
          style={{ paddingTop: 5,
          fontSize:13,
          color:"red" }}>
            {error}
          </p>
        ) : null}
      </>
    );
}
