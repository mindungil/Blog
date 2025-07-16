export default (sequelize, DataTypes) => {
  const Schedule = sequelize.define(
    'Schedule',
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
      description: {
        type: DataTypes.TEXT,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
      },
      is_all_day: {
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
      tableName: 'schedules',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Schedule.associate = (models) => {
    Schedule.belongsTo(models.User, { foreignKey: 'user_id', onDelete: 'CASCADE' });
    Schedule.belongsToMany(models.Tag, { through: 'schedule_tags', foreignKey: 'schedule_id', onDelete: 'CASCADE' });
  };

  return Schedule;
};