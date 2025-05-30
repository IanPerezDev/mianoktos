const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CadenaHotel = sequelize.define('CadenaHotel', {
    id_cadena: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    codigo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    tableName: 'cadenas_hoteles',
    timestamps: false
  });

  CadenaHotel.associate = (models) => {
    CadenaHotel.hasMany(models.Hotel, {
      foreignKey: 'id_cadena',
      as: 'hoteles'
    });
  };

  return CadenaHotel;
};
