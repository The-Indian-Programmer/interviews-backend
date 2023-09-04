const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");
const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profile: {
    name: String,
    profilePicture: String,
    bio: String,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
}, { timestamps: true });


userSchema.methods.generateAuthToken = async function () {
    try {
      const token = await jwt.sign({ _id: this._id }, process.env.SECRET_TOKEN);
      this.tokens = this.tokens.concat({ token: token });

      await this.save();

      return token;
    } catch (error) {
      console.log(`Error is ${error}`);
    }
  };

userSchema.pre('save', function(next) {
    const user = this;

    if (!user.isModified('password')) return next();

    const hashPasswod = helper.encrypt(user.password);
    user.password = hashPasswod;

    // const token = jwt.sign({ _id: user._id }, process.env.SECRET_TOKEN);
    // user.tokens = user.tokens.concat({ token: token });
    
    next();
});

const User = mongoose.model('users', userSchema);

module.exports = User;
