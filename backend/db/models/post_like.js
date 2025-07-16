export default (sequelize, DataTypes) => {
  const PostLike = sequelize.define(
    'PostLike',
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      post_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'post_likes',
      timestamps: false,
    }
  );

  PostLike.associate = (models) => {
    models.User.belongsToMany(models.Post, {
      through: 'post_likes',
      foreignKey: 'user_id',
      otherKey: 'post_id',
      as: 'LikedPosts',
    });

    models.Post.belongsToMany(models.User, {
      through: 'post_likes',
      foreignKey: 'post_id',
      otherKey: 'user_id',
      as: 'PostLikers',
    });
  };

  return PostLike;
};