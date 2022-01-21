const bcrypt = require('bcryptjs');
const { roles } = require('../config/roles');

const Employee = (sequelize, DataTypes) => {
  const employee = sequelize.define(
    'employee',
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
        defaultValue: 'employee',
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
  employee.isEmailTaken = async function (email) {
    const employeeFound = await this.findOne({
      where: {
        email,
      },
    });
    return !!employeeFound;
  };

  employee.beforeCreate(async (employee) => {
    employee.password = await employee.generatePasswordHash();
  });

  employee.beforeUpdate(async (employee) => {
    employee.password = await employee.generatePasswordHash();
  });

  employee.prototype.generatePasswordHash = async function () {
    const saltRounds = 10;
    return await bcrypt.hash(this.password, saltRounds);
  };

  /**
   * Check if password matches the employee's password
   * @param {string} password
   * @returns {Promise<boolean>}
   */
  employee.prototype.isPasswordMatch = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

  return employee;
};

module.exports = Employee;