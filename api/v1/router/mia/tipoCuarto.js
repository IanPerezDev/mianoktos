const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const TipoCuarto = sequelize.define('TipoCuarto', {
    id_tipo_cuarto: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    }
  }, {
    tableName: 'tipos_cuartos',
    timestamps: false
  });

  TipoCuarto.associate = (models) => {
    TipoCuarto.hasMany(models.Tarifa, {
      foreignKey: 'id_tipos_cuartos',
      as: 'tarifas'
    });
  };

  return TipoCuarto;
};
