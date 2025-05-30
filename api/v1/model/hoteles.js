const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Hotel = sequelize.define('Hotel', {
    id_hotel: {
      type: DataTypes.STRING(40),
      primaryKey: true,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    id_cadena: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },
    correo: DataTypes.STRING(100),
    telefono: DataTypes.STRING(20),
    rfc: DataTypes.STRING(13),
    razon_social: DataTypes.STRING(100),
    direccion: DataTypes.STRING(250),
    latitud: DataTypes.STRING(50),
    longitud: DataTypes.STRING(50),
    convenio: DataTypes.TEXT,
    descripcion: DataTypes.TEXT,
    calificacion: DataTypes.FLOAT,
    tipo_hospedaje: DataTypes.ENUM('hotel', 'motel', 'casa', 'departamento'),
    cuenta_de_deposito: DataTypes.STRING(20),
    Estado: DataTypes.STRING(100),
    Ciudad_Zona: DataTypes.STRING(100),
    NoktosQ: DataTypes.BIGINT,
    NoktosQQ: DataTypes.BIGINT,
    MenoresEdad: DataTypes.STRING(200),
    PaxExtraPersona: DataTypes.STRING(200),
    DesayunoIncluido: DataTypes.STRING(200),
    DesayunoComentarios: DataTypes.STRING(200),
    DesayunoPrecioPorPersona: DataTypes.STRING(250),
    Transportacion: DataTypes.TEXT,
    TransportacionComentarios: DataTypes.TEXT,
    mascotas: DataTypes.TEXT,
    salones: DataTypes.TEXT,
    URLImagenHotel: DataTypes.TEXT,
    URLImagenHotelQ: DataTypes.TEXT,
    URLImagenHotelQQ: DataTypes.TEXT,
    Activo: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    Comentarios: DataTypes.TEXT,
    Id_Sepomex: DataTypes.INTEGER,
    CodigoPostal: DataTypes.STRING(10),
    Id_hotel_excel: DataTypes.INTEGER,
    Colonia: DataTypes.STRING(150),
    tipo_negociacion: DataTypes.STRING(45),
    vigencia_convenio: DataTypes.DATE,
    comentario_vigencia: DataTypes.TEXT,
    tipo_pago: DataTypes.STRING(45),
    disponibilidad_precio: DataTypes.TEXT,
    contacto_convenio: DataTypes.TEXT,
    contacto_recepcion: DataTypes.TEXT,
    iva: DataTypes.DECIMAL(5,2),
    ish: DataTypes.DECIMAL(5,2),
    otros_impuestos: DataTypes.DECIMAL(12,2),
    otros_impuestos_porcentaje: DataTypes.DECIMAL(5,2),
    comentario_pago: DataTypes.TEXT,
    pais: {
      type: DataTypes.STRING(45),
      defaultValue: 'MEXICO'
    },
    score_operaciones: DataTypes.INTEGER,
    score_sistemas: DataTypes.INTEGER,
  }, {
    tableName: 'hoteles',
    timestamps: false
  });

  Hotel.associate = (models) => {
    Hotel.belongsTo(models.CadenaHotel, {
      foreignKey: 'id_cadena',
      as: 'cadena'
    });
  };

  return Hotel;
};
