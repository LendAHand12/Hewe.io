// import React from "react";
// import './Switch.css'

// import cx from "classnames";
// import { Switchlabel, SwitchInput, SwitchSpan } from './SwitchElements'


// const Switch = ({ rounded = false, isToggled, onToggle, bgColorChecked, roundColorChecked, border, bgColorUnChecked, roundColorUnChecked }) => {

//     const sliderCX = cx("slider", {
//         rounded: rounded
//     })

//     return (
//         <>
//             <Switchlabel>
//                 <SwitchInput
//                     checked={isToggled}
//                     onChange={onToggle}
//                     bgColorChecked={bgColorChecked}
//                     roundColorChecked={roundColorChecked}
//                 />
//                 <SwitchSpan
//                     className={sliderCX}
//                     border={border}
//                     bgColorUnChecked={bgColorUnChecked}
//                     roundColorUnChecked={roundColorUnChecked}
//                 />
//             </Switchlabel>

//             {/*<label className="switch">
//             <input type="checkbox"checked={isToggled} onChange={onToggle}/>
//             <span className={sliderCX}/>
//             </label>*/}

//         </>
//     )
// }

// export default Switch;