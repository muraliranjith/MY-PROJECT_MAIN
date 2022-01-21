const bcrypt = require('bcryptjs');
const { roles } = require('../config/roles');

const User = (sequelize, DataTypes) => {
  const user = sequelize.define(
    'user',
    {
      name: {
        type: DataTypes.STRING,
        unique: false,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      isEmailVerified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          len: [7, 60],
        },
      },
      role: {
        type: DataTypes.STRING,
        enum: roles,
        defaultValue: 'user',
      },
    },
    {
      timestamps: false,
    }
  );

  /**
   * Check if email is taken
   * @param {string} email - The user's email
   * @returns {Promise<boolean>}
   */
  user.isEmailTaken = async function (email) {
    const userFound = await this.findOne({
      where: {
        email,
      },
    });
    return !!userFound;
  };

  user.beforeCreate(async (user) => {
    user.password = await user.generatePasswordHash();
  });

  user.beforeUpdate(async (user) => {
    user.password = await user.generatePasswordHash();
  });

  user.prototype.generatePasswordHash = async function () {
    const saltRounds = 10;
    return await bcrypt.hash(this.password, saltRounds);
  };

  /**
   * Check if password matches the user's password
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  user.prototype.isPasswordMatch = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return user;
};

module.exports = User;