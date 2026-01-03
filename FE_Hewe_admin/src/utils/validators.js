import { dictionaryList } from "./language/index";
const defaultLanguage = "en";

const messages = dictionaryList[defaultLanguage].errors;

// global regex
const noHtmlRegex = /<\/?[^>]+(>|$)/g;
const onlyAlphbetRegex = /^[a-zA-Z ]*$/;
const numberOnly = /^\d+$/;
var phoneRegex = /^[0-9]+$/;
var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
const unitRegex = /^[0-9]+\.?[0-9]*$/;

const checkEmail = (value) => {
  if (
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      value
    )
  ) {
    return true;
  } else if (
    value.includes('"') ||
    value.includes("'") ||
    value.includes(",") ||
    value.includes(" ")
  ) {
    return true;
  } else {
    return false;
  }
};

export const loginValidator = (values) => {
  let errors = {};
  // console.log(values);

  // if (!values.mobile_number) {
  //     errors.mobile_number = "Enter mobile number";
  // } else if (!phoneRegex.test(values.mobile_number)) {
  //     errors.mobile_number = messages.phone;
  // } else if (values.mobile_number.length < 4) {
  //     errors.mobile_number = messages.phone;
  // }

  if (!values.password) {
    errors.password = "Enter Password";
  }

  if (!values.email) {
    errors.email = "Enter Email ID";
  } else if (checkEmail(values.email)) {
    errors.email = messages.email;
  }

  return errors;
};

export const forgetValidator = (values) => {
  let errors = {};
  if (!values.mobile_number) {
    errors.phone = messages.invalid;
  } else if (!phoneRegex.test(values.mobile_number)) {
    errors.phone = messages.phone;
  } else if (values.mobile_number.length < 4) {
    errors.phone = messages.phone;
  }

  return errors;
};

export const otpValidator = (values) => {
  let errors = {};

  if (values.verification_code.length < 4) {
    errors.verification_code = messages.otp;
  }
  if (!values.verification_code) {
    errors.verification_code = "Please enter valid OTP";
  }
  return errors;
};

export const resetOutValidator = (values) => {
  let errors = {};

  if (!values.password) {
    errors.password = messages.invalid;
  } else if (!passwordRegex.test(values.password)) {
    errors.password = messages.password;
  } else if (values.password.length < 8) {
    errors.password = messages.password;
  }
  if (!values.confirm_password) {
    errors.confirm_password = messages.invalid;
  } else if (values.password !== values.confirm_password) {
    errors.confirm_password = messages.passwordMatch;
  }

  return errors;
};

export const signUpValidator = (values) => {
  let errors = {};

  if (!values.curPass) {
    errors.curPass = "Enter Current Password";
  } 
  if (!values.newPass) {
    errors.newPass = "Enter New Password";
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(values.newPass)) {
    errors.newPass = "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character";
  } 
  if (!values.cnewPass) {
    errors.cnewPass = "Enter confirm password";
  } 
  if (values.newPass !== values.cnewPass) {
    errors.cnewPass = "Passwords do not match";
  }


  return errors;
};
export const subadminValidator = (values) => {
  let errors = {};

  if (!values.email) {
    errors.email = "Enter Email Address";
  } 
  if (!values.password) {
    errors.password = "Enter New Password";
  } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}/.test(values.password)) {
    errors.password = "Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character";
  } 
  if (!values.password) {
    errors.password = "Enter confirm password";

  } 
  if(!values.role){
    errors.role ="Please select role of Admin"
  }
  if(values.access_module.length === 0){
    errors.access_module ="Please select Access Module"
  }

  return errors;
};


export const TransDataValidator = (values) => {
  let errors = {};

 
  if (!values.from) {
    errors.from = "Enter Buyer's Address";
  } 
  if (!values.date) {
    errors.date = "Enter Date";
  } 

  if (!values.amount_hewe) {
    errors.amount_hewe = "Enter Amount (HEWE)";
  } 
  if (!values.amount_usd) {
    errors.amount_usd = "Enter Amount (USDT)";
  } 
  if (!values.hash) {
    errors.hash = "Enter Hash Value";
  } 


  return errors;
};


