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
    overflow: overlay;
`

export const DashboardHeading = styled.div`
    padding: 0.5rem 2rem;
    margin-top: 1rem;
    display: flex;
    /* flex-direction: column; */
    align-items: center;
    justify-content: space-between;
    width: 100%;


    @media screen and (max-width: 768px) {
        padding: 0.5rem 1.5rem;
        margin-top: 0.4rem;
    }
    
    @media screen and (max-width: 480px) {
        margin-top: 0.2rem;
        padding: 0.3rem 0rem;
    }

    @media screen and (max-width: 320px) {
        margin-top: 0rem;
        padding: 0rem 0rem;
    }
`

export const DashHeading = styled.div`
    font: normal normal bold 20px/56px Lato;
    letter-spacing: 0.4px;
    color: #000000;
    opacity: 1;
    font-size: 26px;
    text-align: left;


    @media screen and (max-width: 880px) {
        font-size: 18px;
    }

    @media screen and (max-width: 768px) {
        font-size: 20px;
    }
    
    @media screen and (max-width: 480px) {
        font-size: 14px;
    }
    

`

export const DashCard = styled.div`
height: auto;
// width: auto;
display: flex;
font-size: 17px;
padding: 10px 15px;
background-color: white;
justify-content: space-between;
align-items: center;
border-radius: 5px;
margin-bottom: 15px;
box-shadow: 0px 2px 2px #00000012;
color: #1A1A1A;
`

export const DashContainerCard = styled.div`
// background-color: pink;
height: 180px;
width:fit-content;
padding: 20px 20px;
display: grid;
margin-left: 1.5rem;


@media screen and (max-width: 1290px) {
       display : flex;
       flex-direction : column
    }
`

export const HeadingButton = styled.div`
`

export const DashContentCard = styled.div`
height: auto;
width: 250px;
display: flex;
font-size: 17px;
padding: 15px;
background-color: #FFFFFF;
justify-content: space-between;
align-items: center;
border-radius: 8px;
margin-bottom: 15px;
box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 2px;
color: #1A1A1A;

@media screen and (max-width: 1590px) {
        width : 250px;
    }

    @media screen and (max-width: 1092px){
        width: 200px;
    } 

@media screen and (max-width: 425px) {
         width : 180px;
    }

@media screen and (max-width: 375px) {
    width : 160px;
}

@media screen and (max-width: 320px) {
    width : 160px;
}

`
export const DashContainerCardIcon = styled.div`
height: auto;
width: auto;
display: flex;
justify-content: center;
border-radius: 50%;
padding: 0.8rem 0rem;
color: black;
font-size: 32px;
${'' /* background-color: blue; */}
`

export const DashIcon = styled.img`
height: auto;
    width: 50%;
    padding: 14px;
`

export const DashContainerCardContent = styled.div`
height: auto;
width: 65%;
margin: auto;
// background-color: lightcyan;
`

export const DashContainerCardContentTotal = styled.p`
color: #808080;
font: normal normal normal 11px/24px Lato;
letter-spacing: 0.11px;
`

export const DashContainerCardContentNumber = styled.p`
color: #00000;
font: normal normal bold 20px/24px Lato;
letter-spacing: 0.2px;
`
export const DashContainerCardContentOrder = styled.p`
color: #404040;
font: normal normal normal 14px/24px Lato;

letter-spacing: 0.42px;
`




export const DashContent = styled.p`
height: auto;
width: 97%;
display: flex;
justify-content: space-between;
align-items: center;
margin-bottom: 10px;
color: #1A1A1A;
padding: 0 10px;
font-size: 1.3rem;
// margin-left: 2rem;
`