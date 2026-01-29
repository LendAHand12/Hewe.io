require("dotenv").config();
const USER = require("../../model/userModel");
const REFERRAL = require("../../model/referralModel");
const SESSION = require("../../model/sessionModel");
const TRANSACTION_HISTORY = require("../../model/TransactionHistoryModel");
const CONTACT = require("../../model/contactUsModel");
const error = require("../../utils/error");
const bcrypt = require("bcrypt");
const salt = 10;
const JWT = require("jsonwebtoken");
const { SendOTPMail } = require("../../utils/sendMail");
const { SendContactEmailToAdmin } = require("../../utils/sendMail");
function generateUniqueHex() {
  let hex = Math.floor(Math.random() * 0xffffff).toString(16);
  while (hex.length < 7) {
    hex = "0" + hex;
  }
  return hex.toUpperCase();
}

exports.signUp = async (req, res) => {
  try {
    const { name, email, countryCode, phone_number, password, referralCode, LAH_member } = req.body;
    if (!referralCode) {
      const find = await USER.findOne({ email: email.toLowerCase() });
      if (find) {
        return res.status(error.status.emailAlreadyExists).json({
          message: "User Already Exists! Please Login.",
          status: error.status.emailAlreadyExists,
        });
      }
      const hashed = await bcrypt.hash(password, salt);
      const refData = {
        email: email.toLowerCase(),
        password: hashed,
        name: name,
        phone_number: phone_number,
        countryCode: countryCode,
        LAH_member: LAH_member,
      };
      const create = await USER.create(refData);
      // console.log(create)
      if (create) {
        const sendOtp = await SendOTPMail(req.body.email);
        const update = await USER.findOneAndUpdate(
          { email: email.toLowerCase() },
          // {$set:{otp:1234}},
          { $set: { otp: sendOtp.otp, otpTime: sendOtp.otpTime } },
          { new: true }
        );
        const referralCode = generateUniqueHex();
        const referralLink = `https://hewe.io/ref=${referralCode}`;
        const signToken = JWT.sign({ _id: create._id, email: create.email.toLowerCase() }, process.env.SECRET_KEY, {
          expiresIn: "12h",
        });
        const ReferralDetails = await REFERRAL.create({
          access_token: signToken,
          user_id: create._id,
          referralLink: referralLink,
          referralCode: referralCode,
          referralCoins: 0,
          ReceivedHewePrice: 0,
          ReceivedPrice: 0,
        });
        const createSession = await SESSION.create({
          access_token: signToken,
          user_id: create._id,
        });
        return res.status(error.status.OK).json({
          message: "Please Verify Your Mail",
          status: error.status.OK,
          data: create,
          access_Token: signToken,
          ReferralDetails: ReferralDetails,
          referralLink: referralLink,
          referralCode: referralCode,
          Session: createSession,
        });
      }
    }
    const referral = await REFERRAL.findOne({ referralCode: req.body.referralCode });
    if (!referral) {
      return res.status(error.status.BadRequest).json({
        message: "Invalid referral link.",
        status: error.status.BadRequest,
      });
    }
    const find = await USER.findOne({ email: email.toLowerCase() });
    if (find) {
      return res.status(error.status.OK).json({
        message: "User Already Exists! Please Login.",
        status: error.status.OK,
      });
    }
    const hashed = await bcrypt.hash(password, salt);
    const refData = {
      email: email.toLowerCase(),
      password: hashed,
      name: name,
      phone_number: phone_number,
      countryCode: countryCode,
      LAH_member: LAH_member,
    };
    const create = await USER.create(refData);
    if (create) {
      const sendOtp = await SendOTPMail(req.body.email.toLowerCase());
      const update = await USER.findOneAndUpdate(
        { email: email.toLowerCase() },
        // {$set:{otp:1234}},
        { $set: { otp: sendOtp.otp, otpTime: sendOtp.otpTime } },
        { new: true }
      );
      const referralCode = generateUniqueHex();
      const referralLink = `https://hewe.io/ref=${referralCode}`;
      const signToken = JWT.sign({ _id: create._id, email: create.email.toLowerCase() }, process.env.SECRET_KEY, {
        expiresIn: "3h",
      });
      const ReferralDetails = await REFERRAL.create({
        access_token: signToken,
        user_id: create._id,
        referralLink: referralLink,
        referralCode: referralCode,
        ReceivedHewePrice: 0,
        ReceivedPrice: 0,
        referralCoins: 0,
      });
      const createSession = await SESSION.create({
        access_token: signToken,
        user_id: create._id,
      });
      const rewardReferrer = await REFERRAL.findOne({
        user_id: referral.user_id,
      });
      if (rewardReferrer) {
        await REFERRAL.updateOne(
          { user_id: referral.user_id },
          {
            $push: { referredTo: { referredUser_id: create._id } },
          }
        );
      }
      const rewardReferreredUser = await REFERRAL.findOne({
        user_id: create._id,
      });
      if (rewardReferreredUser) {
        await REFERRAL.updateOne({ user_id: create._id }, { referredBy: referral.user_id });
      }

      return res.status(error.status.OK).json({
        message: "Please verify your mail",
        status: error.status.OK,
        data: create,
        access_Token: signToken,
        ReferralDetails: ReferralDetails,
        referralLink: referralLink,
        referralCode: referralCode,
        Session: createSession,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.sendOTP = async (req, res, next) => {
  const { email } = req.body;
  const user = await USER.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(error.status.UnprocessableEntity).json({
      message: "Invalid email id",
      status: error.status.UnprocessableEntity,
    });
  }
  const sendOtp = await SendOTPMail(req.body.email.toLowerCase());
  const update = await USER.findOneAndUpdate(
    { email: email.toLowerCase() },
    // {$set:{otp:1234,otpTime:new Date}},
    { $set: { otp: sendOtp.otp, otpTime: sendOtp.otpTime } },
    { new: true }
  );
  return res.status(error.status.OK).json({
    message: "OTP sent",
    status: error.status.OK,
  });
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const find = await USER.findOne({ email: email.toLowerCase() });
    if (find) {
      const sendOtp = await SendOTPMail(req.body.email.toLowerCase());
      const update = await USER.findOneAndUpdate(
        { email: email.toLowerCase() },
        // {$set:{otp:1234,otpTime:new Date}},
        { $set: { otp: sendOtp.otp, otpTime: sendOtp.otpTime } },
        { new: true }
      );
      return res.status(error.status.OK).send({
        message: "OTP Sent, Please verify.",
        status: error.status.OK,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const findUser = await USER.findOne({ _id: req.user._id });
    if (findUser) {
      if (currentPassword === newPassword) {
        return res.status(error.status.OK).json({
          message: "New password must be different from current password.",
          status: error.status.OK,
        });
      }
      const com_pass = await bcrypt.compare(currentPassword, findUser.password);
      if (com_pass) {
        const hashed = await bcrypt.hash(newPassword, salt);
        const passwordUpdate = await USER.findByIdAndUpdate({ _id: req.user._id }, { password: hashed });
        if (passwordUpdate) {
          return res.status(error.status.OK).json({
            message: "Password Update Successfully.",
            status: error.status.OK,
          });
        }
      }
      return res.status(error.status.UnprocessableEntity).json({
        message: "Current Password is Wrong.",
        status: error.status.UnprocessableEntity,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.otpVerification = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const find = await USER.findOne({ email: email.toLowerCase(), otp: otp });
    if (find) {
      const otpData = find.otpTime;
      const currentTime = new Date();
      const otpCreationTime = new Date(otpData);
      const timeDifference = currentTime - otpCreationTime;
      // const otpExpirationTime = 5 * 60 * 1000; // 5 minutes
      const otpExpirationTime = 30 * 60 * 1000; // 30 minutes

      if (timeDifference <= otpExpirationTime) {
        const verified = await USER.updateOne({ email: email.toLowerCase() }, { isOtpVerified: true });
        if (verified) {
          const signToken = JWT.sign({ _id: find._id, email: email.toLowerCase() }, process.env.SECRET_KEY, {
            expiresIn: "3h",
          });
          const createSession = await SESSION.create({
            access_token: signToken,
            user_id: find._id,
          });
          const findLink = await REFERRAL.findOne({ user_id: find._id });
          return res.status(error.status.OK).json({
            message: "OTP Verified",
            data: find,
            referralDetails: findLink,
            access_Token: signToken,
            Session: createSession,
            status: error.status.OK,
          });
        }
      }
    }

    return res.status(error.status.NotFound).json({
      message: "Invalid OTP",
      status: error.status.NotFound,
    });
  } catch (err) {
    return res.status(error.status.InternalServerError).json({
      message: err.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.setNewPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const find = await USER.findOne({ email: email.toLowerCase(), isOtpVerified: true });
    if (find) {
      const hashed = await bcrypt.hash(newPassword, salt);
      const passwordUpdate = await USER.updateOne({ email: email.toLowerCase() }, { password: hashed });
      if (passwordUpdate) {
        return res.status(error.status.OK).send({
          message: "New password set successfully",
          status: error.status.OK,
        });
      }
      return res.status(error.status.BadRequest).send({
        message: "Unable to set password",
        status: error.status.BadRequest,
      });
    }
  } catch (err) {
    return res.status(error.status.InternalServerError).json({
      message: err.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { password, email, twoFactorToken } = req.body;
    const findUser = await USER.findOne({ email: email.toLowerCase() });
    if (!findUser) {
      return res.status(error.status.NotFound).json({
        message: "No User Found With This Email! Please SignUp.",
        status: error.status.NotFound,
      });
    }
    const isOtpVerifiedUser = await USER.findOne({ email: email.toLowerCase(), isOtpVerified: true });
    if (!isOtpVerifiedUser) {
      return res.status(error.status.verifyEmailId).json({
        message: "Please Verify Your Email.",
        status: error.status.verifyEmailId,
      });
    }
    const com_pass = await bcrypt.compare(password, findUser.password);
    if (!com_pass) {
      return res.status(error.status.UnprocessableEntity).json({
        message: "Password invalid.",
        status: error.status.UnprocessableEntity,
      });
    }

    // Check if 2FA is enabled
    if (findUser.twoFactorEnabled) {
      if (!twoFactorToken) {
        // Return success status with require2FA flag so frontend shows 2FA input
        return res.status(error.status.OK).json({
          message: "Please enter your 2FA code",
          status: error.status.OK,
          require2FA: true,
        });
      }

      // Verify 2FA token
      const speakeasy = require("speakeasy");
      const verified = speakeasy.totp.verify({
        secret: findUser.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorToken,
        window: 2, // Allow ±60 seconds time difference
      });

      if (!verified) {
        return res.status(error.status.UnprocessableEntity).json({
          message: "Invalid 2FA token.",
          status: error.status.UnprocessableEntity,
        });
      }
    }

    // Continue with normal login flow
    const signToken = JWT.sign({ _id: findUser._id, email: findUser.email.toLowerCase() }, process.env.SECRET_KEY, {
      expiresIn: "3h",
    });
    const createSession = await SESSION.create({
      access_token: signToken,
      user_id: findUser._id,
    });
    const find = await REFERRAL.findOne({ user_id: findUser._id });
    return res.status(error.status.OK).json({
      message: "Login Successfully!!",
      status: error.status.OK,
      data: findUser,
      referralDetails: find,
      access_Token: signToken,
      session: createSession,
    });
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.getTransaction = async (req, res) => {
  try {
    const referralCode = req.query.referralCode;
    const findLink = await REFERRAL.findOne({ referralCode: referralCode });
    if (findLink) {
      const find = await USER.findOne({ _id: findLink.user_id });
      const get = await TRANSACTION_HISTORY.find({ referredBy: findLink.user_id });
      if (get.length > 0) {
        const totalDocuments = await TRANSACTION_HISTORY.countDocuments({ referredBy: findLink.user_id });
        return res.status(error.status.OK).send({
          message: "Transactions retrieved successfully.",
          status: error.status.OK,
          data: get,
          totalDocuments: totalDocuments,
        });
      } else {
        return res.status(error.status.NotFound).send({
          message: "No transactions found for this referral link.",
          status: error.status.NotFound,
        });
      }
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.getTotalReward = async (req, res) => {
  try {
    const referralCode = req.query.referralCode;
    const findLink = await REFERRAL.findOne({ referralCode: referralCode });
    if (findLink) {
      return res.status(error.status.OK).json({
        message: "Reward retrieved successfully.",
        status: error.status.OK,
        data: {
          ReceivedHewePrice: findLink.ReceivedHewePrice,
          ReceivedPrice: findLink.ReceivedPrice,
        },
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

// exports.TokenTransactionHistroy = async (req, res) => {
//   try {
//     const { email, from, to, amount_hewe,amount_usd,hash } = req.body;
//     const findUser = await USER.findOne({ email: email.toLowerCase(), isOtpVerified: true })
//     if (findUser) {
//       const findInReferral = await REFERRAL.findOne({ user_id: findUser._id })
//       if (findInReferral) {
//         const findLink = await REFERRAL.findOne({ user_id: findInReferral.referredBy })
//         if (findLink) {
//           if (amount_usd >= 100) {
//             const rewardReferrer = await REFERRAL.updateOne({ user_id: findLink.user_id }, { $inc: { ReceivedPrice: amount_usd * 0.1, ReceivedHewePrice: amount_hewe * 0.05 } })
//             if (rewardReferrer) {
//               const refData = {
//                 email: email.toLowerCase(),
//                 from:from,
//                 to: to,
//                 amount_hewe:amount_hewe,
//                 amount_usd:amount_usd,
//                 hash:hash,
//                 referredBy: findLink.user_id,
//                 rewardPriceReferrer: amount_usd * 0.1,
//                 rewardHeweToReferrer: amount_hewe * 0.05,
//               }
//               const create = await TRANSACTION_HISTORY.create(refData);
//               if (create) {
//                 return res.status(error.status.OK).send({
//                   message: "Transaction History Created Successfully",
//                   status: error.status.OK,
//                   data: create,
//                 });
//               }
//             }
//           }
//           else {
//             const rewardReferrer = await REFERRAL.updateOne({ user_id: findLink.user_id }, { $inc: { ReceivedPrice: amount_usd * 0.05 } })
//             if (rewardReferrer) {
//               const refData = {
//                 email: email.toLowerCase(),
//                 from:from,
//                 to: to,
//                 amount_hewe:amount_hewe,
//                 amount_usd:amount_usd,
//                 hash:hash,
//                 referredBy: findLink.user_id,
//                 rewardPriceReferrer: amount_usd * 0.05,
//                 rewardHeweToReferrer: 0,
//               }
//               const create = await TRANSACTION_HISTORY.create(refData);
//               if (create) {
//                 return res.status(error.status.OK).send({
//                   message: "Transaction History Created Successfully",
//                   status: error.status.OK,
//                   data: create,
//                 });
//               }
//             }

//           }
//         }
//       }
//       const refData = {
//         email: email.toLowerCase(),
//         from:from,
//         to: to,
//         amount_hewe:amount_hewe,
//         amount_usd:amount_usd,
//         hash:hash,
//       }
//       const create = await TRANSACTION_HISTORY.create(refData);
//       if (create) {
//         return res.status(error.status.OK).send({
//           message: "Transaction History Created Successfully",
//           status: error.status.OK,
//           data: create,
//         });
//       }
//     }
//   }
//    catch (e) {
//     return res.status(error.status.InternalServerError).json({
//       message: e.message,
//       status: error.status.InternalServerError,
//     });
//   }
// }

exports.getTokenTransactionHistory = async (req, res) => {
  try {
    const get = await TRANSACTION_HISTORY.find({ email: req.query.email.toLowerCase() });
    if (get.length > 0) {
      return res.status(error.status.OK).send({
        message: "Token Transactions History retrieved successfully.",
        status: error.status.OK,
        data: get,
      });
    } else {
      return res.status(error.status.OK).send({
        message: "No Token Transactions found!",
        status: error.status.OK,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.getAllReferrals = async (req, res) => {
  try {
    const get = await REFERRAL.find({}, { referralCode: 1, _id: 0 });
    if (get.length > 0) {
      return res.status(error.status.OK).send({
        message: "Referral retrieved successfully.",
        status: error.status.OK,
        data: get,
      });
    } else {
      return res.status(error.status.OK).send({
        message: "No Referral found!",
        status: error.status.OK,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.contactUs = async (req, res) => {
  try {
    const { name, email, country_code, phone_number, subject, description } = req.body;
    const refData = {
      name: name,
      email: email.toLowerCase(),
      country_code: country_code,
      phone_number: phone_number,
      subject: subject,
      description: description,
    };
    const contactData = await CONTACT.create(refData);
    const admin = await SendContactEmailToAdmin(contactData);
    console.log(admin, ">>>>");
    return res.status(error.status.OK).send({
      message: "Sent Successfully.",
      status: error.status.OK,
      data: contactData,
    });
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.TokenTransactionHistroy = async (req, res) => {
  try {
    const { email, from, to, amount_hewe, amount_usd, hash } = req.body;
    const findUser = await USER.findOne({ email: email.toLowerCase(), isOtpVerified: true });
    const findInReferral = await REFERRAL.findOne({ user_id: findUser._id });
    if (findInReferral) {
      const findLink = await REFERRAL.findOne({ user_id: findInReferral.referredBy });
      if (findLink) {
        const referrerUser = await USER.findOne({ _id: findLink.user_id });
        if (referrerUser.verifyLAH === false) {
          if (referrerUser.transactionStatus == 0) {
            let rewardToreferrer = await REFERRAL.updateOne(
              { user_id: findLink.user_id },
              { $inc: { ReceivedPrice: req.body.amount_usd * 0 } }
            );
            if (rewardToreferrer) {
              const refData = {
                email: email.toLowerCase(),
                from: from,
                to: to,
                amount_hewe: amount_hewe,
                amount_usd: amount_usd,
                hash: hash,
                referredBy: findLink.user_id,
                rewardPriceReferrer: amount_usd * 0,
                rewardHeweToReferrer: amount_hewe * 0,
              };
              const create = await TRANSACTION_HISTORY.create(refData);
              const getTransactions = await TRANSACTION_HISTORY.find({ email: findUser.email });
              let totalUSD = 0;
              for (let i = 0; i < getTransactions.length; i++) {
                totalUSD += getTransactions[i].amount_usd;
              }
              if (totalUSD < 100) {
                const updateTransactionStatus = await USER.updateOne(
                  { _id: findUser._id },
                  { $set: { transactionStatus: 1 } }
                );
              } else {
                const updateTransactionStatus = await USER.updateOne(
                  { _id: findUser._id },
                  { $set: { transactionStatus: 2 } }
                );
              }
              if (create) {
                return res.status(error.status.OK).send({
                  message: "Transaction History Created Successfully",
                  status: error.status.OK,
                  data: create,
                });
              }
            }
          } else if (referrerUser.transactionStatus == 2) {
            let rewardToreferrer = await REFERRAL.updateOne(
              { user_id: findLink.user_id },
              { $inc: { ReceivedPrice: req.body.amount_usd * 0.1, ReceivedHewePrice: amount_hewe * 0.05 } }
            );
            if (rewardToreferrer) {
              const refData = {
                email: email.toLowerCase(),
                from: from,
                to: to,
                amount_hewe: amount_hewe,
                amount_usd: amount_usd,
                hash: hash,
                referredBy: findLink.user_id,
                rewardPriceReferrer: amount_usd * 0.1,
                rewardHeweToReferrer: amount_hewe * 0.05,
              };
              const create = await TRANSACTION_HISTORY.create(refData);
              const getTransactions = await TRANSACTION_HISTORY.find({ email: findUser.email });
              let totalUSD = 0;
              for (let i = 0; i < getTransactions.length; i++) {
                totalUSD += getTransactions[i].amount_usd;
              }
              if (totalUSD < 100) {
                const updateTransactionStatus = await USER.updateOne(
                  { _id: findUser._id },
                  { $set: { transactionStatus: 1 } }
                );
              } else {
                const updateTransactionStatus = await USER.updateOne(
                  { _id: findUser._id },
                  { $set: { transactionStatus: 2 } }
                );
              }
              if (create) {
                return res.status(error.status.OK).send({
                  message: "Transaction History Created Successfully",
                  status: error.status.OK,
                  data: create,
                });
              }
            }
          } else if (referrerUser.transactionStatus == 1) {
            let rewardToreferrer = await REFERRAL.updateOne(
              { user_id: findLink.user_id },
              { $inc: { ReceivedPrice: req.body.amount_usd * 0.05 } }
            );
            if (rewardToreferrer) {
              const refData = {
                email: email.toLowerCase(),
                from: from,
                to: to,
                amount_hewe: amount_hewe,
                amount_usd: amount_usd,
                hash: hash,
                referredBy: findLink.user_id,
                rewardPriceReferrer: amount_usd * 0.05,
                rewardHeweToReferrer: amount_hewe * 0,
              };
              const create = await TRANSACTION_HISTORY.create(refData);
              const getTransactions = await TRANSACTION_HISTORY.find({ email: findUser.email });
              let totalUSD = 0;
              for (let i = 0; i < getTransactions.length; i++) {
                totalUSD += getTransactions[i].amount_usd;
              }
              if (totalUSD < 100) {
                const updateTransactionStatus = await USER.updateOne(
                  { _id: findUser._id },
                  { $set: { transactionStatus: 1 } }
                );
              } else {
                const updateTransactionStatus = await USER.updateOne(
                  { _id: findUser._id },
                  { $set: { transactionStatus: 2 } }
                );
              }
              if (create) {
                return res.status(error.status.OK).send({
                  message: "Transaction History Created Successfully",
                  status: error.status.OK,
                  data: create,
                });
              }
            }
          }
        } else if (referrerUser.verifyLAH === true) {
          if (referrerUser.transactionStatus == 0) {
            let rewardToreferrer = await REFERRAL.updateOne(
              { user_id: findLink.user_id },
              { $inc: { ReceivedPrice: req.body.amount_usd * 0 } }
            );
            if (rewardToreferrer) {
              const refData = {
                email: email.toLowerCase(),
                from: from,
                to: to,
                amount_hewe: amount_hewe,
                amount_usd: amount_usd,
                hash: hash,
                referredBy: findLink.user_id,
                rewardPriceReferrer: amount_usd * 0,
                rewardHeweToReferrer: amount_hewe * 0,
              };
              const create = await TRANSACTION_HISTORY.create(refData);
              const getTransactions = await TRANSACTION_HISTORY.find({ email: findUser.email });
              let totalUSD = 0;
              for (let i = 0; i < getTransactions.length; i++) {
                totalUSD += getTransactions[i].amount_usd;
              }
              if (totalUSD < 100) {
                const updateTransactionStatus = await USER.updateOne(
                  { _id: findUser._id },
                  { $set: { transactionStatus: 1 } }
                );
              } else {
                const updateTransactionStatus = await USER.updateOne(
                  { _id: findUser._id },
                  { $set: { transactionStatus: 2 } }
                );
              }
              if (create) {
                return res.status(error.status.OK).send({
                  message: "Transaction History Created Successfully",
                  status: error.status.OK,
                  data: create,
                });
              }
            }
          } else if (referrerUser.transactionStatus == 2) {
            let rewardToreferrer = await REFERRAL.updateOne(
              { user_id: findLink.user_id },
              { $inc: { ReceivedPrice: req.body.amount_usd * 0.1, ReceivedHewePrice: amount_hewe * 0.05 } }
            );
            if (rewardToreferrer) {
              const refData = {
                email: email.toLowerCase(),
                from: from,
                to: to,
                amount_hewe: amount_hewe,
                amount_usd: amount_usd,
                hash: hash,
                referredBy: findLink.user_id,
                rewardPriceReferrer: amount_usd * 0.1,
                rewardHeweToReferrer: amount_hewe * 0.05,
              };
              const create = await TRANSACTION_HISTORY.create(refData);
              const getTransactions = await TRANSACTION_HISTORY.find({ email: findUser.email });
              let totalUSD = 0;
              for (let i = 0; i < getTransactions.length; i++) {
                totalUSD += getTransactions[i].amount_usd;
              }
              if (totalUSD < 100) {
                const updateTransactionStatus = await USER.updateOne(
                  { _id: findUser._id },
                  { $set: { transactionStatus: 1 } }
                );
              } else {
                const updateTransactionStatus = await USER.updateOne(
                  { _id: findUser._id },
                  { $set: { transactionStatus: 2 } }
                );
              }
              if (create) {
                return res.status(error.status.OK).send({
                  message: "Transaction History Created Successfully",
                  status: error.status.OK,
                  data: create,
                });
              }
            }
          } else if (referrerUser.transactionStatus == 1) {
            let rewardToreferrer = await REFERRAL.updateOne(
              { user_id: findLink.user_id },
              { $inc: { ReceivedPrice: req.body.amount_usd * 0.05, ReceivedHewePrice: amount_hewe * 0.05 } }
            );
            if (rewardToreferrer) {
              const refData = {
                email: email.toLowerCase(),
                from: from,
                to: to,
                amount_hewe: amount_hewe,
                amount_usd: amount_usd,
                hash: hash,
                referredBy: findLink.user_id,
                rewardPriceReferrer: amount_usd * 0.05,
                rewardHeweToReferrer: amount_hewe * 0.05,
              };
              const create = await TRANSACTION_HISTORY.create(refData);
              const getTransactions = await TRANSACTION_HISTORY.find({ email: findUser.email });
              let totalUSD = 0;
              for (let i = 0; i < getTransactions.length; i++) {
                totalUSD += getTransactions[i].amount_usd;
              }
              if (totalUSD < 100) {
                const updateTransactionStatus = await USER.updateOne(
                  { _id: findUser._id },
                  { $set: { transactionStatus: 1 } }
                );
              } else {
                const updateTransactionStatus = await USER.updateOne(
                  { _id: findUser._id },
                  { $set: { transactionStatus: 2 } }
                );
              }
              if (create) {
                return res.status(error.status.OK).send({
                  message: "Transaction History Created Successfully",
                  status: error.status.OK,
                  data: create,
                });
              }
            }
          }
        }
      }
    }
    const refData = {
      email: email.toLowerCase(),
      from: from,
      to: to,
      amount_hewe: amount_hewe,
      amount_usd: amount_usd,
      hash: hash,
    };
    const create = await TRANSACTION_HISTORY.create(refData);
    const getTransactions = await TRANSACTION_HISTORY.find({ email: findUser.email });
    let totalUSD = 0;
    for (let i = 0; i < getTransactions.length; i++) {
      totalUSD += getTransactions[i].amount_usd;
    }
    if (totalUSD < 100) {
      const updateTransactionStatus = await USER.updateOne({ _id: findUser._id }, { $set: { transactionStatus: 1 } });
    } else {
      const updateTransactionStatus = await USER.updateOne({ _id: findUser._id }, { $set: { transactionStatus: 2 } });
    }
    if (create) {
      return res.status(error.status.OK).send({
        message: "Transaction History Created Successfully",
        status: error.status.OK,
        data: create,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

//  const referralLink = `https://hewe.com/ref=${create._id}/ref=${create.name}`;
