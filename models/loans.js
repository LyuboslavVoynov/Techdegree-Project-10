'use strict';
module.exports = (sequelize, DataTypes) => {
  var Loans = sequelize.define('Loans', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      validate: {
        isNumeric: true,
      },
    },
    book_id: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
      },
    },
    patron_id: {
      type: DataTypes.INTEGER,
      validate: {
        isNumeric: true,
      },
    },
    loaned_on: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
    return_by: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
    returned_on: {
      type: DataTypes.DATE,
      validate: {
        isDate: true,
      },
    },
  }, {timestamps: false, underscored: true});

  Loans.associate = function(models) {
    // associations can be defined here
  };
  return Loans;
};