export const completeProfileValidator = (values) => {
  let errors = {};
  // console.log(values);
  if (!values.username) {
    errors.username = messages.invalid;
  }
  if (!values.mobile_number) {
    errors.mobile_number = messages.invalid;
  } else if (!phoneRegex.test(values.mobile_number)) {
    errors.mobile_number = messages.phone;
  } else if (values.mobile_number.length < 4) {
    errors.mobile_number = messages.phone;
  }
  if (!values.email) {
    errors.email = messages.invalid;
  }
  if (!values.profile_image[0]) {
    errors.profile_image = "Upload profile image";
  }
  return errors;
};

export const bankDetailsValidator = (values) => {
  let errors = {};
  console.log(values);
  if (!values.account_holder_name) {
    errors.account_holder_name = messages.invalid;
  } else if (!onlyAlphbetRegex.test(values.account_holder_name)) {
    errors.account_holder_name = "It's only accept letters";
  }
  if (!values.account_number) {
    errors.account_number = messages.invalid;
  } else if (values.account_number.length >= 20) {
    errors.account_number = "Incorrect Account Number";
  } else if (!phoneRegex.test(values.account_number)) {
    errors.account_number = "Incorrect Account Number";
  }
  if (!values.re_account_number) {
    errors.re_account_number = messages.invalid;
  } else if (values.account_number !== values.re_account_number) {
    errors.re_account_number = messages.accountMatch;
  }
  if (!values.re_account_number) {
    errors.re_account_number = messages.invalid;
  }
  if (!values.ifsc) {
    errors.ifsc = messages.invalid;
  }
  if (!values.bank_name) {
    errors.bank_name = messages.invalid;
  }

  return errors;
};

export const menuValidator = (values) => {
  let errors = {};
  if (!values.menu_title) {
    errors.menu_title = messages.invalid;
  }
  return errors;
};

export const dishValidator = (values) => {
  let errors = {};
  if (!values.dish_name) {
    errors.dish_name = messages.invalid;
  }
  if (!values.search_keywords) {
    errors.search_keywords = messages.invalid;
  }
  if (values.search_keywords.length < 1) {
    errors.search_keywords = messages.invalid;
  }
  if (!values.serving_size) {
    errors.serving_size = messages.invalid;
  }
  if (values.serving_size.length < 1) {
    errors.serving_size = messages.invalid;
  }
  if (!values.minimum_preparation_time) {
    errors.minimum_preparation_time = messages.invalid;
  }
  if (values.minimum_preparation_time.length > 3) {
    errors.minimum_preparation_time = "Please enter value less than 999";
  }
  if (!values.dish_price) {
    errors.dish_price = messages.invalid;
  }
  if (!values.dish_type) {
    errors.dish_type = messages.invalid;
  }
  if (values.dish_type.length < 1) {
    errors.dish_type = messages.invalid;
  }
  if (!values.dish_status) {
    errors.dish_status = messages.invalid;
  }
  if (values.dish_status.length < 1) {
    errors.dish_status = messages.invalid;
  }
  if (!values.description) {
    errors.description = messages.invalid;
  }
  if (!values.dish_images) {
    errors.dish_images = messages.invalid;
  }
  if (values.dish_images.length < 1) {
    errors.dish_images = messages.invalid;
  }
  return errors;
};

