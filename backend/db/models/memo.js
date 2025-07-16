export default (sequelize, DataTypes) => {
  const Memo = sequelize.define(
    'Memo',
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
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
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
      tableName: 'memos',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Memo.associate = (models) => {
    Memo.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
  };

  Memo.associate = (models) => {
    Memo.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    Memo.belongsToMany(models.Tag, { through: 'memo_tags', foreignKey: 'memo_id', onDelete: 'CASCADE' });
  };

  return Memo;
};
