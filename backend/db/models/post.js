export default (sequelize, DataTypes) => {
  const Post = sequelize.define(
    'Post',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
      },
      is_published: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updated_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'posts',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  // 관계 정의
  Post.associate = (models) => {
    Post.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    Post.belongsToMany(models.Tag, { through: 'post_tags', foreignKey: 'post_id', onDelete: 'CASCADE' });
  };

  return Post;
};