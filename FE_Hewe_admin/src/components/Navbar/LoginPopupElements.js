import styled from "styled-components";
import { Link } from 'react-scroll';

export const LoginHeading = styled.h2`
    color: #202020;
    font-size: 1.6rem;
    /* text-align: left; */
    text-align: ${({ alignCenter }) => (alignCenter ? 'center' : 'left')};
    font-weight: bold;
    
    @media screen and (max-width: 768px) {
        font-size: 1.6em;
    }
    
    @media screen and (max-width: 480px) {
        font-size: 1.3em;
    }
`

export const LoginButton = styled.button`
        margin: 0.4em;
        border-radius: 2px;
        width: 100%;
        white-space: nowrap;
        padding: ${({ big }) => (big ? '0.5em 2em' : '0.6em 1.5em')};
        background: ${({ primary }) => (primary ? 'transparent' : '#FF4001')};
        border: 1px solid ${({ primary }) => (primary ? "#FFFFFF" : "#FF4001")};
        color: ${(dark) => (dark ? '#F1F1F1' : '#F1F1F1')};
        font-size: ${({ fontBig }) => (fontBig ? '1.2rem' : '1rem')};
        outline: none;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;
        transition: all 0.2s ease-in-out;
        text-decoration: none;
    
        /* &:hover {
            transition: all 0.2s ease-in-out;
            background: ${({ primary }) => (primary ? '#FF4001' : 'transparent')};
            border: 1px solid ${({ primary }) => (primary ? "#FF4001" : "#FFFFFF")};
            color: ${(dark) => (dark ? '#F1F1F1' : '#F1F1F1')};
        } */
    
    
        @media screen and (max-width: 768px) {
            margin: 0.5em;
            margin-left: 0;
            padding: ${({ big }) => (big ? '0.5em 2em' : '0.6em 1.5em')};
            font-size: ${({ fontBig }) => (fontBig ? '1.2em' : '0.9em')};
        }
    
        @media screen and (max-width: 480px) {
            margin: 0.5em;
            margin-left : 0;
            padding: ${({ big }) => (big ? '0.5em 2em' : '0.4em 1.2em')};
            font-size: ${({ fontBig }) => (fontBig ? '1.2em' : '0.8em')};
        }
    
    `

export const LoginPara = styled.p`
    text-align: ${({ alignCenter }) => (alignCenter ? 'center' : 'left')};
    font-size: 1rem;
    font-weight: 400;
    color: #202020;
`

export const LoginDetails = styled.p`
    display: flex;
    flex-direction: column;
`