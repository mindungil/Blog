export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      username: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
    },
    {
      tableName: 'users',
      timestamps: true, // createdAt, updatedAt 자동 추가
      createdAt: 'created_at',
      updatedAt: 'updated_at',
      underscored: true, // 컬럼명을 snake_case로
    }
  );

  return User;
};
