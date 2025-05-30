const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Tarifa = sequelize.define('Tarifa', {
    id_tarifa: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    precio: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    id_agente: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    id_hotel: {
      type: DataTypes.STRING(40),
      allowNull: true,
    },
    id_tipos_cuartos: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    costo: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      comment: 'Significa el costo que da el proveedor',
    },
    incluye_desayuno: {
      type: DataTypes.TINYINT,
      allowNull: true,
    },
    precio_desayuno: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    precio_noche_extra: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
      comment: 'Precio por persona extra en habitación doble',
    },
    comentario_desayuno: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    precio_persona_extra: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    tipo_desayuno: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    activa: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
    }
  }, {
    tableName: 'tarifas',
    timestamps: false
  });

  Tarifa.associate = (models) => {
    Tarifa.belongsTo(models.Hotel, {
      foreignKey: 'id_hotel',
      as: 'hotel'
    });

    Tarifa.belongsTo(models.Agente, {
      foreignKey: 'id_agente',
      as: 'agente'
    });

    Tarifa.belongsTo(models.TipoCuarto, {
      foreignKey: 'id_tipos_cuartos',
      as: 'tipoCuarto'
    });
  };

  return Tarifa;
};
