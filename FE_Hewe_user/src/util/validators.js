const NewpasswordRegex = /^.{8,}$/;

// global regex
const noHtmlRegex = /<\/?[^>]+(>|$)/g;
const onlyAlphbetRegex = /^[a-zA-Z ]*$/;
const numberOnly = /^\d+$/;
var phoneRegex = /^[0-9]+$/;
// var passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{7,}$/;
var passwordRegex = /^(?=.\d)(?=.[a-z])(?=.[A-Z])(?=.[a-zA-Z]).{7,}$/;

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
  // console.log(values);
  let errors = {};
  if (!values.email) {
    errors.email = "Please enter the email";
  } else if (checkEmail(values.email)) {
    errors.email = "Please enter valid email format";
  }

  if (!values.password) {
    errors.password = "Please enter the password";
  }

  return errors;
};

export const forgetValidator = (values) => {
  let errors = {};

  if (values.email) {
    if (
      !/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
        values.email
      )
    ) {
      errors.email = "Enter a valid email address";
    }
  } else {
    errors.email = "Please enter the Email";
  }

  return errors;
};

export const OfferValidator = (values) => {
  let errors = {};

  if (values.email) {
    if (
      !/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
        values.email
      )
    ) {
      errors.email = "Enter a valid email address";
    }
  } else {
    errors.email = "Please enter the Email";
  }

  return errors;
};

export const otpValidator = (values) => {
  let errors = {};

  if (values.verificationCode.length < 4) {
    errors.verificationCode = "Enter valid OTP";
  }
  if (!values.verificationCode) {
    errors.verificationCode = "Please enter OTP";
  }
  return errors;
};

export const resetPasswordValidator = (values) => {
  // console.log(values);
  let errors = {};
  if (!values.password) {
    errors.password = "Please enter the Password";
  } else if (!NewpasswordRegex.test(values.password)) {
    errors.password = "The password must contain at least eight characters";
  }

  if (!values.confirm_password) {
    errors.confirm_password = "Please enter the Confirm Password";
  } else if (values.password !== values.confirm_password) {
    errors.confirm_password = "Password does not match";
  }

  return errors;
};
export const changePasswordValidator = (values) => {
  // console.log(values);
  let errors = {};
  if (!values.oldPassword) {
    errors.oldPassword = "Please enter the old Password";
  }
  if (!values.newPassword) {
    errors.newPassword = "Please enter the new Password";
  } else if (!NewpasswordRegex.test(values.newPassword)) {
    errors.newPassword = "The password must contain atleast eight characters";
  }

  if (!values.confirm_password) {
    errors.confirm_password = "Please enter the Confirm Password";
  } else if (values.newPassword !== values.confirm_password) {
    errors.confirm_password = "Password does not match";
  }

  return errors;
};

export const signUPValidator = (values) => {
  let errors = {};
  if (!values.UserName) {
    errors.UserName = "Please enter the User Name";
  } else if (!onlyAlphbetRegex.test(values.UserName)) {
    errors.UserName =
      "User Name cannnot accept white space, numeric values and special character";
  } else if (values.UserName.length > 15) {
    errors.UserName = "User Name cannot exceed 15 characters";
  } else if (values.UserName) {
    if (/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?^0-9]*$/.test(values.UserName)) {
      errors.UserName = "No special character and numeric value allowed";
    }
  }

  if (!values.mobileNumber) {
    errors.mobileNumber = "Enter the valid mobile number";
  } else if (values.mobileNumber.length < 4) {
    errors.mobileNumber = "Your mobile should contain atleast 4 digits";
  } else if (values.mobileNumber.length > 17) {
    errors.mobileNumber = "Your mobile should not greater than 16 digits ";
  }

  if (values.email) {
    if (
      !/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
        values.email
      )
    ) {
      errors.email = "Enter a valid email address";
    }
  } else {
    errors.email = "Please enter the Email";
  }

  if (!values.password) {
    errors.password = "Please enter the Password";
  } else if (!NewpasswordRegex.test(values.password)) {
    errors.password = "The password must contain at least eight characters ";
  }

  if (!values.confirm_password) {
    errors.confirm_password = "Please Re-enter the Password";
  } else if (values.password !== values.confirm_password) {
    errors.confirm_password = "Password do not match";
  }

  // if (!values.Lah_member) {
  //   errors.Lah_member = "Please enter the LAH Member";
  // }

  return errors;
};

export const contactusValidator = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = "Please enter the User Name";
  } else if (!onlyAlphbetRegex.test(values.name)) {
    errors.name =
      "User Name cannnot accept white space, numeric values and special character";
  } else if (values.name.length > 15) {
    errors.name = "User Name cannot exceed 15 characters";
  } else if (values.name) {
    if (/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?^0-9]*$/.test(values.name)) {
      errors.name = "No special character and numeric value allowed";
    }
  }

  if (!values.phone_number) {
    errors.phone_number = "Enter the valid mobile number";
  } else if (values.phone_number.length < 4) {
    errors.phone_number = "Your mobile should contain atleast 4 digits";
  } else if (values.phone_number.length > 17) {
    errors.phone_number = "Your mobile should not greater than 16 digits ";
  }

  if (values.email) {
    if (
      !/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
        values.email
      )
    ) {
      errors.email = "Enter a valid email address";
    }
  } else {
    errors.email = "Please enter the Email";
  }
  if (!values.description) {
    errors.description = "Please enter the Description";
  }
  if (!values.subject) {
    errors.subject = "Please enter the subject";
  }

  return errors;
};

