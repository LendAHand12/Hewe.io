// import { Modal } from "antd";
// import dayjs from "dayjs";
// import { useSelector } from "react-redux";
// import logo from "~/assets/img/logo.png";
// import iconSuccess from "~/assets/img/icon-success.png";
// import usdtIcon from "~/assets/img/usdt.svg";
// import { IconUSDT } from "~/components";

// export const PopupNotifSuccess = ({ isOpen, onClose, data }) => {
//   const { data: languageData } = useSelector((state) => state.languages);
//   const title = "Chuyển USDT thành công";

//   // TODO bill, history deposit, history transfer USDT admin

//   return (
//     <Modal
//       className="transaction-statistic-modal--success"
//       open={isOpen}
//       onCancel={onClose}
//       footer={null}
//     >
//       <div className="transaction-succesfully">
//         <div className="title-wrap">
//           <div className="brand-logo">
//             <img src={logo} alt="bizpoint-logo" />
//           </div>
//           <div className="icon">
//             <img src={iconSuccess} alt="icon-success" />
//           </div>
//           <div className="title">{title}</div>
//           <div className="date-time">
//             {dayjs(data?.completeTime).format(
//               `dddd,${
//                 languageData === "vi" ? " ngày" : ""
//               } DD MMMM, YYYY HH:mm:ss`
//             )}
//           </div>
//         </div>
//         <div className="content-wrap">
//           <div className="item">
//             <div className="label">Người nhận</div>
//             <div className="info">
//               <div>{data?.receiverId}</div>
//               <div>{data?.receiverName}</div>
//             </div>
//           </div>
//           <div className="item">
//             <div className="label">Số USDT chuyển</div>
//             <div
//               className="info"
//               style={{ display: "flex", gap: "6px", alignItems: "center" }}
//             >
//               {data?.amountUSDT}{" "}
//               <img src={usdtIcon} style={{ width: "20px", height: "20px" }} />
//             </div>
//           </div>
//           <div className="item">
//             <div className="label">Phí</div>
//             <div
//               className="info"
//               style={{ display: "flex", gap: "6px", alignItems: "center" }}
//             >
//               {data?.fee}{" "}
//               <img src={usdtIcon} style={{ width: "20px", height: "20px" }} />
//             </div>
//           </div>
//           <div className="item">
//             <div className="label">Người nhận sẽ nhận</div>
//             <div
//               className="info"
//               style={{ display: "flex", gap: "6px", alignItems: "center" }}
//             >
//               {data?.amountUSDT - data?.fee}{" "}
//               <img src={usdtIcon} style={{ width: "20px", height: "20px" }} />
//             </div>
//           </div>
//           <div className="item">
//             <div className="label">Nội dung</div>
//             <div
//               className="info"
//               style={{ display: "flex", gap: "6px", alignItems: "center" }}
//             >
//               {data?.content}{" "}
//             </div>
//           </div>
//         </div>
//         {/* <div className="btn-wrap">
//           <Button className="--bg-green" onClick={handleClick}>
//             Lưu hình ảnh
//           </Button>
//           <Button onClick={handleShareImage}>Chia sẻ</Button>
//         </div> */}
//       </div>
//     </Modal>
//   );
// };
