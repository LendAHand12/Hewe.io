exports.getTagsData = async (urlData, contentData) => {
  let htmlContent = contentData;
  htmlContent = htmlContent.replace("__FB_SITENAME__", "Hewe.io");
  htmlContent = htmlContent.replace("__FB_URL__", "https://dev.hewe.io/");
  htmlContent = htmlContent.replace("__FB_TYPE__", "website");
  if (urlData === "/") {
    htmlContent = htmlContent.replace("__META_TITLE__", "Hewe.io");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "Hewe.io");
  } else if (urlData.includes("login")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "Hewe-login");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "login");
  } else if (urlData.includes("signup")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "signup");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "signup");
  } else if (urlData.includes("reset-password")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "reset-password");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "reset-password");
  } else if (urlData.includes("signup/")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "signup/");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "signup/");
  } else if (urlData.includes("term")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "term");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "term");
  } else if (urlData.includes("privacy")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "privacy");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "privacy");
  } else if (urlData.includes("whitepaper")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "whitepaper");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "whitepaper");
  } else if (urlData.includes("news")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "news");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "news");
  } else if (urlData.includes("news/")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "news/");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "news/");
  } else if (urlData.includes("token")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "token");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "token");
  } else if (urlData.includes("swap")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "swap");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "swap");
  } else if (urlData.includes("verifyOtp")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "verifyOtp");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "verifyOtp");
  } else if (urlData.includes("how-to-buy")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "how-to-buy");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "how-to-buy");
  } else if (urlData.includes("forgetverifyOtp")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "forgetverifyOtp");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "forgetverifyOtp");
  } else if (urlData.includes("verifyEmail")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "verifyEmail");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "verifyEmail");
  } else if (urlData.includes("adminDashboard")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "adminDashboard");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "adminDashboard");
  } else if (urlData.includes("adminReferral")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "adminReferral");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "adminReferral");
  } else if (urlData.includes("adminBuyToken")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "adminBuyToken");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "adminBuyToken");
  } else if (urlData.includes("adminSwapToken")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "adminSwapToken");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "adminSwapToken");
  } else if (urlData.includes("resetPassword")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "resetPassword");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "resetPassword");
  } else if (urlData.includes("tokenomics")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "tokenomics");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "tokenomics");
  } else if (urlData.includes("contactus")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "contactus");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "contactus");
  } else if (urlData.includes("our-team")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "our-team");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "our-team");
  } else if (urlData.includes("road-map")) {
    htmlContent = htmlContent.replace("__META_TITLE__", "road-map");
    htmlContent = htmlContent.replace("__META_DESCRIPTION__", "road-map");
  }
  return htmlContent;
};