export const restaurantDetailsValidator = (values) => {
  let errors = {};
  // console.log(values);
  if (!values.restaurant_images) {
    errors.restaurant_images = messages.invalid;
  }
  if (values.restaurant_images.length < 1) {
    errors.restaurant_images = messages.imagesLength;
  }
  if (!values.restaurant_name) {
    errors.restaurant_name = messages.invalid;
  }
  if (!values.mobile_number) {
    errors.mobile_number = messages.invalid;
  } else if (!phoneRegex.test(values.mobile_number)) {
    errors.mobile_number = messages.phone;
  } else if (values.mobile_number.length < 4) {
    errors.mobile_number = messages.phone;
  }
  if (!values.restaurant_location) {
    errors.restaurant_location = messages.invalid;
  }
  if (!values.email) {
    errors.email = messages.invalid;
  }
  if (!values.upload_first) {
    errors.upload_first = messages.invalid;
  }
  if (values.upload_first.length < 1) {
    errors.upload_first = messages.imagesLength;
  }
  if (values.categories.length < 1) {
    errors.categories = messages.invalid;
  }
  if (!values.service_type) {
    errors.service_type = messages.invalid;
  }
  if (values.service_type == 2 || values.service_type == 3) {
    if (!values.self_pickup_time) {
      errors.self_pickup_time = "Please select self pickup time";
    }
  }
  // if (!values.upload_second) {
  //   errors.upload_second = messages.invalid;
  // }
  // if (values.upload_second.length < 1) {
  //   errors.upload_second = messages.imagesLength;
  // }
  {
    values.working_hours.map((item, index) => {
      if (item.is_holyday == true ? !item.start_time || !item.end_time : "") {
        errors.working_hours = messages.selectStartEndTime;
      }
      if (!errors.working_hours) {
        if (item.is_holyday == true ? item.start_time == item.end_time : "") {
          errors.working_hours = messages.startEndTime;
        }
      }
      if (!errors.working_hours) {
        if (item.is_holyday == true ? item.start_time >= item.end_time : "") {
          errors.working_hours = "Start time should be greater than end time";
        }
      }
    });
  }

  // console.log(errors);

  return errors;
};

export const passwordProfileValidator = (values) => {
  let errors = {};

  if (!values.oldPassword) {
    errors.oldPassword = "Enter Current Password";
  }
  if (!values.password) {
    errors.password = "Enter New Password";
  }
  // else if (
  //   !passwordRegex.test(
  //     values.password
  //   )
  // ) {
  //   errors.password = messages.password;
  // }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Enter New Password";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = messages.passwordMatch;
  }

  // console.log(errors);

  return errors;
};

export const offerValidator = (values) => {
  let errors = {};

  // console.log(values);

  if (!values.offer_type) {
    errors.offer_type = messages.invalid;
  }
  if (!values.offer_name) {
    errors.offer_name = messages.invalid;
  }

  if (!values.offer_code) {
    errors.offer_code = messages.invalid;
  }

  if (!values.offer_validity.from) {
    errors.offer_validityfrom = messages.invalid;
  }

  if (!values.offer_validity.to) {
    errors.offer_validityto = messages.invalid;
  }

  if (!values.min_amount) {
    errors.min_amount = messages.invalid;
  }

  if (!values.max_amount) {
    errors.max_amount = messages.invalid;
  }

  // console.log(errors);

  return errors;
};

export const branchValidator = (values) => {
  let errors = {};

  console.log(values);

  if (!values.branchId) {
    errors.branchId = "Add branch ID";
  }
  if (values.branchId.trim() === "") {
    errors.branchId = "Add branch ID";
  }
  if (!values.name) {
    errors.name = "Add branch name";
  }
  if (values.name.trim() === "") {
    errors.name = "Add branch name";
  }

  if (!values.address) {
    errors.address = "Add address";
  }
  if (values.address.trim() === "") {
    errors.address = "Add address";
  }

  if (!values.opening_time) {
    errors.opening_time = "Add opening time";
  }

  if (!values.store_radius) {
    errors.store_radius = "Add store radius";
  }

  if (!values.closing_time) {
    errors.closing_time = "Add closing time ";
  } else if (values.closing_time == values.opening_time) {
    errors.closing_time = "Opening and closing time can't be same ";
  }
  if (!values.image[0]) {
    errors.image = "Upload image";
  }

  // if (!values.branch_category[0]) {
  //   errors.branch_category = "Add atleast one category";
  // }

  return errors;
};

export const managerValidator = (values) => {
  let errors = {};

  console.log(values);

  if (!values.manager_name) {
    errors.manager_name = "Add manager name";
  }
  if (values.manager_name.trim() === "") {
    errors.manager_name = "Add manager name";
  } else if (!onlyAlphbetRegex.test(values.manager_name)) {
    errors.manager_name = "It's only accept letters";
  }

  if (!values.email_id) {
    errors.email_id = "Add email-id";
  }
  if (values.email_id.trim() === "") {
    errors.email_id = "Add email-id";
  } else if (checkEmail(values.email_id)) {
    errors.email_id = messages.email;
  }

  if (!values.contact_number) {
    errors.contact_number = "Add Address";
  }

  if (!values.branch_name) {
    errors.branch_name = "Add branch name";
  }

  if (values.contact_number.trim() === "") {
    errors.contact_number = "Add Address";
  }

  if (!values.location) {
    errors.location = "Add location";
  }

  return errors;
};

