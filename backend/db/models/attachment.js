export default (sequelize, DataTypes) => {
  const Attachment = sequelize.define(
    'Attachment',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      file_url: {
        type: DataTypes.STRING(500),
        allowNull: false,
      },
      file_name: {
        type: DataTypes.STRING(255),
      },
      file_type: {
        type: DataTypes.STRING(100),
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      post_id: {
        type: DataTypes.INTEGER,
      },
      memo_id: {
        type: DataTypes.INTEGER,
      },
      schedule_id: {
        type: DataTypes.INTEGER,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'attachments',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  Attachment.associate = (models) => {
    Attachment.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    Attachment.belongsTo(models.Post, { foreignKey: 'post_id', onDelete: 'CASCADE' });
    Attachment.belongsTo(models.Memo, { foreignKey: 'memo_id', onDelete: 'CASCADE' });
    Attachment.belongsTo(models.Schedule, { foreignKey: 'schedule_id', onDelete: 'CASCADE' });
  };

  return Attachment;
};