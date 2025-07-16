export default (sequelize, DataTypes) => {
  const CommentLike = sequelize.define(
    'CommentLike',
    {
      user_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      comment_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'comment_likes',
      timestamps: false,
    }
  );

  CommentLike.associate = (models) => {
    models.User.belongsToMany(models.Comment, {
      through: 'comment_likes',
      foreignKey: 'user_id',
      otherKey: 'comment_id',
      as: 'LikedComments',
    });

    models.Comment.belongsToMany(models.User, {
      through: 'comment_likes',
      foreignKey: 'comment_id',
      otherKey: 'user_id',
      as: 'CommentLikers',
    });
  };

  return CommentLike;
};