module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(64)
      },
      isSuperAdmin: {
        type: Sequelize.BOOLEAN
      },
      email: {
        type: Sequelize.STRING(64),
        unique: true
      },
      password: {
        type: Sequelize.STRING(256)
      },
      passwordResetToken: {
        type: Sequelize.STRING(512)
      },
      passwordResetExpires: {
        type: Sequelize.DATE
      },
      emailVerificationToken: {
        type: Sequelize.STRING(512)
      },
      emailVerificationExpires: {
        type: Sequelize.DATE
      },
      emailVerified: {
        type: Sequelize.BOOLEAN
      },
      facebookId: {
        type: Sequelize.STRING(64),
        unique: true
      },
      instagramId: {
        type: Sequelize.STRING(64),
        unique: true
      },
      googleId: {
        type: Sequelize.STRING(64),
        unique: true
      },
      isDeleted: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },
    {
      indexes: [
        {
            unique: true,
            fields: ['email', 'facebookId', 'instagramId', 'googleId'],
            where: { isDeleted: false }
        }
      ]
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};
