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
    return queryInterface.bulkInsert('Assignments', [{
        name: 'Avatar Downloader',
        description: 'Use the GitHub API to retrieve mentor avatars.',
        createdAt: new Date(),
        updatedAt: new Date(),
        school_id: 9
      }, {
        name: 'Tiny App',
        description: 'A full stack web app that shortens long URLs.',
        createdAt: new Date(),
        updatedAt: new Date(),
        school_id: 9
      }, {
        name: 'Jungle',
        description: 'A project that throws a student into the wild.',
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
    return queryInterface.bulkDelete('Assignments', null);
  }
};
