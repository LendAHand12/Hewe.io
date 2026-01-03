import React from 'react';
import styled from 'styled-components';
import { MdClose } from 'react-icons/md'
import imgHome from '../../images/homeBg.png'
import { makeStyles } from '@mui/styles';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Model from '@mui/material/Modal';
import './modal.css'

const Background = styled.div`
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
`
const ModalWrapper = styled.div`
    width: 100%;
    height: 100%;
    box-shadow: 0 5px rgba(0,0,0,0.2);
    background: #fff;
    color: #000;
    display: grid;
    grid-template-columns: 1fr 1fr;
    position: relative;
    z-index: 10;
    border-radius: 10px;
`

const ModalImg = styled.div`
    width: 100%;
    height: 100%;
    border-radius: 10px 0 0 10px;
    /* background: #000; */
    color: royalblue;
`
const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    line-height: 1.8;
    color: #141414;

    p {
        margin-bottom: 1rem;
    }

    button {
        padding: 10px 24px;
        background: #141414;
        color: #fff;
        border: none;
    }
`

const CloseModalButton = styled(MdClose)`
    cursor: pointer;
    position: absolute;
    top: 20px;
    right: 20px;
    width: 32px;
    height: 32px;
    padding: 0;
    z-index: 10;
`


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

const useStyles = makeStyles({
    dialogPadding: {
        padding: "1.2rem 3rem",
    }
  });

const noop = () => {};


export const Modal = ({ 
    isOpen= false, 
    title = "title",
    content = "content",
    onClose = noop,  
    maxWidth,
    width="100%",
    setShowModal 
}) => {

    const classes = useStyles();

    return (
        <>
            {isOpen ? (
                <Dialog
                    open={isOpen}
                    onClose={onClose}
                    maxWidth={maxWidth}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                <div className={classes.dialogPadding} style={{width:width}}>
                    <DialogTitle>{title}</DialogTitle>
                    <DialogContent>{content}</DialogContent>
                        {/*<DialogActions>
                            <Button onClick={onClose}>Disagree</Button>
                            <Button onClick={onClose} autoFocus>
                                Agree
                            </Button>
                        </DialogActions>*/}
                </div>
                </Dialog>
                ) : null}

        </>
    )
};


// <Model
//     open={showModal}
//     onClose={showModal}
//     aria-labelledby="modal-modal-title"
//     aria-describedby="modal-modal-description"
//     onBackdropClick={showModal}
//     >
//     <Box sx={style}>
//     <ModalWrapper>
//         <ModalImg src={imgHome} 
//         alt="camera"/>
//         <ModalContent>
//             <h1>Are you ready?</h1>
//             <p>get  exncenovijrevireo cioeornviwjei hfiore</p>
//             <button>Join Now</button>
//             <CloseModalButton aria-label="Close modal" onClick={() => setShowModal(prev => !prev)}/>
//         </ModalContent>
//     </ModalWrapper>
//     </Box>
//     </Model>
            // <Typography id="modal-modal-title" variant="h6" component="h2">
            // Text in a modal
            // </Typography>
            // <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            // Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            // </Typography>
            // <Background>
            //     <ModalWrapper showModal={showModal}>
            //         <ModalImg src={imgHome} 
            //         alt="camera"/>
            //         <ModalContent>
            //             <h1>Are you ready?</h1>
            //             <p>get  exncenovijrevireo cioeornviwjei hfiore</p>
            //             <button>Join Now</button>
            //             <CloseModalButton aria-label="Close modal" onClick={() => setShowModal(prev => !prev)}/>
            //         </ModalContent>
            //     </ModalWrapper>
            // </Background>