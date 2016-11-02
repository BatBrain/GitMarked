'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert('Files', [{
        file_path: 'setup.rb',
        comments: [1, 2],
        sub_assign_id: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      }, {
        file_path: 'exercises/exercise_1.rb',
        comments: [3, 4],
        sub_assign_id: 7,
        createdAt: new Date(),
        updatedAt: new Date()
      }]
    );
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
    return queryInterface.bulkDelete('Files', null);
  }
};
