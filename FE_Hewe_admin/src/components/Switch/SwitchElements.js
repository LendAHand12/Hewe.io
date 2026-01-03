// import styled from 'styled-components'


// export const Switchlabel = styled.label.attrs({
//     className : "switch"
// })`
//    position: relative;
//     display: inline-block;
//     width: 40px !important;
//     height: 20px;
// `

// export const SwitchInput = styled.input.attrs({
//     type: "checkbox"
// })`
//    opacity: 0;
//     width: 0;
//     height: 0;

//     &:checked + .slider {
//         background-color: ${({ bgColorChecked }) => ( bgColorChecked ? bgColorChecked : '#ffffff')};
//         /* background-color: #ffffff; */
//     }

//     &:checked + .slider:before {
//         transform: translateX(19px);
//         background-color: ${({ roundColorChecked }) => ( roundColorChecked ? roundColorChecked : '#A91F6E')};
//         /* background-color: #A91F6E; */
//     }
// `

// export const SwitchSpan = styled.span`
//    position: absolute;
//     cursor: pointer;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;

//     border: ${({ border }) => ( border ? border : '1px solid #ffffff')};
//     background-color: ${({ bgColorUnChecked }) => ( bgColorUnChecked ? bgColorUnChecked : '#A91F6E')};
//     /* background-color: #A91F6E; */

//     transition: 0.3s;

//     &::before {
//         position: absolute;
//         content: "";
//         height: 16px;
//         width: 16px;
//         left: 2px;
//         bottom: 1px;
//         background-color: ${({ roundColorUnChecked }) => ( roundColorUnChecked ? roundColorUnChecked : '#ffffff')};
//         transition: 0.3s;
//     }

//     /* &:checked + .slider {
//         background-color: #ffffff;
//     }

//     &:checked + .slider:before {
//         transform: translateX(19px);
//         background-color: #A91F6E;
//     } */

//     &.rounded {
//         border-radius: 34px !important;
//     }

//     &.rounded::before {
//         border-radius: 50%;
//     }
    
// `
