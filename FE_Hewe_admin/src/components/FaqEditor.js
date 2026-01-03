import React from 'react'
import styled from 'styled-components'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

const EditorWrapper = styled.div`
  height: 100%;
  overflow-y: auto;
  background: #fff;
  .demo-editor.rdw-editor-main {
    height: calc(20vh - 50px);
  }
  .rdw-editor-wrapper {
    height: 100%;
    border: 1px solid lightgray;
    padding: 0 0.5rem;
    border-radius: 5px;
  }
  .rdw-editor-main {
    height: auto;
  }
`

function TextEditor({ editorState, onEditorStateChange, ...props }) {
  return (
    <EditorWrapper>
      <Editor editorState={editorState} onEditorStateChange={onEditorStateChange} {...props} />
    </EditorWrapper>
  )
}

export default TextEditor
