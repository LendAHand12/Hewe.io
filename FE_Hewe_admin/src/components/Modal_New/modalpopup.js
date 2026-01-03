import React from "react";
import Button from "@material-ui/core/Button";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

const noop = () => {};

function ModalPopup({
  isOpen = false,
  title = "title",
  content = "content",
  onClose = noop,
  onSucess = noop,
  fullWidth = false,
  customClass="",
  ...props
}) {
//   var lan = window.localStorage.getItem("rcml-lang") || "en"
  return (
    <div>
      <Dialog
        hasClose
        open={isOpen}
        onClose={onClose}
        {...props}
        
        classes={{
          paper:  customClass +" modal_popup " + fullWidth ? "fullwidth is-"+lan : "",
        }}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>
      </Dialog>
    </div>
  );
}

export default ModalPopup;
