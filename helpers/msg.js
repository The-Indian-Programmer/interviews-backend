module.exports.msg = function (code) {
    var codeArr = {};
    codeArr = {
      MSG001: "Invalid request data!",
      MSG002: "Something went wrong! Please try again.",
      MSG003: "Unauthorised user!",
      MSG004: "Email already exists!",
      MSG005: "UserName already exists!",
      MSG006: "Account does not exists!",
      MSG007: "Invalid password!",
      MSG008: "User created successfully!",
      MSG009: "LoggedIn successfully!",
      MSG010: "LogOut successfully!",
      MSG011: "User details fetched successfully!",
      MSG012: "Task created successfully!",
      MSG013: "Task updated successfully!",
      MSG014: "Record not found!",
      MSG015: "Record deleted successfully!",
      MSG016: "Record updated successfully!",
      MSG017: "Record found successfully!",
    };
    return typeof codeArr[code] !== "undefined" ? codeArr[code] : "";
  };