export const subCategoryValidator = (values) => {
  let errors = {};

  if (!values.category) {
    errors.category = "Select category";
  }

  if (!values.subcategory_name) {
    errors.subcategory_name = "Add sub-category name";
  }

  if (values.subcategory_name.trim() === "") {
    errors.subcategory_name = "Add sub-category name";
  }

  return errors;
};

export const productValidator = (values) => {
  let errors = {};

  console.log(values);

  if (!values.name) {
    errors.name = "Add product name";
  }

  if (!values.description) {
    errors.description = "Add product description";
  }

  if (!values.inventoryLevels) {
    errors.inventoryLevels = "Add Inventory Levels Value";
  }

  if (!values.tax ) {
    errors.tax = "Add tax Value";
  }

  if (!values.shipping) {
    errors.shipping = "Add Shipping price";
  }

  if (values.image == 0) {
    errors.image = "Upload Image";
  }

  return errors;
};

// export const offerValidator = (values) => {
//   let errors = {};

//   console.log(values);

//   if (!values.offer_code) {
//     errors.offer_code = messages.invalid;
//   }
//   if(values.offer_code.trim() === "") {
//     errors.offer_code = messages.invalid;
//   }
//   if (!values.discount_amount) {
//     errors.discount_amount = messages.invalid;
//   }
//   if (!values.limit) {
//     errors.limit = messages.invalid;
//   }

//   if (!values.maximum_discount) {
//     errors.maximum_discount = messages.invalid;
//   } else if (values.maximum_discount.length > 5) {
//     errors.maximum_discount = "Invalid amount";
//   }

//   if (!values.minimum_order_value) {
//     errors.minimum_order_value = messages.invalid;
//   } else if (values.minimum_order_value < 1) {
//     errors.minimum_order_value = "Price value can't be less than to 1";
//   }
//   if(values.discount_amount.trim() === "") {
//     errors.discount_amount = messages.invalid;
//   }

//   if (!values.discount_type) {
//     errors.discount_type = messages.invalid;
//   }
//   if (!values.maximum_discount) {
//     errors.maximum_discount = messages.invalid;
//   }
//   if (values.discount_type == "Percent") {
//     if (values.discount_amount > 98) {
//       errors.discount_amount = "Discount can't be more than 98";
//     }
//   }
//   if(values.discount_type.trim() === "") {
//     errors.discount_type = messages.invalid;
//   }

//   if (!values.description) {
//     errors.description = messages.invalid;
//   }
//   if(values.description.trim() === "") {
//     errors.description = messages.invalid;
//   }

//   if (!values.start_validity) {
//     errors.start_validity = messages.invalid;
//   }

//   if (!values.end_validity) {
//     errors.end_validity = messages.invalid;
//   }

//   return errors;
// };

export const agentDisapproveValidator = (values) => {
  let errors = {};

  if (values.bio_message.length > 40) {
    errors.bio_message = "Please use less than 40 characters";
  }
  if (values.address_message.length > 40) {
    errors.address_message = "Please use less than 40 characters";
  }
  if (values.license_message.length > 40) {
    errors.license_message = "Please use less than 40 characters";
  }
  if (values.website_message.length > 40) {
    errors.website_message = "Please use less than 40 characters";
  }
  if (values.business_since_message.length > 40) {
    errors.business_since_message = "Please use less than 40 characters";
  }
  if (values.language_fluency_message.length > 40) {
    errors.language_fluency_message = "Please use less than 40 characters";
  }
  if (values.blog_message.length > 40) {
    errors.blog_message = "Please use less than 40 characters";
  }
  if (values.facebook_message.length > 40) {
    errors.facebook_message = "Please use less than 40 characters";
  }
  if (values.linkedin_message.length > 40) {
    errors.linkedin_message = "Please use less than 40 characters";
  }

  return errors;
};

