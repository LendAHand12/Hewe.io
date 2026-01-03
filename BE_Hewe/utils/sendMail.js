require("dotenv").config();
const { sendMailNodemailer } = require("../common/verifyEmail");
const SIB = require("sib-api-v3-sdk");

const SendOTPMail = async function SendOTPMail(receiver) {
  const otpGen = () => {
    return Math.floor(1000 + Math.random() * 9000);
  };

  const oneTimePassword = otpGen();
  const otpCreationTime = new Date();

  // const client = SIB.ApiClient.instance;
  // const apiKey = client.authentications["api-key"];
  // apiKey.apiKey = process.env.SIB_API_KEY;

  // const apiInstance = new SIB.TransactionalEmailsApi();
  // let sendSmtpEmail = new SIB.SendSmtpEmail();

  // sendSmtpEmail = {
  //   sender: {
  //     email: "no-reply@hewe.io",
  //     name: "Hewe.io",
  //   },
  //   to: [
  //     {
  //       email: receiver.toLowerCase(),
  //     },
  //   ],
  //   subject: "Verification Email",
  //   htmlContent: `Your OTP is ${oneTimePassword}. Please use it to verify your account.`,
  // };

  try {
    await sendMailNodemailer(receiver.toLowerCase(), "Verification Email", oneTimePassword);
	  
    return {
      otp: oneTimePassword,
      otpTime: otpCreationTime,
      sendInBlueResponse: true,
    };
  } catch (error) {
    console.error(error);
    return {
      error: error.message,
    };
  }
};

const SendContactEmailToAdmin = async function SendContactEmailToAdmin(contactData) {
  const client = SIB.ApiClient.instance;
  const apiKey = client.authentications["api-key"];
  apiKey.apiKey = process.env.SIB_API_KEY;

  const apiInstance = new SIB.TransactionalEmailsApi();
  let sendSmtpEmail = new SIB.SendSmtpEmail();

  sendSmtpEmail = {
    sender: {
      email: "no-reply@hewe.io",
      name: "Hewe.io",
    },
    to: [
      {
        email: "support@hewe.io",
        // email:"vanshikamandora12@gmail.com"
      },
    ],
    subject: "New Contact Us Form Submission",
    htmlContent: `
            <p>New Contact Us Form Submission:</p>
            <p>Name: ${contactData.name}</p>
            <p>Email: ${contactData.email}</p>
            <p>country_code: ${contactData.country_code}</p>
            <p>phone_number: ${contactData.phone_number}</p>
            <p>Subject: ${contactData.subject}</p>
            <p>Description: ${contactData.description}</p>
        `,
  };

  try {
    const sendInBlueResponse = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("SendInBlue called successfully. Returned data: " + sendInBlueResponse);
    return sendInBlueResponse;
  } catch (error) {
    console.error(error);
    return {
      error: error.message,
    };
  }
};

module.exports = {
  SendOTPMail,
  SendContactEmailToAdmin,
};