export const associateFormValidator = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = "Please enter the Name";
  }

  if (values.name) {
    if (/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?^0-9]*$/.test(values.firstName)) {
      errors.name = "No special character and numeric value allowed";
    }
  }

  if (!values.mobileNumber) {
    errors.mobileNumber = "Enter the valid mobile number";
  } else if (values.mobileNumber.length < 4) {
    errors.mobileNumber = "Your mobile should contain atleast 4 digits";
  } else if (values.mobileNumber.length > 17) {
    errors.mobileNumber = "Your mobile should not greater than 16 digits ";
  }

  if (values.email) {
    if (
      !/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
        values.email
      )
    ) {
      errors.email = "Enter a valid email address";
    }
  } else {
    errors.email = "Please enter the Email";
  }

  return errors;
};

export const businessPreferredValidator = (values) => {
  let errors = {};
  if (!values.name) {
    errors.name = "Please enter the Name";
  }
  if (!values.business_name) {
    errors.business_name = "Please enter the Business Name";
  }
  if (!values.industry_type) {
    errors.industry_type = "Please enter the Industry Type";
  }

  if (values.name) {
    if (/^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?^0-9]*$/.test(values.firstName)) {
      errors.name = "No special character and numeric value allowed";
    }
  }

  if (!values.mobileNumber) {
    errors.mobileNumber = "Enter the valid mobile number";
  } else if (values.mobileNumber.length < 4) {
    errors.mobileNumber = "Your mobile should contain atleast 4 digits";
  } else if (values.mobileNumber.length > 17) {
    errors.mobileNumber = "Your mobile should not greater than 16 digits ";
  }

  if (values.email) {
    if (
      !/^([a-zA-Z0-9_.-])+@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(
        values.email
      )
    ) {
      errors.email = "Enter a valid email address";
    }
  } else {
    errors.email = "Please enter the Email";
  }

  if (!values.description) {
    errors.description = "Please enter the Description";
  }
  if (!values.logo) {
    errors.logo = "Please Select Logo";
  }
  // if (!values.video) {
  //   errors.video = "Please Select Video";
  // }

  return errors;
};

export const UpdateProfileValidator = (values) => {
  // console.log(values);
  let errors = {};
  if (!values.firstName) {
    errors.firstName = "Please enter the First Name";
  }
  if (!values.lastName) {
    errors.lastName = "Please enter the Last Name";
  }
  if (!values.mobileNumber) {
    errors.mobileNumber = "Enter the valid mobile number";
  } else if (values.mobileNumber.length < 4) {
    errors.mobileNumber = "Your mobile should contain atleast 4 digits";
  } else if (values.mobileNumber.length > 15) {
    errors.mobileNumber = "Your mobile should not greater than 14 digits ";
  }

  return errors;
};

export const SizeValidator = (values) => {
  let errors = {};
  if (!values.size) {
    errors.size = "Enter Size";
  }
  return errors;
};

export const menuValidator = (values) => {
  let errors = {};
  if (!values.menu_title) {
    errors.menu_title = "Enter Size";
  }
  return errors;
};

export const offerValidator = (values) => {
  let errors = {};

  console.log(values);

  if (!values.offer_type) {
    errors.offer_type = "Select offer type";
  }
  if (!values.offer_name) {
    errors.offer_name = "Enter offer name";
  }

  if (!values.offer_code) {
    errors.offer_code = "Enter offer code";
  } else if (values.offer_code.length > 21) {
    errors.offer_code = "Promocode should contain max 20 characters";
  } else if (values.offer_code.length < 5) {
    errors.offer_code = "Promocode should contain min 5 characters";
  }

  if (!values.offer_validity.from) {
    errors.offer_validityfrom = "Select date from";
  }

  if (!values.offer_validity.to) {
    errors.offer_validityto = "Select date to";
  }

  if (!values.min_amount) {
    errors.min_amount = "Enter minimum amount";
  }

  if (!values.limit) {
    errors.limit = "Enter usage limit";
  }

  if (!values.discount_amount) {
    errors.discount_amount = "Enter discount amount";
  }
  if (!values.discount_type) {
    errors.discount_type = "Enter discount type";
  }

  if (values.discount_type.value == "2") {
    if (values.discount_amount > 99) {
      errors.discount_amount = "Discount can't be more than 99";
    }
  }
  // if(values.discount_type.value == "2" || values.max_amount > 0) {
  //   if (!values.max_amount) {
  //     errors.max_amount = "Enter maximum discount amount";
  //   }
  // }

  // console.log(errors);

  return errors;
};