export const prescripValidator = (values) => {
  let errors = {};

  console.log(values);

  if (!values.name) {
    errors.name = messages.invalid;
  }

  if (!values.type) {
    errors.type = messages.invalid;
  }

  if (!values.amount) {
    errors.amount = messages.invalid;
  }

  if (!values.discount) {
    errors.discount = messages.invalid;
  }

  if (!values.month) {
    errors.month = messages.invalid;
  }

  if (values.feature1.length > 60) {
    errors.feature1 = "Please use less than 60 characters";
  }

  if (values.feature2.length > 60) {
    errors.feature2 = "Please use less than 60 characters";
  }

  if (values.feature3.length > 60) {
    errors.feature2 = "Please use less than 60 characters";
  }

  // if (!values.feature1) {
  //   errors.feature1 = messages.invalid;
  // }

  // if (!values.feature2) {
  //   errors.feature2 = messages.invalid;
  // }

  // if (!values.feature3) {
  //   errors.feature3 = messages.invalid;
  // }

  // console.log(errors);

  return errors;
};

export const deliveryBoyDataValidator = (values) => {
  let errors = {};
  if (!values.firstName) {
    errors.firstName = "Enter First Name";
  }
  if (!values.lastName) {
    errors.lastName = "Enter Last Name";
  }
  // if (!values.email) {
  //   errors.email = "Enter Email";
  // } else if (checkEmail(values.email)) {
  //   errors.email = messages.email;
  // }
  if (!values.password) {
    errors.password = "Enter password";
  }
  if (!values.mobileNum) {
    errors.mobile = "Enter Mobile Number";
  }

  return errors;
};
export const SubscriptionDataValidator = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = "Enter Plan Name";
  }

  if (!values.price) {
    errors.price = "Enter Price";
  }
  
  

  if (values.price) {
    let regexPrice = /^\d+(\.\d{1,2})?$/;
  
    if (!regexPrice.test(String(values.price))) {
      errors.price = "Enter a valid price (e.g., 25 or 25.50)";
    }
  }
  
  if (!values.discountPrice) {
    errors.discountPrice = "Enter discounted price";
  } 
  if (values.discountPrice && values.price) {
    const discountPrice = parseFloat(values.discountPrice);
    const originalPrice = parseFloat(values.price);
  
    if (discountPrice >= originalPrice) {
      errors.discountPrice = "Discounted price should be less than the original price";
    
    }
  }
  
  

  if (values.featuresPack.length === 0) {
    errors.featuresPack = ["Enter at least 1 Feature"];
  } else if (values.featuresPack.some((feature) => feature.trim() === '')) {
    errors.featuresPack = ["Features cannot be empty"];
  }

  if (values.icon == 0) {
    errors.icon = "Upload Image";
  }
 

  return errors;
};

