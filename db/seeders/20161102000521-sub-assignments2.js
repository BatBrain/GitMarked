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
    return queryInterface.bulkInsert('Submitted_Assignments', [{
        assignment_url: 'https://github.com/FrankyTest/avatar-downloader',
        status: 'Marked',
        createdAt: new Date(),
        updatedAt: new Date(),
        assignment_id: 13,
        student_id: 14,
        mentor_id: 8
      }, {
        assignment_url: 'https://github.com/FrankyTest/tiny-app',
        status: 'Submitted',
        createdAt: new Date(),
        updatedAt: new Date(),
        assignment_id: 14,
        student_id: 14,
        mentor_id: null
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
    return queryInterface.bulkDelete('Submitted_Assignments', null);
  }
};
