const Joi = require("joi");

const filtroHotelSchema = Joi.object({
  desayuno: Joi.string().allow(null, ""),
  activo: Joi.number().valid(0, 1).allow(null),
  acepta_mascotas: Joi.string().allow(null, ""),
  correo: Joi.string().email().allow(null, ""),
  doble_costo_max: Joi.number().allow(null),
  doble_costo_min: Joi.number().allow(null),
  doble_precio_max: Joi.number().allow(null),
  doble_precio_min: Joi.number().allow(null),
  estado: Joi.string().allow(null, ""),
  hay_convenio: Joi.string().allow(null, ""),
  nombre: Joi.string().allow(null, ""),
  rfc: Joi.string().allow(null, ""),
  razon_social: Joi.string().allow(null, ""),
  sencilla_costo_max: Joi.number().allow(null),
  sencilla_costo_min: Joi.number().allow(null),
  sencilla_precio_max: Joi.number().allow(null),
  sencilla_precio_min: Joi.number().allow(null),
  tipo_hospedaje: Joi.string().allow(null, ""),
  tipo_negociacion: Joi.string().allow(null, ""),
  tipo_pago: Joi.string().allow(null, ""),
  tiene_transportacion: Joi.string().allow(null, ""),
  pais: Joi.string().allow(null, "")
});

module.exports = {  filtroHotelSchema };
