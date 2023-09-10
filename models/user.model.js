const { Sequelize, DataTypes, Model } = require('sequelize');

class User extends Model {}

User.init({
    // Model attributes are defined here
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
    }
}, {
    // Other model options go here
    sequelize, // We need to pass the connection instance
    modelName: 'users' // We need to choose the model name
});

// the defined model is the class itself
console.log(User === sequelize.models.User); // true

// export default User;
module.exports = User;