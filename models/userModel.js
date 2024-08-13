const { DataTypes } = require('sequelize');
const sequelize = require('../config/config');
const jwt = require('jsonwebtoken');

const User = sequelize.define('User', {
    fullName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user', // Los roles pueden ser 'user' o 'admin'
    },
}, {
    timestamps: true,
});

User.prototype.generateAuthToken = function() {
    const token = jwt.sign({ id: this.id, email: this.email, role: this.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return token;
};

module.exports = User;