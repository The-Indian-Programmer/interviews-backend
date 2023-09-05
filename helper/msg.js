module.exports.msg = function (code) {
  var codeArr = {};
  codeArr = {
    MSG001: "Invalid request data!",
    MSG002: "Something went wrong! Please try again.",
    MSG003: "Unauthorised user!",
    MSG004: "Email already exists!",
    MSG005: "UserName already exists!",
    MSG006: "Email does not exists!",
    MSG007: "Invalid email or password!",
    MSG008: "User created successfully!",
    MSG009: "LoggedIn successfully!",
    MSG010: "LogOut successfully!",
    MSG011: "User details fetched successfully!",
    MSG012: "File not found!",
    MSG013: "Files uploaded successfully!",
    MSG014: "Record found successfully!",
    MSG015: "Permission denied!",
    MSG016: "Post deleted successfully!",
    MSG017: "Profile upated successfully!",
    MSG018: "Can't follow yoursef!",
    MSG019: "Followed successfully!",
    MSG020: "Unfollowed successfully!",
    MSG021: "User found successfully!",
    MSG022: "Post created successfully!",
    MSG023: "Post updated successfully!",
    MSG024: "Comment added successfully!",
  };
  return typeof codeArr[code] !== "undefined" ? codeArr[code] : "";
};
