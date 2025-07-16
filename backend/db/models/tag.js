export default (sequelize, DataTypes) => {
  const Tag = sequelize.define(
    'Tag',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'tags',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false, // updated_at 필드 없음
    }
  );

  Tag.associate = (models) => {
    Tag.belongsToMany(models.Post, { through: 'post_tags', foreignKey: 'tag_id', onDelete: 'CASCADE' });
    Tag.belongsToMany(models.Memo, { through: 'memo_tags', foreignKey: 'tag_id', onDelete: 'CASCADE' });
    Tag.belongsToMany(models.Schedule, { through: 'schedule_tags', foreignKey: 'tag_id', onDelete: 'CASCADE' });
  };

  return Tag;
};