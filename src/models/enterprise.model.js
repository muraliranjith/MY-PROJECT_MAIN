const bcrypt = require('bcryptjs');
const { roles } = require('../config/roles');

const Enterprise = (sequelize, DataTypes) => {
  const enterprise = sequelize.define(
    'enterprise',
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
        defaultValue: 'enterprise',
      },
    },
    {
      timestamps: false,
    }
  );

  /**
   * Check if email is taken
   * @param {string} email - The employee's email
   * @returns {Promise<boolean>}
   */
   enterprise.isEmailTaken= async function (email) {
    const EnterpriseFound = await this.findOne({
      where: {
        email,
      },
    });
    return !!EnterpriseFound;
  };
  
  enterprise.beforeCreate(async (enterprise) => {
    enterprise.password = await enterprise.generatePasswordHash();
  });

  enterprise.beforeUpdate(async (enterprise) => {
    enterprise.password = await enterprise.generatePasswordHash();
  });

  enterprise.prototype.generatePasswordHash = async function () {
    const saltRounds = 10;
    return await bcrypt.hash(this.password, saltRounds);
  };

  /**
   * Check if password matches the enterprise's password
   * @param {string} password
   * @returns {Promise<boolean>}
   */
   enterprise.prototype.isPasswordMatch = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return enterprise;
};

module.exports = Enterprise;