import React from 'react';
import {
  EditorComposer,
  Editor,
  ToolbarPlugin,
  AlignDropdown,
  BackgroundColorPicker,
  BoldButton,
  CodeFormatButton,
  FloatingLinkEditor,
  FontFamilyDropdown,
  FontSizeDropdown,
  InsertDropdown,
  InsertLinkButton,
  ItalicButton,
  TextColorPicker,
  TextFormatDropdown,
  UnderlineButton,
  Divider,
} from 'verbum';


const NoteViewer = ({initialEditorState, onChange}) => {

  const FONT_FAMILY_OPTIONS = [
    ['Arial', 'Arial'],
    ['Courier New', 'Courier New'],
    ['Georgia', 'Georgia'],
    ['Times New Roman', 'Times New Roman'],
    ['Trebuchet MS', 'Trebuchet MS'],
    ['Verdana', 'Verdana'],
  ];

  const FONT_SIZE_OPTIONS = [
    ['10px', '10px'],
    ['11px', '11px'],
    ['12px', '12px'],
    ['13px', '13px'],
    ['14px', '14px'],
    ['15px', '15px'],
    ['16px', '16px'],
    ['17px', '17px'],
    ['18px', '18px'],
    ['19px', '19px'],
    ['20px', '20px'],
  ];

  // console.log(initialEditorState,"fvyuewgiufgiwe");

  // let initialEditorStatee = '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"color: #000000;background-color: #ffffff;","text":"fyufuyuyvhyvfdytdty","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"color: #000000;background-color: #ffffff;","text":"ncghctctycdtyd","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1},{"children":[{"detail":0,"format":0,"mode":"normal","style":"color: #000000;background-color: #ffffff;","text":"vghcytdtydtydy","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}'

  return (
    <EditorComposer
      initialEditorState={initialEditorState}
    >
      <Editor 
        hashtagsEnabled={true} 
        emojisEnabled={true}
        autoLinkEnabled={true}
        actionsEnabled={true}
        // placeholder="hello"
        onChange={onChange}
        listMaxIndent="7"
        isEditable={true}
        locale="en"
      >
        <ToolbarPlugin 
          defaultFontSize="20px"
          defaultFontColor="#000"
          defaultBgColor="#fff"
          defaultFontFamily="Arial"
        >
          <FontFamilyDropdown 
            fontOptions={FONT_FAMILY_OPTIONS}
          />
          <FontSizeDropdown 
            fontSizeOptions={FONT_SIZE_OPTIONS}
          />
          <Divider />
          <BoldButton />
          <ItalicButton />
          <UnderlineButton />
          <CodeFormatButton />
          <InsertLinkButton onClick={alert} />
          <TextColorPicker />
          <BackgroundColorPicker />
          <TextFormatDropdown />
          <Divider />
          <InsertDropdown 
            enablePoll={false} 
            enableTable={true} 
            enableYoutube={true} 
            enableTwitter={true} 
            enableImage={{ enable: true, maxWidth: "400px" }}
            enableEquations={true} 
            enableExcalidraw={true} 
            enableHorizontalRule={true} 
            enableStickyNote={false} 
          />
          <Divider />
          <AlignDropdown />
        </ToolbarPlugin>
      </Editor>
    </EditorComposer>
  );
};

export default React.memo(NoteViewer);