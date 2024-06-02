'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pizzas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      password: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      breed: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.INTEGER
      },
      profilePicURL: {
        type: Sequelize.STRING
      },
      photo1URL: {
        type: Sequelize.STRING
      },
      photo2URL: {
        type: Sequelize.STRING
      },
      photo3URL: {
        type: Sequelize.STRING
      },
      number: {
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      locationLAT: {
        type: Sequelize.FLOAT
      },
      locationLONG: {
        type: Sequelize.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Pizzas');
  }
};
