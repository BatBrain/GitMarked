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
        assignment_url: 'https://github.com/BatBrain/week2/tree/master/week2day1',
        status: 'Submitted',
        createdAt: new Date(),
        updatedAt: new Date(),
        assignment_id: 13,
        student_id: 11,
        mentor_id: 8
      }, {
        assignment_url: 'https://github.com/m-sundin/avatar-d',
        status: 'Submitted',
        createdAt: new Date(),
        updatedAt: new Date(),
        assignment_id: 13,
        student_id: 12,
        mentor_id: 8
      }, {
        assignment_url: 'https://github.com/c-joseph/avatar-downloader',
        status: 'Submitted',
        createdAt: new Date(),
        updatedAt: new Date(),
        assignment_id: 13,
        student_id: 13,
        mentor_id: 8
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
