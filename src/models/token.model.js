const { tokenTypes } = require('../config/tokens');

const token = (sequelize, DataTypes) => {
  const Token = sequelize.define(
    'token',
    {
      token: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      type: {
        type: DataTypes.ENUM,
        values: [tokenTypes.REFRESH, tokenTypes.RESET_PASSWORD, tokenTypes.EMAIL_VERIFICATION],
        allowNull: false,
      },
      expires: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      blacklisted: {
        type: DataTypes.BOOLEAN,
        default: false,
      },
    },
    {
      timestamps: true,
    }
  );

  return Token;
};

module.exports = token;