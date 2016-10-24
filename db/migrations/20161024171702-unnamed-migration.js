'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return [
      queryInterface.addColumn('Students', 'school_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'school_id',
        references: {
          model: 'Schools',
          key: 'id'
        }
      }),
      queryInterface.addColumn('Mentors', 'school_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'school_id',
        references: {
          model: 'Schools',
          key: 'id'
        }
      }),
      queryInterface.addColumn('Assignments', 'school_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'school_id',
        references: {
          model: 'Schools',
          key: 'id'
        }
      }),
      queryInterface.addColumn('Submitted_Assignments', 'assignment_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'assignment_id',
        references: {
          model: 'Assignments',
          key: 'id'
        }
      }),
      queryInterface.addColumn('Submitted_Assignments', 'student_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'student_id',
        references: {
          model: 'Students',
          key: 'id'
        }
      }),
      queryInterface.addColumn('Submitted_Assignments', 'mentor_id', {
        type: Sequelize.INTEGER,
        allowNull: true,
        field: 'mentor_id',
        references: {
          model: 'Mentors',
          key: 'id'
        }
      }),
      queryInterface.addColumn('Comments', 'sub_assign_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        field: 'sub_assign_id',
        references: {
          model: 'Submitted_Assignments',
          key: 'id'
        }
      })
    ];
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return [
      queryInterface.removeColumn('Students', 'school_id'),
      queryInterface.removeColumn('Mentors', 'school_id'),
      queryInterface.removeColumn('Assignments', 'school_id'),
      queryInterface.removeColumn('Submitted_Assignments', 'assignment_id'),
      queryInterface.removeColumn('Submitted_Assignments', 'student_id'),
      queryInterface.removeColumn('Submitted_Assignments', 'mentor_id'),
      queryInterface.removeColumn('Comments', 'sub_assign_id')
    ];
  }
};