export const disapproveValidator = (values) => {
  console.log(values);
  let errors = {};
  if (values.businessNameCheck == true) {
    if (!values.businessName) {
      errors.businessName = "Invalid";
    }
    if (values.businessName.length > 30) {
      errors.businessName = "Can't exceed more than 30 characters";
    }
  }

  if (values.businessNumberCheck == true) {
    if (!values.businessNumber) {
      errors.businessNumber = "Invalid";
    }
    if (values.businessNumber.length > 30) {
      errors.businessNumber = "Can't exceed more than 30 characters";
    }
  }
  if (values.bannerImageCheck == true) {
    if (!values.bannerImage) {
      errors.bannerImage = "Invalid";
    }
    if (values.bannerImage.length > 30) {
      errors.bannerImage = "Can't exceed more than 30 characters";
    }
  }
  if (values.websiteCheck == true) {
    if (!values.website) {
      errors.website = "Invalid";
    }
    if (values.website.length > 30) {
      errors.website = "Can't exceed more than 30 characters";
    }
  }
  if (values.postcodeCheck == true) {
    if (!values.postcode) {
      errors.postcode = "Invalid";
    }
    if (values.postcode.length > 30) {
      errors.postcode = "Can't exceed more than 30 characters";
    }
  }
  if (values.shopInformationCheck == true) {
    if (!values.shopInformation) {
      errors.shopInformation = "Invalid";
    }
    if (values.shopInformation.length > 30) {
      errors.shopInformation = "Can't exceed more than 30 characters";
    }
  }
  if (values.shopTimingCheck == true) {
    if (!values.shopTiming) {
      errors.shopTiming = "Invalid";
    }
    if (values.shopTiming.length > 30) {
      errors.shopTiming = "Can't exceed more than 30 characters";
    }
  }
  if (values.addressCheck == true) {
    if (!values.address) {
      errors.address = "Invalid";
    }
    if (values.address.length > 30) {
      errors.address = "Can't exceed more than 30 characters";
    }
  }
  if (values.Image1Check == true) {
    if (!values.Image1) {
      errors.Image1 = "Invalid";
    }
    if (values.Image1.length > 30) {
      errors.Image1 = "Can't exceed more than 30 characters";
    }
  }
  if (values.Image2Check == true) {
    if (!values.Image2) {
      errors.Image2 = "Invalid";
    }
    if (values.Image2.length > 30) {
      errors.Image2 = "Can't exceed more than 30 characters";
    }
  }
  if (values.Image3Check == true) {
    if (!values.Image3) {
      errors.Image3 = "Invalid";
    }
    if (values.Image3.length > 30) {
      errors.Image3 = "Can't exceed more than 30 characters";
    }
  }
  if (values.Image4Check == true) {
    if (!values.Image4) {
      errors.Image4 = "Invalid";
    }
    if (values.Image4.length > 30) {
      errors.Image4 = "Can't exceed more than 30 characters";
    }
  }
  if (values.Image5Check == true) {
    if (!values.Image5) {
      errors.Image5 = "Invalid";
    }
    if (values.Image5.length > 30) {
      errors.Image5 = "Can't exceed more than 30 characters";
    }
  }
  if (values.Image6Check == true) {
    if (!values.Image6) {
      errors.Image6 = "Invalid";
    }
    if (values.Image6.length > 30) {
      errors.Image6 = "Can't exceed more than 30 characters";
    }
  }
  if (values.Image7Check == true) {
    if (!values.Image7) {
      errors.Image7 = "Invalid";
    }
    if (values.Image7.length > 30) {
      errors.Image7 = "Can't exceed more than 30 characters";
    }
  }
  if (values.Image8Check == true) {
    if (!values.Image8) {
      errors.Image8 = "Invalid";
    }
    if (values.Image8.length > 30) {
      errors.Image8 = "Can't exceed more than 30 characters";
    }
  }
  return errors;
};
export const tourDataValidator = (values) => {
  // console.log(values);
  let errors = {};

  if (!values.tour_location.from) {
  
    errors.tour_locationFrom = "Enter From Details";
  }
  if (!values.tour_location.to) {
  
    errors.tour_locationTo = "Enter To Details";
  }

  if (!values.tour_title) {
    errors.tour_title = "Enter Tour Title";
  }
 
  if (!values.pickup_vehicle) {
    errors.pickup_vehicle = "Enter Vehicle Type";
  }
  
  if (!values.hotel || values.hotel===undefined) {
    errors.hotel = "Select Hotel Type";
  }
  if (!values.jet_type) {
    errors.jet_type = "Enter Jet Type";
  }
 if( values.tour_location.to && values.tour_location.to===values.tour_location.from){
  errors.tour_locationTo="From and To Locations should be different"
 }
  if (!values.long_description) {
    errors.long_description = "Detail Description is Required";
  }
  if(values.long_description>250){
    errors.long_description="Long Description should not be longer than 250 characters"
  }
  if (!values.short_description) {
    errors.short_description = "Short Description is Required";
  }
  if(values.short_description.length>50){
    errors.short_description="Short Description should not be longer than 50 characters"
  }
  if (!values.about_trip) {
    errors.about_trip = "About Trip is Required";
  }
  if (!values.what_include) {
    errors.what_include = "What's included in the price is Required";
  }
  if (values.images.length<5 || values.images.length>15) {
    errors.images = "Images should be 5 to 12 only";
  }
  // console.log(errors,"errorss")

  return errors;
};
export const ContentDataValidator = (values) => {
  let errors = {};

  if (!values.description || /^<p>(<br\/?>)?<\/p>$/.test(values.description)) {
    errors.description = "Required";
  }
  if (!values.benefits || /^<p>(<br\/?>)?<\/p>$/.test(values.benefits)) {
    errors.benefits = "Required";
  }

  for (let i = 0; i < values.video_description_count; i++) {
    if (!values[`video_description_${i}_link`]) {
      errors[`video_description_${i}_link`] = "Required";
    }

    if (
      !values[`video_description_${i}_description`] ||
      /^<p>(<br\/?>)?<\/p>$/.test(values[`video_description_${i}_description`])
    ) {
      errors[`video_description_${i}_description`] = "Required";
    }
  }

  return errors;

  //   if (!values.date) {
  //     errors.date = "Enter Date";
  //   }
  //   // if (values.date.length > 30) {
  //   //   errors.businessName = "Can't exceed more than 30 characters";
  //   // }

  //   if (!values.title) {
  //     errors.title = "Enter Title";
  //   }
  //   if (values.title) {

  //     if (values.title.length > 30) {
  //       errors.title = "Can't exceed more than 30 characters";
  //     }
  //   }
  //   // if (values.link) {
  //   //   errors.link = "Enter title";
  //   // }
  //   if (!values.description) {
  //     errors.description = "Enter Description";
  //   }
  //   if (values.description) {

  //     if (values.description.length > 60) {
  //       errors.description = "Can't exceed more than 30 characters";
  //     }
  //   }
  // return errors;
};
export const StoreDataValidator = (values) => {
  console.log(values);
  let errors = {};
  if (!values.category) {
    errors.category = "Select Category";
  }
  if (!values.name) {
    errors.name = "Enter Date";
  }
  if (values.name.length > 30) {
    errors.name = "Can't exceed more than 30 characters";
  }

  // if (!values.title) {
  //   errors.title = "Enter Title";
  // }
  // if (values.title) {
  //   if (values.title.length > 30) {
  //     errors.title = "Can't exceed more than 30 characters";
  //   }
  // }
  if (!values.link) {
    errors.link = "Enter Link";
  }
  if (!values.description) {
    errors.description = "Enter Description";
  }
  // if (values.description) {
  //   if (values.description.length > 60) {
  //     errors.description = "Can't exceed more than 60 characters";
  //   }
  // }
  if (!values.image) {  
    errors.image = "Select Image";
  }
  return errors;
};

