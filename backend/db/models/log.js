export default (sequelize, DataTypes) => {
  const Log = sequelize.define(
    'Log',
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
      action: {
        type: DataTypes.STRING(100), // 예: 'login', 'create_post', 'like_post'
        allowNull: false,
      },
      target_type: {
        type: DataTypes.STRING(50), // 'post', 'memo', 'schedule' 등
      },
      target_id: {
        type: DataTypes.INTEGER,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'logs',
      timestamps: false,
    }
  );

  Log.associate = (models) => {
    Log.belongsTo(models.User, {
      foreignKey: 'user_id',
      onDelete: 'CASCADE',
    });
  };

  return Log;
};