export const promotionValidator = (values) => {
  let errors = {};

  // console.log(values);

  if (!values.offer_id) {
    errors.offer_id = "Enter offer ID";
  }
  if (!values.promotion_title) {
    errors.promotion_title = "Enter promotion title";
  }

  if (!values.banner_image) {
    errors.banner_image = "Upload banner image";
  }

  if (!values.charges_for_month) {
    errors.charges_for_month = "Enter charges for month";
  }

  if (!values.promotion_duration.start_date) {
    errors.promotion_durationstart_date = "Select start date";
  }

  if (!values.promotion_duration.end_date) {
    errors.promotion_durationend_date = "Select end date";
  }

  // console.log(errors);

  return errors;
};

export const handleContactValidator = (values) => {
  let errors = {};

  // console.log(values);

  if (!values.email) {
    errors.email = "Please enter the email";
  } else if (checkEmail(values.email)) {
    errors.email = "Please enter valid email format";
  }

  if (!values.name) {
    errors.name = "Please enter name";
  }

  if (!values.description) {
    errors.description = "Please enter description";
  }

  // console.log(errors);

  return errors;
};
export const newsletterValidator = (values) => {
  let errors = {};

  // console.log(values);

  if (!values.email) {
    errors.email = "Please enter the email";
  } else if (checkEmail(values.email)) {
    errors.email = "Please enter valid email";
  }
  // console.log(errors);

  return errors;
};

export const editProfileValidation = (values) => {
  let errors = {};

  // First Name validation
  if (!values.firstName) {
    errors.firstName = "Please enter the First Name";
  } else if (!onlyAlphbetRegex.test(values.firstName)) {
    errors.firstName =
      "First Name cannot accept white space, numeric values, and special characters";
  } else if (values.firstName.length > 15) {
    errors.firstName = "First Name cannot exceed 15 characters";
  } else if (
    /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?^0-9]*$/.test(values.firstName)
  ) {
    errors.firstName = "No special characters and numeric values allowed";
  }

  // Last Name validation
  if (!values.lastName) {
    errors.lastName = "Please enter the Last Name";
  } else if (
    /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?^0-9]*$/.test(values.lastName)
  ) {
    errors.lastName = "No special characters and numeric values allowed";
  } else if (values.lastName.length > 15) {
    errors.lastName = "Last Name cannot exceed 15 characters";
  }

  return errors;
};

export const orderDeatilsvalidation = (values, isverify) => {
  let errors = {};

  if (!values.email) {
    errors.email = "Please enter the Email";
  } else if (!/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,4}$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }
  {
    console.log(isverify);
  }
  if (isverify !== true) {
    if (!values.conf_email) {
      errors.conf_email = "Please enter the confirm Email";
    } else if (!/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,4}$/.test(values.conf_email)) {
      errors.conf_email = "Enter a valid email address";
    } else if (values.email !== values.conf_email) {
      errors.conf_email = "email do not match";
    }
  }

  if (!values.fullName) {
    errors.fullName = "Please enter your full name";
  } else if (!/^[A-Za-z\s'-]+$/.test(values.fullName)) {
    errors.fullName = "Enter Valid name";
  }

  if (!values.mobileNumber) {
    errors.mobileNumber = "Please Enter mobile number";
  } else if (values.mobileNumber.length < 6) {
    errors.mobileNumber = "Your mobile should contain atleast 4 digits";
  } else if (values.mobileNumber.length > 17) {
    errors.mobileNumber = "Your mobile should not greater than 16 digits ";
  }

  if (!values.streetAddress) {
    errors.streetAddress = "Please enter the Address";
  }

  if (!values.apartment) {
    errors.apartment = "Please enter the Apartment name";
  }

  if (!values.zipCode) {
    errors.zipCode = "Please enter the Zip Code";
  }

  if (values.zipCode) {
    if (/^\d{5}(-\d{4})?$/.test(values.zipCode)) {
      errors.zipCode = "No special character and numeric value allowed";
    }
  }

  if (!values.city) {
    errors.city = "Please enter the city";
  }

  if (!values.state) {
    errors.state = "Please enter the state";
  }

  return errors;
};

export const contactusDeatilsvalidation = (values) => {
  let errors = {};

  if (!values.email) {
    errors.email = "Please enter the Email";
  } else if (!/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,4}$/.test(values.email)) {
    errors.email = "Enter a valid email address";
  }

  if (!values.firstName) {
    errors.firstName = "Please enter your first name";
  } else if (!/^[A-Za-z\s'-]+$/.test(values.firstName)) {
    errors.firstName = "Enter Valid first name";
  }
  if (!values.lastName) {
    errors.lastName = "Please enter your last name";
  } else if (!/^[A-Za-z\s'-]+$/.test(values.lastName)) {
    errors.lastName = "Enter Valid last name";
  }

  if (!values.mobileNumber) {
    errors.mobileNumber = "Please Enter mobile number";
  } else if (values.mobileNumber.length < 6) {
    errors.mobileNumber = "Your mobile should contain atleast 4 digits";
  } else if (values.mobileNumber.length > 17) {
    errors.mobileNumber = "Your mobile should not greater than 16 digits ";
  }

  if (!values.comments) {
    errors.comments = "Please Write a comment";
  }

  return errors;
};
