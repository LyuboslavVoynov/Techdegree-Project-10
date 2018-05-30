'use strict';
module.exports = (sequelize, DataTypes) => {
  var Books = sequelize.define('Books', {
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Title required!'
        }},
      unique: false
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Author required!'
        }}
    },
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Genre required!'
        }}
    },
    first_published: {
      type: DataTypes.INTEGER,
      defaultValue: null,
      validate: {
        is:{
          args:["^(15|16|17|18|19|20)[0-9][0-9]"],
          msg: 'Enter a valid year!'
      }
    }
    }
  }, {
    timestamps: false, underscored: true
  });
  Books.associate = function(models) {
    // associations can be defined here
    // Book.belongsTo(models.Loan);
  };
  return Books;
};
