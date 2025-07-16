export default (sequelize, DataTypes) => {
  const UserRelation = sequelize.define(
    'UserRelation',
    {
      follower_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      following_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'user_relations',
      timestamps: false,
    }
  );

  UserRelation.associate = (models) => {
    models.User.belongsToMany(models.User, {
      as: 'Followers',
      through: 'user_relations',
      foreignKey: 'following_id',
      otherKey: 'follower_id',
    });

    models.User.belongsToMany(models.User, {
      as: 'Followings',
      through: 'user_relations',
      foreignKey: 'follower_id',
      otherKey: 'following_id',
    });
  };

  return UserRelation;
};