export default (sequelize, DataTypes) => {
  const Reminder = sequelize.define(
    'Reminder',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      schedule_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      remind_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      method: {
        type: DataTypes.ENUM('email', 'popup', 'sms'),
        defaultValue: 'popup',
      },
      is_sent: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      tableName: 'reminders',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false, // updated_at 없음
    }
  );

  Reminder.associate = (models) => {
    Reminder.belongsTo(models.Schedule, {
      foreignKey: 'schedule_id',
      onDelete: 'CASCADE',
    });
  };

  return Reminder;
};