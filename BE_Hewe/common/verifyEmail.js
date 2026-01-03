const nodeMailer = require("nodemailer");
const ejs = require("ejs");
require("dotenv").config();

const adminEmail = "admin@hewe.io";
const adminPassword = "X4YdkwVUQJuET70";
const mailHost = "mail01.123host.vn";
const mailPort = 587;
const HOST = process.env.DOMAIN;
const logo = "https://res.cloudinary.com/dszhslyjq/image/upload/v1720774936/hewe/hewelogo_x59jik.png";

const sendMailNodemailer = async (to, subject, otpCode) => {
  const transporter = nodeMailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false, // true for port 465 (smtps), false otherwise
    auth: {
      user: adminEmail,
      pass: adminPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const html = ejs.render(`<table
    style="
        font-size: 14px;
        font-family: Microsoft Yahei, Arial, Helvetica, sans-serif;
        padding: 0;
        margin: 0;
        color: #333;
        background-color: #f7f7f7;
        background-repeat: repeat-x;
        background-position: bottom left;"
    border="0"
    width="100%"
    cellspacing="0"
    cellpadding="0">
    <tbody>
        <tr>
        <td>
            <table style="max-width: 600px" border="0" cellspacing="0" cellpadding="0" align="center">
            <tbody>
                <tr>
                <td style="padding: 50px 0 10px 0; background: #161616" align="center" valign="middle">
                    <a href="${HOST}" target="_blank" rel="noopener">
                        <img style="border: 0; max-width: 500px" src="${logo}" alt="${HOST}" />
                    </a>
                </td>
                </tr>
                <tr>
                <td>
                    <div style="padding: 0 30px; background: #161616">
                    <table border="0" width="100%" cellspacing="0" cellpadding="0">
                        <tbody>
                        <tr>
                            <td style="font-size: 15px; line-height: 30px; padding: 20px 0; color: #fff">
                            <p>Your OTP is: ${otpCode}. Please use it to verify your account.</p>
                            <div>Thank you!</div>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                </td>
                </tr>
            </tbody>
            </table>
        </td>
        </tr>
    </tbody>
    </table>`);

  const options = {
    from: adminEmail,
    to: to,
    subject: subject,
    html: html,
  };

  return await transporter.sendMail(options);
};

const sendMailWarningHeweDB = async (to, userName, dateString) => {
  const transporter = nodeMailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false, // true for port 465 (smtps), false otherwise
    auth: {
      user: adminEmail,
      pass: adminPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  const html =
    ejs.render(`<div style="font-size: 16px; font-family: sans-serif; line-height: 1.5; background-color: #02071b; color: white; padding: 30px 20px">
	<img src="${logo}" width="80"/>
    
    <p>Xin chào ${userName}</p>
    
     <h4>HEWE.IO xin thông báo về việc gia hạn ký quỹ</h4>

	<ul>
       <li>Thành viên (TV) khi đã tham gia vào hệ thống ký quỹ thời hạn đủ 1 năm.</li>
       <li>Sau 1 năm, các TV muốn gia hạn <b><u>bắt buộc</u></b> phải gia hạn trong vòng 3 ngày từ khi thời hạn kết thúc. (Thời gian được tính 1 năm là 365 ngày tính từ ngày ký quỹ).</li>
    </ul>
    
    <h4>LÃI SUẤT ĐÁO HẠN</h4>
    
    <ul>
       <li>Total ký quỹ từ <= 1999 USDT  - Thời hạn : 1 năm : 10% /Năm</li>
       <li>Total ký quỹ từ <= 1999 USDT  - Thời hạn : 2 năm : 20% /Năm</li>
       <li>Total ký quỹ từ >= 2000 USDT  - Thời hạn : 1 năm : 20% /Năm</li>
       <li>Total ký quỹ từ >= 2000 USDT  - Thời hạn : 2 năm : 30% /Năm</li>
    </ul>
    
    <h4>TRƯỜNG HỢP KHÔNG ĐÁO HẠN</h4>
    
    <ul>
       <li>Hệ thống sẽ <b><u>tự động gia hạn</u></b> với thời hạn <b><u>1 năm</u></b> và lãi suất nhận được sẽ căn cứ theo total USDT đã ký trước đó.</li>
    </ul>
    
     <h4>NGÀY GIA HẠN: ${dateString}</h4>
</div>`);

  const options = {
    from: adminEmail,
    to: to,
    subject: "VỀ VIỆC GIA HẠN KÝ QUỸ HEWE.IO",
    html: html,
  };

  try {
    await transporter.sendMail(options);

    return {
      isSuccess: true,
      data: options,
      error: null,
    };
  } catch (error) {
    return {
      isSuccess: false,
      data: null,
      error: error.message,
    };
  }
};

module.exports = {
  sendMailNodemailer,
  sendMailWarningHeweDB,
};