export const VideoDataValidator = (values) => {
  console.log(values);
  let errors = {};
  if (!values.title) {
    errors.title = "Enter Title";
  }
  if (values.title) {
    if (values.title.length > 30) {
      errors.title = "Can't exceed more than 30 characters";
    }
  }
  if (!values.description) {
    errors.description = "Enter Description";
  }
  // if (values.description) {
  //   if (values.description.length > 60) {
  //     errors.description = "Can't exceed more than 60 characters";
  //   }
  // }
  if (!values.link) {
    errors.link = "Enter Link";
  }
  return errors;
};

export const ReferDataValidator = (values) => {
  let errors = {};
  if (values.file.length == 0) {
    errors.file = "Select Image";
  }
  if (!values.benefits) {
    errors.benefits = "Enter Benefits & Conditions";
  }
  if (!values.videoTitle) {
    errors.videoTitle = "Enter Video Title";
  }
  for (let i = 0; i < values.videoLink.length; i++) {
    if (!values.videoLink[i]) {
      errors.videoLink = errors.videoLink || {};
      errors.videoLink[i] = "Enter Video Link";
    }
  }
  return errors;
};
export const CategoryDataValidator = (values) => {
  let errors = {};
  if (values.file.length == 0) {
    errors.file = "Select Icon";
  }
  if (!values.name) {
    errors.name = "Enter Name";
  }

  return errors;
};
export const BannerDataValidator = (values) => {
  let errors = {};
  if (values.icon == 0) {
    errors.icon = "Upload Image";
  }
  if (!values.title) {
    errors.title = "Enter Title";
  }
  if (!values.description) {
    errors.description = "Enter Description";
  }

  return errors;
};
export const SectionADataValidator = (values) => {
  let errors = {};
  if (values.image.length <=0 ) {
    errors.image = "Upload Image";
  }
  if (!values.heading) {
    errors.heading = "Enter Heading";
  }
  if (!values.content) {
    errors.content = "Enter Content";
  }
  if (!values.content || /^<p>(<br\/?>)?<\/p>$/.test(values.content)) {
    errors.content = "Enter Content";
  }

  return errors;
};
export const SectionBDataValidator = (values) => {
  let errors = {};
  if (values.image.length <=0 ) {
    errors.image = "Upload Image";
  }
  if (!values.heading) {
    errors.heading = "Enter Heading";
  }
  if (!values.content) {
    errors.content = "Enter Content";
  }
  if (!values.content || /^<p>(<br\/?>)?<\/p>$/.test(values.content)) {
    errors.content = "Enter Content";
  }

  return errors;
};
export const SectionCDataValidator = (values) => {
  let errors = {};
  if (values.image.length <=0 ) {
    errors.image = "Upload Image";
  }
  if (!values.heading) {
    errors.heading = "Enter Heading";
  }
  if (!values.content) {
    errors.content = "Enter Content";
  }
  if (!values.content || /^<p>(<br\/?>)?<\/p>$/.test(values.content)) {
    errors.content = "Enter Content";
  }

  return errors;
};

