import React from "react";
import NoteViewer from "./VerbumTextEditor";
import Show from "./Show";
import "./lexical.css";

function EditorSection({ initialEditorState, onChange }) {
  const [content, setContent] = React.useState(initialEditorState);

  return (
    <div style={{ borderRadius: "10px", border: "1px solid #00000030" }}>
      {/* <NoteViewer
        // setContent={(data) => {
        //   console.log(data);
        // }}
        initialEditorState={initialEditorState}
        onChange={onChange}
      /> */}
      <Show content={content} />
    </div>
  );
}

export default EditorSection;
