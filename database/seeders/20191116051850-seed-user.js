const hashing = require('../../service/common/hashing');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [
      {
        name: 'System',
        isSuperAdmin: false,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Admin',
        isSuperAdmin: true,
        isDeleted: false,
        email: 'admin@service.com',
        password: hashing.hashSync('Welcome123!'),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
