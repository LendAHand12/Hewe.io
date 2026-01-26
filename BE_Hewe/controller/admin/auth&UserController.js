const ADMIN = require("../../model/adminModel");
const SESSION = require("../../model/sessionModel");
const CONTACT = require("../../model/contactUsModel");
const REFERRAL = require("../../model/referralModel");
const USER = require("../../model/userModel");
const TRANSACTION_HISTORY = require("../../model/TransactionHistoryModel");
const PAID = require("../../model/paidUserModel");
const error = require("../../utils/error");
const JWT = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const speakeasy = require("speakeasy");
const salt = 10;
const mongoose = require("mongoose");

exports.adminLogin = async (req, res) => {
  try {
    const { password, email, twoFactorToken } = req.body;
    const findAdmin = await ADMIN.findOne({ email: email.toLowerCase() })
      .populate("access_module")
      .populate("permissions");

    if (!findAdmin) {
      return res.status(error.status.UnprocessableEntity).json({
        message: "Email Id Invalid.",
        status: error.status.UnprocessableEntity,
      });
    }

    const com_pass = await bcrypt.compare(password, findAdmin.password);
    if (!com_pass) {
      return res.status(error.status.UnprocessableEntity).json({
        message: "Password invalid.",
        status: error.status.UnprocessableEntity,
      });
    }

    // Check if 2FA is enabled
    if (findAdmin.twoFactorEnabled) {
      if (!twoFactorToken) {
        // Return success status with require2FA flag so frontend shows 2FA input
        return res.status(error.status.OK).json({
          message: "Please enter your 2FA code",
          status: error.status.OK,
          require2FA: true, // Flag for frontend to show 2FA input
        });
      }

      // Verify 2FA token
      const verified = speakeasy.totp.verify({
        secret: findAdmin.twoFactorSecret,
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
    const signToken = JWT.sign({ _id: findAdmin._id, email: findAdmin.email.toLowerCase() }, process.env.SECRET_KEY);
    const createSession = await SESSION.create({
      access_token: signToken,
      admin_id: findAdmin._id,
    });
    return res.status(error.status.OK).json({
      message: "Login Successfully.",
      status: error.status.OK,
      data: {
        email: findAdmin.email,
        role: findAdmin.role,
        access_module: findAdmin.access_module,
        permissions: findAdmin.permissions,
      },
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

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const findUser = await ADMIN.findOne({ _id: req.loginAdmin._id });
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
        const passwordUpdate = await ADMIN.findByIdAndUpdate({ _id: req.loginAdmin._id }, { password: hashed });
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

exports.adminLogout = async (req, res) => {
  const admin_id = req.loginAdmin._id;
  const access_token = req.adminToken;
  await SESSION.deleteOne({ admin_id: admin_id, access_token: access_token });
  return res.status(error.status.OK).json({
    message: "Logout",
  });
};

exports.getAllUsers = async (req, res) => {
  try {
    let page = Number(req.query.page) || 0;
    let limit = Number(req.query.limit) || 100;
    let skip = page * limit;
    const totalDocuments = await USER.countDocuments();
    const Users = await USER.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $lookup: {
          from: "referrals",
          localField: "_id",
          foreignField: "user_id",
          as: "referredDetails",
        },
      },
      {
        $lookup: {
          from: "transactionhistories",
          localField: "email",
          foreignField: "email",
          as: "transactionListDetails",
        },
      },
    ]);
    if (Users.length > 0) {
      const totalPages = Math.ceil(totalDocuments / limit);
      for (let i = 0; i < Users.length; i++) {
        Users[i].total_transactions = Users[i].transactionListDetails.length;
        let totalReferredTo = 0;
        for (let j = 0; j < Users[i].referredDetails.length; j++) {
          totalReferredTo += Users[i].referredDetails[j].referredTo.length;
        }
        Users[i].total_referredTo = totalReferredTo;
      }
      return res.status(error.status.OK).json({
        message: "User Get successfully!.",
        status: error.status.OK,
        data: Users,
        totalPages: totalPages,
        totalDocuments: totalDocuments,
      });
    } else {
      return res.status(error.status.OK).json({
        message: "No User found!",
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

exports.getUserTransaction = async (req, res) => {
  try {
    let page = Number(req.query.page) || 0;
    let limit = Number(req.query.limit) || 100;
    let skip = page * limit;
    const totalDocuments = await TRANSACTION_HISTORY.countDocuments({ email: req.query.email.toLowerCase() });
    const get = await TRANSACTION_HISTORY.find({ email: req.query.email.toLowerCase() })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    if (get.length > 0) {
      let totalUSD = 0;
      let totalHEWE = 0;

      for (let i = 0; i < get.length; i++) {
        totalUSD += get[i].amount_usd;
        totalHEWE += get[i].amount_hewe;
      }
      return res.status(error.status.OK).json({
        message: "Token Transactions History retrieved successfully.",
        status: error.status.OK,
        totalDocument: totalDocuments,
        total_amount_usd: totalUSD,
        total_amount_hewe: totalHEWE,
        data: get,
        totalPages: Math.ceil(totalDocuments / limit),
      });
    } else {
      return res.status(error.status.OK).json({
        message: "No Token Transactions found!",
        status: error.status.OK,
        totalDocument: totalDocuments,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.getUserReferrels = async (req, res) => {
  try {
    const userID = req.query._id;
    let page = Number(req.query.page) || 0;
    let limit = Number(req.query.limit) || 100;
    let skip = page * limit;
    // const totalDocuments = await TRANSACTION_HISTORY.countDocuments({ email: req.query._id.toLowerCase() });
    const find = await REFERRAL.findOne({ user_id: new mongoose.Types.ObjectId(userID) });
    const referredToCount = await REFERRAL.aggregate([
      {
        $match: { user_id: new mongoose.Types.ObjectId(userID) },
      },
      {
        $unwind: "$referredTo",
      },
      {
        $count: "total",
      },
    ]);
    const referralDetails = await REFERRAL.aggregate([
      {
        $match: { user_id: new mongoose.Types.ObjectId(userID) },
      },
      {
        $unwind: "$referredTo",
      },
      {
        $lookup: {
          from: "users",
          localField: "referredTo.referredUser_id",
          foreignField: "_id",
          as: "referredUserDetails",
        },
      },
    ])
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    if (referralDetails.length > 0) {
      for (let i = 0; i < referralDetails.length; i++) {
        const referredUserDetails = referralDetails[i].referredUserDetails[0];
        if (referredUserDetails) {
          const transactions = await TRANSACTION_HISTORY.find({ email: referredUserDetails.email });
          let totalRewardHeweToReferrer = 0;
          let totalRewardPriceReferrer = 0;
          transactions.forEach((transaction) => {
            totalRewardHeweToReferrer += transaction.rewardHeweToReferrer || 0;
            totalRewardPriceReferrer += transaction.rewardPriceReferrer || 0;
          });

          referralDetails[i].referredUserDetails[0].transactions = transactions;
          referralDetails[i].referredUserDetails[0].totalTransactions = transactions.length;
          referralDetails[i].referredUserDetails[0].totalRewardHeweToReferrer = totalRewardHeweToReferrer;
          referralDetails[i].referredUserDetails[0].totalRewardPriceReferrer = totalRewardPriceReferrer;
        }
      }

      return res.status(error.status.OK).json({
        message: "User Get successfully!.",
        status: error.status.OK,
        data: referralDetails,
        heweReward: find.ReceivedHewePrice,
        priceReward: find.ReceivedPrice,
        totalPages: Math.ceil(referredToCount[0].total / limit),
        totalDocuments: referredToCount[0].total,
      });
    } else {
      return res.status(error.status.OK).json({
        message: "No referrals found for this user.",
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

exports.getAllContacts = async (req, res) => {
  try {
    let page = Number(req.query.page) || 0;
    let limit = Number(req.query.limit) || 100;
    let skip = page * limit;
    const totalDocuments = await CONTACT.countDocuments();
    const contacts = await CONTACT.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    if (contacts.length > 0) {
      return res.status(error.status.OK).json({
        message: "Contacts Get Successfully!!",
        status: error.status.OK,
        data: contacts,
        totalDocuments: totalDocuments,
        totalPages: Math.ceil(totalDocuments / limit),
      });
    }
    return res.status(error.status.OK).json({
      message: "NOT FOUND!!",
      status: error.status.OK,
      data: contacts,
    });
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.paidUser = async (req, res) => {
  try {
    const { user_id, totalPaid_USDT, transactionHash_USDT, totalPaid_HEWE, transactionHash_HEWE, paidType } = req.body;
    const findRef = await REFERRAL.findOne({ user_id: user_id });
    const find = await USER.findOne({ _id: user_id });
    if (find) {
      if (paidType === "USDT") {
        // if(totalPaid_USDT>findRef.ReceivedPrice){
        //   return res.status(error.status.BadRequest).json({
        //     message: "Payment amount exceeds the reward amount!!",
        //     status: error.status.BadRequest,
        //   });
        // }
        updateObj = {
          $inc: { totalPaid_USDT: +totalPaid_USDT },
          $set: { transactionHash_USDT: transactionHash_USDT },
        };
        const updateUser = await USER.findOneAndUpdate(
          { _id: user_id },
          { $inc: { totalPaid_USDT: +totalPaid_USDT } },
          { new: true, upsert: true }
        );
        const paidUser = await PAID.findOneAndUpdate({ user_id: user_id }, updateObj, { new: true, upsert: true });
        if (paidUser) {
          return res.status(error.status.OK).json({
            message: "USDT Sent Successfully!!",
            status: error.status.OK,
            data: paidUser,
          });
        }
      } else if (paidType === "HEWE") {
        updateObj = {
          $inc: { totalPaid_HEWE: +totalPaid_HEWE },
          $set: { transactionHash_HEWE: transactionHash_HEWE },
        };
        const updateUser = await USER.findOneAndUpdate(
          { _id: user_id },
          { $inc: { totalPaid_HEWE: +totalPaid_HEWE } },
          { new: true, upsert: true }
        );
        const paidUserHewe = await PAID.findOneAndUpdate({ user_id: user_id }, updateObj, { new: true, upsert: true });
        if (paidUserHewe) {
          return res.status(error.status.OK).json({
            message: "HEWE Sent Successfully!!",
            status: error.status.OK,
            data: paidUserHewe,
          });
        }
      } else {
        return res.status(error.status.UnprocessableEntity).json({
          message: "Invalid Paid Type!!",
          status: error.status.UnprocessableEntity,
        });
      }
    }
    return res.status(error.status.NotFound).json({
      message: "No User Found!!",
      status: error.status.NotFound,
    });
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.getAllTransaction = async (req, res) => {
  try {
    let page = Number(req.query.page) || 0;
    let limit = Number(req.query.limit) || 100;
    let skip = page * limit;
    const totalDocuments = await TRANSACTION_HISTORY.countDocuments();
    const get = await TRANSACTION_HISTORY.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    if (get.length > 0) {
      return res.status(error.status.OK).json({
        message: "Token Transactions History retrieved successfully.",
        status: error.status.OK,
        totalDocument: totalDocuments,
        data: get,
        totalPages: Math.ceil(totalDocuments / limit),
      });
    } else {
      return res.status(error.status.OK).json({
        message: "No Token Transactions found!",
        status: error.status.OK,
        totalDocument: totalDocuments,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.verifyLAH = async (req, res) => {
  try {
    const find = await USER.findOne({ _id: req.query._id });
    if (find) {
      if (find.LAH_member && find.verifyLAH == false) {
        const addLAH = await USER.updateOne({ _id: req.query._id }, { $set: { verifyLAH: true } });
        if (addLAH) {
          return res.status(error.status.OK).json({
            message: "LAH Member Verified!",
            status: error.status.OK,
          });
        } else {
          return res.status(error.status.Forbidden).json({
            message: "Already Verified LAH Member!",
            status: error.status.Forbidden,
          });
        }
      } else {
        return res.status(error.status.OK).json({
          message: "No LAH Member Found!",
          status: error.status.OK,
        });
      }
    } else {
      return res.status(error.status.NotFound).json({
        message: "User not found!",
        status: error.status.NotFound,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.addLAHMember = async (req, res) => {
  try {
    const { LAH_member } = req.body;
    const find = await USER.findOne({ _id: req.query._id });
    if (find) {
      if (!find.LAH_member && find.verifyLAH == false) {
        const addLAH = await USER.updateOne(
          { _id: req.query._id },
          { $set: { LAH_member: req.body.LAH_member, verifyLAH: true } }
        );
        if (addLAH) {
          return res.status(error.status.OK).json({
            message: "LAH Member Added!",
            status: error.status.OK,
          });
        } else {
          return res.status(error.status.Forbidden).json({
            message: "Unable to add LAH Member!",
            status: error.status.Forbidden,
          });
        }
      }
      return res.status(error.status.Forbidden).json({
        message: "Already have LAH Member!!",
        status: error.status.Forbidden,
      });
    } else {
      return res.status(error.status.NotFound).json({
        message: "User not found!",
        status: error.status.NotFound,
      });
    }
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const { search } = req.query;
    const regexPattern = `${search}`;
    const findSearch = await USER.aggregate([
      {
        $match: {
          $or: [
            { email: { $regex: regexPattern, $options: "i" } },
            { walletAddress: { $regex: regexPattern, $options: "i" } }
          ]
        },
      },
      {
        $lookup: {
          from: "referrals",
          localField: "_id",
          foreignField: "user_id",
          as: "referredDetails",
        },
      },
      {
        $lookup: {
          from: "transactionhistories",
          localField: "email",
          foreignField: "email",
          as: "transactionListDetails",
        },
      },
    ]);

    if (findSearch.length > 0) {
      findSearch.forEach((user) => {
        user.total_transactions = user.transactionListDetails.length;
        let totalReferredTo = 0;
        user.referredDetails.forEach((referral) => {
          totalReferredTo += referral.referredTo.length;
        });
        user.total_referredTo = totalReferredTo;
      });

      return res.status(error.status.OK).json({
        message: "User Get successfully!.",
        status: error.status.OK,
        data: findSearch,
      });
    }
    return res.status(error.status.OK).json({
      message: "User not found!",
      status: error.status.OK,
      data: [],
    });
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

exports.searchContact = async (req, res) => {
  try {
    const { search } = req.query;
    const regexPattern = `${search}`;
    const findSearch = await CONTACT.find({ email: { $regex: regexPattern, $options: "i" } });
    if (findSearch.length > 0) {
      return res.status(error.status.OK).json({
        message: "Contacts found successfully!",
        status: error.status.OK,
        data: findSearch,
      });
    }
    return res.status(error.status.OK).json({
      message: "Contacts not found!",
      status: error.status.OK,
      data: [],
    });
  } catch (e) {
    return res.status(error.status.InternalServerError).json({
      message: e.message,
      status: error.status.InternalServerError,
    });
  }
};

// exports.addTransactionUser=async(req,res)=>{
//   try{
//     const { email, from, to, amount_hewe, amount_usd, hash,date} = req.body;
//     const findUser = await USER.findOne({ email: email.toLowerCase(), isOtpVerified: true })
//     if (!findUser) {
//       return res.status(error.status.NotFound).json({
//         message: "User not found or not verified.",
//         status: error.status.NotFound
//       });
//     }
//     const findInReferral = await REFERRAL.findOne({ user_id: findUser._id })
//     if (findInReferral) {
//       const findLink = await REFERRAL.findOne({ user_id: findInReferral.referredBy })
//       if (findLink) {
//         const referrerUser = await USER.findOne({ _id: findLink.user_id })
//         if (referrerUser.verifyLAH === false) {
//           if (referrerUser.transactionStatus == 0) {
//             let rewardToreferrer = await REFERRAL.updateOne({ user_id: findLink.user_id }, { $inc: { ReceivedPrice: req.body.amount_usd * 0 } });
//             if (rewardToreferrer) {
//               const refData = {
//                 email: email.toLowerCase(),
//                 from: from,
//                 to: to,
//                 amount_hewe: amount_hewe,
//                 amount_usd: amount_usd,
//                 hash: hash,
//                 createdAt:date,
//                 referredBy: findLink.user_id,
//                 rewardPriceReferrer: amount_usd * 0,
//               }
//               const create = await TRANSACTION_HISTORY.create(refData);
//               const getTransactions = await TRANSACTION_HISTORY.find({ email: findUser.email });
//               let totalUSD = 0;
//               for (let i = 0; i < getTransactions.length; i++) {
//                 totalUSD += getTransactions[i].amount_usd;
//               }
//               if(totalUSD<100){
//                 const updateTransactionStatus = await USER.updateOne({ _id: findUser._id }, { $set: { transactionStatus: 1 } })
//               }else{
//                 const updateTransactionStatus = await USER.updateOne({ _id: findUser._id }, { $set: { transactionStatus: 2} })
//               }
//               if (create) {
//                 return res.status(error.status.OK).send({
//                   message: "Transaction History Created Successfully",
//                   status: error.status.OK,
//                   data: create,
//                 });
//               }
//             }
//           } else if(referrerUser.transactionStatus==2) {
//             let rewardToreferrer = await REFERRAL.updateOne({ user_id: findLink.user_id }, { $inc: { ReceivedPrice: req.body.amount_usd * 0.1, ReceivedHewePrice: amount_hewe * 0.05 } });
//             if (rewardToreferrer) {
//               const refData = {
//                 email: email.toLowerCase(),
//                 from: from,
//                 to: to,
//                 amount_hewe: amount_hewe,
//                 amount_usd: amount_usd,
//                 hash: hash,
//                 createdAt:date,
//                 referredBy: findLink.user_id,
//                 rewardPriceReferrer: amount_usd * 0.1,
//                 rewardHeweToReferrer: amount_hewe * 0.05,
//               }
//               const create = await TRANSACTION_HISTORY.create(refData);
//               const getTransactions = await TRANSACTION_HISTORY.find({ email: findUser.email });
//               let totalUSD = 0;
//               for (let i = 0; i < getTransactions.length; i++) {
//                 totalUSD += getTransactions[i].amount_usd;
//               }
//               if(totalUSD<100){
//                 const updateTransactionStatus = await USER.updateOne({ _id: findUser._id }, { $set: { transactionStatus: 1 } })
//               }else{
//                 const updateTransactionStatus = await USER.updateOne({ _id: findUser._id }, { $set: { transactionStatus: 2} })
//               }
//               if (create) {
//                 return res.status(error.status.OK).send({
//                   message: "Transaction History Created Successfully",
//                   status: error.status.OK,
//                   data: create,
//                 });
//               }
//             }
//           } else if (referrerUser.transactionStatus==1) {
//             let rewardToreferrer = await REFERRAL.updateOne({ user_id: findLink.user_id }, { $inc: { ReceivedPrice: req.body.amount_usd * 0.05 } });
//             if (rewardToreferrer) {
//               const refData = {
//                 email: email.toLowerCase(),
//                 from: from,
//                 to: to,
//                 amount_hewe: amount_hewe,
//                 amount_usd: amount_usd,
//                 hash: hash,
//                 createdAt:date,
//                 referredBy: findLink.user_id,
//                 rewardPriceReferrer: amount_usd * 0.05,
//               }
//               const create = await TRANSACTION_HISTORY.create(refData);
//               const getTransactions = await TRANSACTION_HISTORY.find({ email: findUser.email });
//               let totalUSD = 0;
//               for (let i = 0; i < getTransactions.length; i++) {
//                 totalUSD += getTransactions[i].amount_usd;
//               }
//               if(totalUSD<100){
//                 const updateTransactionStatus = await USER.updateOne({ _id: findUser._id }, { $set: { transactionStatus: 1 } })
//               }else{
//                 const updateTransactionStatus = await USER.updateOne({ _id: findUser._id }, { $set: { transactionStatus: 2} })
//               }
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
//         else if (referrerUser.verifyLAH === true) {
//           if (referrerUser.transactionStatus==0) {
//             let rewardToreferrer = await REFERRAL.updateOne({ user_id: findLink.user_id }, { $inc: { ReceivedPrice: req.body.amount_usd * 0 } });
//             if (rewardToreferrer) {
//               const refData = {
//                 email: email.toLowerCase(),
//                 from: from,
//                 to: to,
//                 amount_hewe: amount_hewe,
//                 amount_usd: amount_usd,
//                 hash: hash,
//                 createdAt:date,
//                 referredBy: findLink.user_id,
//                 rewardPriceReferrer: amount_usd * 0
//               }
//               const create = await TRANSACTION_HISTORY.create(refData);
//               const getTransactions = await TRANSACTION_HISTORY.find({ email: findUser.email });
//               let totalUSD = 0;
//               for (let i = 0; i < getTransactions.length; i++) {
//                 totalUSD += getTransactions[i].amount_usd;
//               }
//               if(totalUSD<100){
//                 const updateTransactionStatus = await USER.updateOne({ _id: findUser._id }, { $set: { transactionStatus: 1 } })
//               }else{
//                 const updateTransactionStatus = await USER.updateOne({ _id: findUser._id }, { $set: { transactionStatus: 2} })
//               }
//               if (create) {
//                 return res.status(error.status.OK).send({
//                   message: "Transaction History Created Successfully",
//                   status: error.status.OK,
//                   data: create,
//                 });
//               }
//             }
//           } else if (referrerUser.transactionStatus==2) {
//             let rewardToreferrer = await REFERRAL.updateOne({ user_id: findLink.user_id }, { $inc: { ReceivedPrice: req.body.amount_usd * 0.1 , ReceivedHewePrice: amount_hewe * 0.05 } });
//             if (rewardToreferrer) {
//               const refData = {
//                 email: email.toLowerCase(),
//                 from: from,
//                 to: to,
//                 amount_hewe: amount_hewe,
//                 amount_usd: amount_usd,
//                 hash: hash,
//                 createdAt:date,
//                 referredBy: findLink.user_id,
//                 rewardPriceReferrer: amount_usd * 0.1,
//                 rewardHeweToReferrer: amount_hewe * 0.05,
//               }
//               const create = await TRANSACTION_HISTORY.create(refData);
//               const getTransactions = await TRANSACTION_HISTORY.find({ email: findUser.email });
//               let totalUSD = 0;
//               for (let i = 0; i < getTransactions.length; i++) {
//                 totalUSD += getTransactions[i].amount_usd;
//               }
//               if(totalUSD<100){
//                 const updateTransactionStatus = await USER.updateOne({ _id: findUser._id }, { $set: { transactionStatus: 1 } })
//               }else{
//                 const updateTransactionStatus = await USER.updateOne({ _id: findUser._id }, { $set: { transactionStatus: 2} })
//               }
//               if (create) {
//                 return res.status(error.status.OK).send({
//                   message: "Transaction History Created Successfully",
//                   status: error.status.OK,
//                   data: create,
//                 });
//               }
//             }
//           } else if(referrerUser.transactionStatus==1) {
//             let rewardToreferrer = await REFERRAL.updateOne({ user_id: findLink.user_id }, { $inc: { ReceivedPrice: req.body.amount_usd * 0.05, ReceivedHewePrice: amount_hewe * 0.05 } });
//             if (rewardToreferrer) {
//               const refData = {
//                 email: email.toLowerCase(),
//                 from: from,
//                 to: to,
//                 amount_hewe: amount_hewe,
//                 amount_usd: amount_usd,
//                 hash: hash,
//                 createdAt:date,
//                 referredBy: findLink.user_id,
//                 rewardPriceReferrer: amount_usd * 0.05,
//                 rewardHeweToReferrer: amount_hewe * 0.05,
//               }
//               const create = await TRANSACTION_HISTORY.create(refData);
//               const getTransactions = await TRANSACTION_HISTORY.find({ email: findUser.email });
//               let totalUSD = 0;
//               for (let i = 0; i < getTransactions.length; i++) {
//                 totalUSD += getTransactions[i].amount_usd;
//               }
//               if(totalUSD<100){
//                 const updateTransactionStatus = await USER.updateOne({ _id: findUser._id }, { $set: { transactionStatus: 1 } })
//               }else{
//                 const updateTransactionStatus = await USER.updateOne({ _id: findUser._id }, { $set: { transactionStatus: 2} })
//               }
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
//     }
//     const refData = {
//       email: email.toLowerCase(),
//       from: from,
//       to: to,
//       amount_hewe: amount_hewe,
//       amount_usd: amount_usd,
//       hash: hash,
//       createdAt:date,
//     }
//     const create = await TRANSACTION_HISTORY.create(refData);
//     const getTransactions = await TRANSACTION_HISTORY.find({ email: findUser.email });
//     let totalUSD = 0;
//     for (let i = 0; i < getTransactions.length; i++) {
//       totalUSD += getTransactions[i].amount_usd;
//     }
//     if(totalUSD<100){
//       const updateTransactionStatus = await USER.updateOne({ _id: findUser._id }, { $set: { transactionStatus: 1 } })
//     }else{
//       const updateTransactionStatus = await USER.updateOne({ _id: findUser._id }, { $set: { transactionStatus: 2} })
//     }
//     if (create) {
//       return res.status(error.status.OK).send({
//         message: "Transaction History Created Successfully",
//         status: error.status.OK,
//         data: create,
//       });
//     }

//   }catch (e) {
//     return res.status(error.status.InternalServerError).json({
//       message: e.message,
//       status: error.status.InternalServerError,
//     });
//   }
// }

exports.addTransactionUser = async (req, res) => {
  try {
    const { email, from, to, amount_hewe, amount_usd, hash, date } = req.body;
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
                createdAt: date,
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
                createdAt: date,
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
                createdAt: date,
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
                createdAt: date,
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
                createdAt: date,
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
                createdAt: date,
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
      createdAt: date,
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

exports.getReferralZeroTransaction = async (req, res) => {
  try {
    const userID = req.query._id;
    const find = await REFERRAL.findOne({ user_id: new mongoose.Types.ObjectId(userID) });
    const referralDetails = await REFERRAL.aggregate([
      {
        $match: { user_id: new mongoose.Types.ObjectId(userID) },
      },
      {
        $unwind: "$referredTo",
      },
      {
        $lookup: {
          from: "users",
          localField: "referredTo.referredUser_id",
          foreignField: "_id",
          as: "referredUserDetails",
        },
      },
    ]).sort({ createdAt: -1 });

    if (referralDetails.length > 0) {
      for (let i = 0; i < referralDetails.length; i++) {
        const referredUserDetails = referralDetails[i].referredUserDetails[0];
        if (referredUserDetails) {
          const transactions = await TRANSACTION_HISTORY.find({ email: referredUserDetails.email });
          let totalRewardHeweToReferrer = 0;
          let totalRewardPriceReferrer = 0;
          transactions.forEach((transaction) => {
            totalRewardHeweToReferrer += transaction.rewardHeweToReferrer;
            totalRewardPriceReferrer += transaction.rewardPriceReferrer;
          });

          referralDetails[i].referredUserDetails[0].transactions = transactions;
          referralDetails[i].referredUserDetails[0].totalTransactions = transactions.length;
          referralDetails[i].referredUserDetails[0].totalRewardHeweToReferrer = totalRewardHeweToReferrer;
          referralDetails[i].referredUserDetails[0].totalRewardPriceReferrer = totalRewardPriceReferrer;
        }
      }
      const zeroTransactionReferrals = referralDetails.filter(
        (detail) => detail.referredUserDetails[0].totalTransactions === 0
      );

      return res.status(error.status.OK).json({
        message: "User Get successfully!.",
        status: error.status.OK,
        data: zeroTransactionReferrals,
        heweReward: find.ReceivedHewePrice,
        priceReward: find.ReceivedPrice,
      });
    } else {
      return res.status(error.status.OK).json({
        message: "No referrals found for this user.",
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

exports.getReferralNoZeroTransaction = async (req, res) => {
  try {
    const userID = req.query._id;
    const find = await REFERRAL.findOne({ user_id: new mongoose.Types.ObjectId(userID) });
    const referralDetails = await REFERRAL.aggregate([
      {
        $match: { user_id: new mongoose.Types.ObjectId(userID) },
      },
      {
        $unwind: "$referredTo",
      },
      {
        $lookup: {
          from: "users",
          localField: "referredTo.referredUser_id",
          foreignField: "_id",
          as: "referredUserDetails",
        },
      },
    ]).sort({ createdAt: -1 });

    if (referralDetails.length > 0) {
      for (let i = 0; i < referralDetails.length; i++) {
        const referredUserDetails = referralDetails[i].referredUserDetails[0];
        if (referredUserDetails) {
          const transactions = await TRANSACTION_HISTORY.find({ email: referredUserDetails.email });
          let totalRewardHeweToReferrer = 0;
          let totalRewardPriceReferrer = 0;
          transactions.forEach((transaction) => {
            totalRewardHeweToReferrer += transaction.rewardHeweToReferrer;
            totalRewardPriceReferrer += transaction.rewardPriceReferrer;
          });

          referralDetails[i].referredUserDetails[0].transactions = transactions;
          referralDetails[i].referredUserDetails[0].totalTransactions = transactions.length;
          referralDetails[i].referredUserDetails[0].totalRewardHeweToReferrer = totalRewardHeweToReferrer;
          referralDetails[i].referredUserDetails[0].totalRewardPriceReferrer = totalRewardPriceReferrer;
        }
      }
      const zeroTransactionReferrals = referralDetails.filter(
        (detail) => detail.referredUserDetails[0].totalTransactions > 0
      );

      return res.status(error.status.OK).json({
        message: "User Get successfully!.",
        status: error.status.OK,
        data: zeroTransactionReferrals,
        heweReward: find.ReceivedHewePrice,
        priceReward: find.ReceivedPrice,
      });
    } else {
      return res.status(error.status.OK).json({
        message: "No referrals found for this user.",
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

// exports.adminSignUp = async (req, res) => {
//     try {
//       const { email, password} = req.body;
//       const hashed = await bcrypt.hash(password, salt);
//       const refData = {
//         email: email,
//         password: hashed,
//       };
//       const createAdmin = await ADMIN.create(refData);
//       if (createAdmin) {
//         return res.status(error.status.OK).send({
//           message: "admin create Successfully.",
//           status: error.status.OK,
//           data: createAdmin,
//         });
//       }
//     } catch (e) {
//       return res.status(error.status.InternalServerError).json({
//         message: e.message,
//         status: error.status.InternalServerError,
//       });
//     }
//   };

// status update
exports.updateUserStatus = async (req, res) => {
  try {
    // const allUsers = await USER.find();
    const allUsers = await USER.find({
      createdAt: {
        $gte: new Date("2024-04-19"),
      },
    });
    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i];
      const userTransactions = await TRANSACTION_HISTORY.find({ email: user.email });
      let totalUSD = 0;
      for (let j = 0; j < userTransactions.length; j++) {
        totalUSD += userTransactions[j].amount_usd;
      }
      let transactionStatus;
      if (totalUSD === 0) {
        transactionStatus = 0;
      } else if (totalUSD < 100) {
        transactionStatus = 1;
      } else {
        transactionStatus = 2;
      }
      await USER.findByIdAndUpdate(user._id, { transactionStatus: transactionStatus });
    }
    return res.status(200).json({
      message: "User status updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
};

// trans update
exports.updateUserReferralRewards = async (req, res) => {
  try {
    // const allTransactions = await TRANSACTION_HISTORY.find();
    const allTransactions = await TRANSACTION_HISTORY.find({
      createdAt: {
        $gte: new Date("2024-04-19"),
      },
    });

    for (let i = 0; i < allTransactions.length; i++) {
      const transaction = allTransactions[i];
      const user = await USER.findOne({ _id: transaction.referredBy });

      if (!user) {
        // If no user found, log an error and skip to the next transaction
        console.log(`No user found with _id: ${transaction.referredBy}`);
        continue;
      }
      let { amount_usd, amount_hewe } = transaction;
      let rewardPriceReferrer = 0;
      let rewardHeweToReferrer = 0;
      if (user.verifyLAH === false) {
        if (user.transactionStatus === 0) {
          rewardPriceReferrer = amount_usd * 0;
        } else if (user.transactionStatus === 1) {
          rewardPriceReferrer = amount_usd * 0.05;
        } else if (user.transactionStatus === 2) {
          rewardPriceReferrer = amount_usd * 0.1;
          rewardHeweToReferrer = amount_hewe * 0.05;
        }
      } else if (user.verifyLAH === true) {
        if (user.transactionStatus === 0) {
          rewardPriceReferrer = amount_usd * 0;
        } else if (user.transactionStatus === 1) {
          rewardPriceReferrer = amount_usd * 0.05;
          rewardHeweToReferrer = amount_hewe * 0.05;
        } else if (user.transactionStatus === 2) {
          rewardPriceReferrer = amount_usd * 0.1;
          rewardHeweToReferrer = amount_hewe * 0.05;
        }
      }
      await TRANSACTION_HISTORY.findByIdAndUpdate(transaction._id, {
        rewardPriceReferrer: rewardPriceReferrer,
        rewardHeweToReferrer: rewardHeweToReferrer,
      });
    }

    return res.status(200).json({
      message: "Transaction rewards and referral rewards updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
};

//reset referral
exports.resetReferralRewards = async (req, res) => {
  try {
    const user = await USER.find({
      createdAt: {
        $gte: new Date("2024-04-19"),
      },
    });
    if (user) {
      const Update = await REFERRAL.updateMany({}, { $set: { ReceivedPrice: 0, ReceivedHewePrice: 0 } });
      if (Update) {
        return res.status(200).json({
          mess: "Referral rewards reset successfully",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
};

// referral update
exports.updateUserReferralRewardsReferral = async (req, res) => {
  try {
    // const allUsers = await USER.find();
    const allUsers = await USER.find({
      createdAt: {
        $gte: new Date("2024-04-19"),
      },
    });
    for (let i = 0; i < allUsers.length; i++) {
      const user = allUsers[i];
      const userTransactions = await TRANSACTION_HISTORY.find({ email: user.email });
      let totalAmountUSD = 0;
      let totalAmountHEWE = 0;
      for (let j = 0; j < userTransactions.length; j++) {
        const transaction = userTransactions[j];
        totalAmountUSD += transaction.rewardPriceReferrer;
        totalAmountHEWE += transaction.rewardHeweToReferrer;
      }
      if (userTransactions.length > 0 && userTransactions[0].referredBy) {
        const referrer = await USER.findById(userTransactions[0].referredBy);
        if (referrer) {
          await REFERRAL.updateOne(
            { user_id: referrer._id },
            {
              $inc: {
                ReceivedPrice: totalAmountUSD,
                ReceivedHewePrice: totalAmountHEWE,
              },
            }
          );
        }
      }
    }

    return res.status(200).json({
      message: "Referral rewards updated successfully for all users.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
};

// for one users ===>>>>>

// step 1
exports.updateOneUserStatus = async (req, res) => {
  try {
    const User = await USER.findOne({ email: req.body.email });
    if (!User) {
      return res.status(404).json({
        message: "User not found.",
        status: 404,
      });
    }

    const userTransactions = await TRANSACTION_HISTORY.find({ email: User.email });
    let totalUSD = 0;
    for (let i = 0; i < userTransactions.length; i++) {
      totalUSD += userTransactions[i].amount_usd;
    }
    let transactionStatus;
    if (totalUSD === 0) {
      transactionStatus = 0;
    } else if (totalUSD < 100) {
      transactionStatus = 1;
    } else {
      transactionStatus = 2;
    }
    await USER.findByIdAndUpdate(User._id, { transactionStatus: transactionStatus });
    return res.status(200).json({
      message: "User status updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
};

// step 2
exports.updateOneUserReferralRewards = async (req, res) => {
  try {
    const allTransactions = await TRANSACTION_HISTORY.find({ email: req.body.email });

    for (let i = 0; i < allTransactions.length; i++) {
      const transaction = allTransactions[i];
      const user = await USER.findOne({ _id: transaction.referredBy });

      if (!user) {
        console.log(`No user found with _id: ${transaction.referredBy}`);
        continue;
      }
      let { amount_usd, amount_hewe } = transaction;
      let rewardPriceReferrer = 0;
      let rewardHeweToReferrer = 0;
      if (user.verifyLAH === false) {
        if (user.transactionStatus === 0) {
          (rewardPriceReferrer = amount_usd * 0), (rewardHeweToReferrer = amount_hewe * 0);
        } else if (user.transactionStatus === 1) {
          rewardPriceReferrer = amount_usd * 0.05;
          rewardHeweToReferrer = amount_hewe * 0;
        } else if (user.transactionStatus === 2) {
          rewardPriceReferrer = amount_usd * 0.1;
          rewardHeweToReferrer = amount_hewe * 0.05;
        }
      } else if (user.verifyLAH === true) {
        if (user.transactionStatus === 0) {
          rewardPriceReferrer = amount_usd * 0;
          rewardHeweToReferrer = amount_hewe * 0;
        } else if (user.transactionStatus === 1) {
          rewardPriceReferrer = amount_usd * 0.05;
          rewardHeweToReferrer = amount_hewe * 0.05;
        } else if (user.transactionStatus === 2) {
          rewardPriceReferrer = amount_usd * 0.1;
          rewardHeweToReferrer = amount_hewe * 0.05;
        }
      }
      await TRANSACTION_HISTORY.findByIdAndUpdate(transaction._id, {
        rewardPriceReferrer: rewardPriceReferrer,
        rewardHeweToReferrer: rewardHeweToReferrer,
      });
    }

    return res.status(200).json({
      message: "Transaction rewards and referral rewards updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
};

// step 3
// db.referrals.updateOne({user_id:ObjectId('')},{ $set: { ReceivedPrice: 0, ReceivedHewePrice: 0 } })

// step 4
exports.updateOneUserReferralRewardsReferral = async (req, res) => {
  try {
    const userEmail = req.body.email;
    const user = await USER.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        status: 404,
      });
    }
    const userTransactions = await TRANSACTION_HISTORY.find({ referredBy: user._id });
    let totalAmountUSD = 0;
    let totalAmountHEWE = 0;
    for (let j = 0; j < userTransactions.length; j++) {
      const transaction = userTransactions[j];
      totalAmountUSD += transaction.rewardPriceReferrer;
      totalAmountHEWE += transaction.rewardHeweToReferrer;
    }
    const updateReward = await REFERRAL.updateOne(
      { user_id: user._id },
      {
        $inc: {
          ReceivedPrice: totalAmountUSD,
          ReceivedHewePrice: totalAmountHEWE,
        },
      }
    );
    if (updateReward) {
      return res.status(200).json({
        message: "Referral rewards updated successfully for the user.",
        status: 200,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
};

const updateOneUserStatus = async (email) => {
  try {
    const user = await USER.findOne({ email });
    if (!user) {
      throw new Error("User not found.");
    }

    const userTransactions = await TRANSACTION_HISTORY.find({ email: user.email });

    let totalUSD = 0;
    for (let i = 0; i < userTransactions.length; i++) {
      totalUSD += userTransactions[i].amount_usd;
    }
    let transactionStatus;
    if (totalUSD === 0) {
      transactionStatus = 0;
    } else if (totalUSD < 100) {
      transactionStatus = 1;
    } else {
      transactionStatus = 2;
    }
    await USER.findByIdAndUpdate(user._id, { transactionStatus });
    return "User status updated successfully.";
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateOneUserReferralRewards = async (email) => {
  try {
    const allTransactions = await TRANSACTION_HISTORY.find({ email });

    for (let i = 0; i < allTransactions.length; i++) {
      const transaction = allTransactions[i];
      const user = await USER.findOne({ _id: transaction.referredBy });

      if (!user) {
        console.log(`No user found with _id: ${transaction.referredBy}`);
        continue;
      }
      let { amount_usd, amount_hewe } = transaction;
      let rewardPriceReferrer = 0;
      let rewardHeweToReferrer = 0;
      if (user.verifyLAH === false) {
        if (user.transactionStatus === 0) {
          rewardPriceReferrer = amount_usd * 0;
          rewardHeweToReferrer = amount_hewe * 0;
        } else if (user.transactionStatus === 1) {
          rewardPriceReferrer = amount_usd * 0.05;
          rewardHeweToReferrer = amount_hewe * 0;
        } else if (user.transactionStatus === 2) {
          rewardPriceReferrer = amount_usd * 0.1;
          rewardHeweToReferrer = amount_hewe * 0.05;
        }
      } else if (user.verifyLAH === true) {
        if (user.transactionStatus === 0) {
          rewardPriceReferrer = amount_usd * 0;
          rewardHeweToReferrer = amount_hewe * 0;
        } else if (user.transactionStatus === 1) {
          rewardPriceReferrer = amount_usd * 0.05;
          rewardHeweToReferrer = amount_hewe * 0.05;
        } else if (user.transactionStatus === 2) {
          rewardPriceReferrer = amount_usd * 0.1;
          rewardHeweToReferrer = amount_hewe * 0.05;
        }
      }
      await TRANSACTION_HISTORY.findByIdAndUpdate(transaction._id, {
        rewardPriceReferrer: rewardPriceReferrer,
        rewardHeweToReferrer: rewardHeweToReferrer,
      });
    }

    return "Transaction rewards and referral rewards updated successfully.";
  } catch (error) {
    throw new Error(error.message);
  }
};

const resetReferralRewards = async (email) => {
  try {
    const user = await USER.findOne({ email });
    if (user) {
      const Update = await REFERRAL.updateOne(
        { user_id: user._id },
        { $set: { ReceivedPrice: 0, ReceivedHewePrice: 0 } }
      );
    }
    return "Referral rewards reset successfully.";
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateOneUserReferralRewardsReferral = async (email) => {
  try {
    const user = await USER.findOne({ email });
    if (!user) {
      throw new Error("User not found.");
    }
    const userTransactions = await TRANSACTION_HISTORY.find({ referredBy: user._id });
    let totalAmountUSD = 0;
    let totalAmountHEWE = 0;
    for (let j = 0; j < userTransactions.length; j++) {
      const transaction = userTransactions[j];
      totalAmountUSD += transaction.rewardPriceReferrer;
      totalAmountHEWE += transaction.rewardHeweToReferrer;
    }
    const updateReward = await REFERRAL.updateOne(
      { user_id: user._id },
      {
        $inc: {
          ReceivedPrice: totalAmountUSD,
          ReceivedHewePrice: totalAmountHEWE,
        },
      }
    );
    if (updateReward) {
      return "Referral rewards updated successfully for the user.";
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

exports.userDbUpdate = async (req, res) => {
  try {
    const email = req.body.email;
    const statusUpdate = await updateOneUserStatus(email);
    const rewardUpdate = await updateOneUserReferralRewards(email);
    const resetReward = await resetReferralRewards(email);
    const referralRewards = await updateOneUserReferralRewardsReferral(email);

    return res.status(200).json({
      statusUpdate,
      rewardUpdate,
      resetReward,
      referralRewards,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
};

exports.findUserWithInDate = async (req, res) => {
  try {
    const find = await USER.find({
      createdAt: {
        $gte: new Date("2024-04-19"),
      },
    });
    if (find.length > 0) {
      return res.status(200).json({
        data: find,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
      status: 500,
    });
  }
};
