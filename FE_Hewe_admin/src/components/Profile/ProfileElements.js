import styled from 'styled-components'

export const DashboardContainer = styled.div`
    color: #fff;
    background: ${({ lightBg }) => (lightBg ? '#f9f9f9' : '#FFF9FB')};
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
        border-radius: 5px;
        opacity: 1;
        margin: 0.4em;
        white-space: nowrap;
        border: none;
        font-weight: ${({ dropDown }) => (dropDown ? '600' : '500')};
        padding: ${({ dropDown }) => (dropDown ? '0.7em 1.6em' : '0.9em 1.3em')};
        background: ${({ dropDown }) => (dropDown ? '#FFFFFF' : 'transparent linear-gradient(90deg, #E42279 0%, #6C1D63 100%) 0% 0% no-repeat padding-box')};
        color: ${({ dropDown }) => (dropDown ? '#000000' : '#FFFFFF')};
        font-size: ${({ dropDown }) => (dropDown ? '1rem' : '1.2rem')};
        outline: none;
        cursor: pointer;
        display: flex;
        justify-content: ${({ primary }) => (primary ? 'center' : 'space-between')};
        align-items: center;
        transition: all 0.2s ease-in-out;
        text-decoration: none;
        margin-bottom: 1rem;
        width: 100%;


    
        /* &:hover {
            transition: all 0.2s ease-in-out;
            background: ${({ primary }) => (primary ? '#FF4001' : 'transparent')};
            border: 1px solid ${({ primary }) => (primary ? "#FF4001" : "#FFFFFF")};
            color: ${(dark) => (dark ? '#F1F1F1' : '#F1F1F1')};
        } */
    
    
        @media screen and (max-width: 768px) {
            margin: 0.5em;
            margin-left: 0;
            padding: ${({ big }) => (big ? '0.5em 2em' : '0.9em 1.3em')};
            font-size: ${({ fontBig }) => (fontBig ? '1.2em' : '1em')};
        }
    
        @media screen and (max-width: 480px) {
            margin: 0.5em;
            margin-left : 0;
            padding: ${({ big }) => (big ? '0.5em 2em' : '0.9em 1.3em')};
            font-size: ${({ fontBig }) => (fontBig ? '1.2em' : '1em')};
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
    margin-right: 10px;
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
export const RetaurantDetailsForm = styled.div`
    padding: 2rem;
    width: 100%;

    @media screen and (max-width: 768px) {
        padding: 1rem;
        }
    
        @media screen and (max-width: 480px) {
            padding: 0rem;
        }
`
export const InputDivide = styled.div`
    display: flex;
    flex-direction: row;
    
    @media screen and (max-width: 768px) {
        flex-direction: column;
    }
`
export const MiddleColumnProfile = styled.div`
    padding: 2rem 3rem;
    overflow: scroll;

    @media screen and (max-width: 768px) {
        width: 100%;
    }

    @media screen and (max-width: 480px) {
        padding: 2rem 1rem;
    }
`

export const ProfileTime = styled.div`
    display: flex;
    width: 59%;
    justify-content: flex-end;
    align-items: center;
`

export const ProfileDayTime = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export const InputPic = styled.img`
    background-color: #02001c;
    width: 28px !important;
    height: 24px !important;
    object-fit: none !important;
    margin-left: 4.2rem;
    margin-top: -2rem;
    /* border-radius: 50%; */
    /* margin-bottom: 10px; */
`

export const HeadingBlock = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
    padding: 1rem;
`

export const HeadingProfile = styled.div`
    /* display: flex; */
    /* align-items: center; */
    /* flex-direction: column; */
    text-align: left;
    font: normal normal 600 20px/24px Lato;
    letter-spacing: 0px;
    color: #000000;
    opacity: 1;
    width: 100%;
    margin-bottom: 1rem;
`

export const HeadingPara = styled.div`
    /* display: flex;
    align-items: center;
    flex-direction: column; */
    text-align: left;
    font: normal normal normal 17px/30px Lato;
    letter-spacing: 0px;
    color: #666666;
    opacity: 1;
`