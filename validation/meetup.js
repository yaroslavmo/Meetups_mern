const Validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateMeetupInput(data) {
  let errors = {};
  console.log(data);

  data.title = !isEmpty(data.title) ? data.title : "";
  data.date = !isEmpty(data.date) ? data.date : "";

  if (!Validator.isLength(data.title, { min: 2, max: 300 })) {
    errors.title = "Title must be between 2 and 300 characters";
  }

  if (Validator.isEmpty(data.title)) {
    errors.title = "Title field is required";
  }
  if (Validator.isEmpty(data.date)) {
    errors.date = "Date is required";
  }
  if (!Validator.isDataURI(data.date)) {
    errors.date = "Date is incorrect";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
