import React from 'react'

export default function TextArea(props) {
    const {error} = props;
    return (
      <>
        <textarea {...props} >
          </textarea>
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
