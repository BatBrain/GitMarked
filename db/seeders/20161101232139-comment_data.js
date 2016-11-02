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
    return queryInterface.bulkInsert('Comments', [{
        title: 'comment_1',
        text: 'your code is squeaky clean',
        createdAt: new Date(),
        updatedAt: new Date(),
        sub_assign_id: 7,
        line_start: 2,
        line_end: 3,
        file_id: 1
      }, {
        title: 'comment_2',
        text: 'your code is squeaky clean',
        createdAt: new Date(),
        updatedAt: new Date(),
        sub_assign_id: 7,
        line_start: 5,
        line_end: 5,
        file_id: 1
      }, {
        title: 'comment_1',
        text: 'your code is squeaky clean',
        createdAt: new Date(),
        updatedAt: new Date(),
        sub_assign_id: 7,
        line_start: 4,
        line_end: 5,
        file_id: 2
      }, {
        title: 'comment_2',
        text: 'your code is squeaky clean',
        createdAt: new Date(),
        updatedAt: new Date(),
        sub_assign_id: 7,
        line_start: 6,
        line_end: 11,
        file_id: 2
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
    return queryInterface.bulkDelete('Comments', null);
  }
};
