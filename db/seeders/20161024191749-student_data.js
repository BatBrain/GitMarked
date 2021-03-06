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
    return queryInterface.bulkInsert('Students', [{
        first_name: 'Sol',
        last_name: 'Ferguson',
        github_name: 'BatBrain',
        createdAt: new Date(),
        updatedAt: new Date(),
        school_id: 9
      }, {
        first_name: 'Mats',
        last_name: 'Sundin',
        github_name: 'm-sundin',
        createdAt: new Date(),
        updatedAt: new Date(),
        school_id: 9
      }, {
        first_name: 'Curtis',
        last_name: 'Joseph',
        github_name: 'c-joseph',
        createdAt: new Date(),
        updatedAt: new Date(),
        school_id: 9
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
    return queryInterface.bulkDelete('Students', null);
  }
};
