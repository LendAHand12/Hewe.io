import styled from 'styled-components'

export const DashboardContainer = styled.div`
    color: #fff;
    background: ${({ lightBg }) => (lightBg ? '#f9f9f9' : '#F2F2F2')};
    margin-left: 280px;
    overflow: scroll;

    overflow-x: hidden;
    overflow-y: hidden;

    
    @media screen and (max-width: 780px) {
        margin-left: 0px;
    }
    
    @media screen and (max-width: 480px) {
        margin-left: 0px;
    }
`

export const DashboardWrapper = styled.div`
    display: flex;
    z-index: 1;
    height: 90vh;
    width: 100%;
    margin-right: auto;
    margin-left: auto;
    justify-content: flex-start;
    align-items: flex-start;
    flex-direction: column;

`

export const DashboardHeading = styled.div`
    padding: 0.5rem 2rem;
    margin-top: 1rem;
    display: flex;
    /* flex-direction: column; */
    align-items: center;
    justify-content: space-between;
    width: 100%;
`

export const DashHeading = styled.div`
    font: normal normal bold 20px/56px Lato;
    letter-spacing: 0.4px;
    color: #000000;
    opacity: 1;
    font-size: 26px;
    text-align: left;


    @media screen and (max-width: 768px) {
        font-size: 20px;
    }
    
    @media screen and (max-width: 480px) {
        font-size: 18px;
    }
    

`

export const HeadingButton = styled.button`
        box-shadow: 0px 0px 10px #00000030;
        border-radius: 32px;
        opacity: 1;
        margin: 0.4em;
        white-space: nowrap;
        padding: ${({ big }) => (big ? '0.5em 2em' : '0.6em 1.3em')};
        border: none;
        font-weight: 500;
        background: ${({ primary }) => (primary ? '#F9ECFD' : 'transparent linear-gradient(90deg, #E42279 0%, #6C1D63 100%) 0% 0% no-repeat padding-box')};
        color: ${({ primary }) => (primary ? '#000000' : '#FFFFFF')};
        font-size: ${({ fontBig }) => (fontBig ? '1.2rem' : '0.95rem')};
        outline: none;
        cursor: pointer;
        display: flex;
        justify-content: ${({ primary }) => (primary ? 'center' : 'flex-start')};
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

export const SvgLogo = styled.img`
    color: #fff;
    cursor: pointer;
`

export const BackIcon = styled.div`
    color: #000000;
    cursor: pointer;
    padding-right: 5px;
`

export const MenuAndBack = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
`

export const PreperationTime = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
`
export const LabelHeading = styled.div`
    color: #000000;
    text-align: left;
    font-size: 22px;
    padding: 1rem 0rem;
`