export const TestimonialDataValidator = (values) => {
  let errors = {};
  if (values.file.length == 0) {
    errors.file = "Select Image";
  }
  if (!values.name) {
    errors.name = "Enter Name";
  }
  if (!values.description) {
    errors.description = "Enter Description";
  }
  // if (values.description) {
  //   if (values.description.length > 60) {
  //     errors.description = "Can't exceed more than 60 characters";
  //   }
  // }
  if (!values.location) {
    errors.location = "Enter Location";
  }
  return errors;
};
export const AssociateSubscriptionDataValidator = (values) => {
  let errors = {};

  if (!values.price) {
    errors.price = "Enter Price";
  }
  if (values.price) {
    // let regexprice = /[(0-9)+.?(0-9)*]+/gim;
    let regexprice = /^[0-9]+$/;

    if (!regexprice.test(String(values.price))) {
      errors.price = "Enter valid Price";
    }
  }
  for (let i = 0; i < values.description.length; i++) {
    if (!values.description[i]) {
      errors.description = errors.description || {};
      errors.description[i] = "Enter Feature";
    }
  }
  // if (!values.planType) {
  //   errors.planType = "Select Plan Duration";
  // }

  return errors;
};
export const PreferredSubscriptionDataValidator = (values) => {
  let errors = {};

  if (!values.price) {
    errors.price = "Enter Price";
  }
  if (values.price) {
    // let regexprice = /[(0-9)+.?(0-9)*]+/gim;
    let regexprice = /^[0-9]+$/;

    if (!regexprice.test(String(values.price))) {
      errors.price = "Enter valid Price";
    }
  }
  for (let i = 0; i < values.description.length; i++) {
    if (!values.description[i]) {
      errors.description = errors.description || {};
      errors.description[i] = "Enter Feature";
    }
  }
  // if (!values.planType) {
  //   errors.planType = "Select Plan Duration";
  // }

  return errors;
};

export const AboutDataValidator = (values) => {
  let errors = {};

  if (!values.OurStoryDescription) {
    errors.OurStoryDescription = "Enter Description";
  }
  if (!values.OurAimDescription) {
    errors.OurAimDescription = "Enter Description";
  }
  if (values.OurAimImage.length == 0) {
    errors.OurAimImage = "Select Image";
  }
  if (values.OurStoryImage.length == 0) {
    errors.OurStoryImage = "Select Image";
  }

  return errors;
};

export const TeamDataValidator = (values) => {
  let errors = {};

  if (!values.location) {
    errors.location = "Enter Motor Location";
  }
  if (!values.server_name) {
    errors.server_name = "Enter Motor Server Location";
  }
  if (!values.company_code) {
    errors.company_code = "Enter Company Id";
  }
  if (!values.company_name) {
    errors.company_name = "Enter Company Name";
  }
 

  return errors;
  
};

export const PaymentTAndC = (values) => {
  let errors = {};

  if (!values.description) {
    errors.description = "Enter Description";
  }
  if (!values.name) {
    errors.name = "Enter Name";
  }

  return errors;
};
