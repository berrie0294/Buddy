// models/pizza.js
module.exports = (sequelize, DataTypes) => {
  const Pizza = sequelize.define('Pizza', {
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    breed: DataTypes.STRING,
    age: DataTypes.INTEGER,
    profilePicURL: DataTypes.STRING,
    photo1URL: DataTypes.STRING,
    photo2URL: DataTypes.STRING,
    photo3URL: DataTypes.STRING,
    number: DataTypes.INTEGER,
    email: DataTypes.STRING,
    locationLAT: DataTypes.FLOAT,
    locationLONG: DataTypes.FLOAT,
  });

  return Pizza;
};
