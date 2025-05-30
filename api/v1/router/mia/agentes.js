const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Agente = sequelize.define('Agente', {
    id_agente: {
      type: DataTypes.STRING(40),
      primaryKey: true,
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
    tiene_credito_consolidado: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    monto_credito: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    notas: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    vendedor: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    tableName: 'agentes',
    timestamps: false, // Sequelize won't auto-manage timestamps
  });

  Agente.associate = (models) => {
    Agente.hasMany(models.Tarifa, {
      foreignKey: 'id_agente',
      as: 'tarifas'
    });
  };

  return Agente;
};
