import styled from "styled-components/macro";

export const MainBox = styled.div`
    height: auto;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    `
export const InnerBox = styled.div`
    height: auto;
    width: 80%;
    display: flex;
    flex-direction: column;
    align-items: center;
    /* background-color: lightgray; */
    padding: 1rem;
`
export const CommonDouble = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`
export const CommonRow = styled.div`
    width: 45%;
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5rem;
`
export const CommonLabel = styled.div`
    width: 100%;
    font-size: 1rem;
    font-weight: 700;
    display: flex;
    margin-bottom: 0.3rem;
    justify-content: left;
`
export const CommonBox = styled.div`
    width: 100%;
    font-size: 0.8rem;
    font-weight: 700;
    display: flex;
    flex-direction: column;
    /* justify-content: left; */
`
export const InputArea = styled.textarea`
    height: auto;
    width: 100%;
    text-align: left;
    font: 400 15px/23px Nunito;
    letter-spacing: 0px;
    color: #656565;
    background-color: #FFFFFF;
    border: 1px solid #BBBBBB;
    border-radius: 5px;
    opacity: 1;
    padding: 10px;
    font-size: 0.9rem;
    outline: none;
`
export const ButtonBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
`
export const SubmitButton = styled.button`
    border: none;
    outline: none;
    background-color: #0294b3;
    color: white;
    border-radius: 5px;
    padding: 0.3rem 1.2rem;
    font-size: 1rem;
`
export const UploadRow = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`
export const UploadCommon = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
export const ContentDiv = styled.div`
    width: 300px;
    /* overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical; */
`
export const CopyButton = styled.div`
    /* border: 1px solid lightgray; */
    border-radius: 5px;
    padding: 0.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    margin-left: 0.3rem;
`
export const InfoButton = styled.div`
    /* border: 1px solid lightgray; */
    /* border-radius: 50%; */
    padding: 0.3rem;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: #0294b3;
    font-size: 1rem;
    margin-left: 0.3rem;
`
export const InfoBox = styled.div`
    width: 700px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`
export const InfoTitle = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.3rem;
`
export const InfoImageBox = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`
export const InfoImage = styled.img`
    width: 100%;
`