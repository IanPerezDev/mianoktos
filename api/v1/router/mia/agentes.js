const middleware = require("../../middleware/validateParams");
const controller = require("../../controller/agentes");
const { executeQuery } = require("../../../../config/db");
const router = require("express").Router();

router.post("/", middleware.validateParams([]), controller.create);
router.get(
  "/viajeros-con-empresas",
  middleware.validateParams([]),
  controller.read
);
router.get(
  "/empresas-con-agentes",
  middleware.validateParams([]),
  controller.readAgentesCompanies
);
router.get(
  "/empresas-con-datos-fiscales",
  middleware.validateParams([]),
  controller.readEmpresasDatosFiscales
);
router.get("/agentes", middleware.validateParams([]), controller.readAgentes);
router.get("/get-agente-id/", controller.getAgenteId);

//ESTE SI LO OCUPO
router.get("/all", async (req, res) => {
  try {
    console.log(req.query);
    const { query } = req;
    const { filterType = "Creacion" } = query;
    let conditions = [];
    let values = [];
    let type_filters = {
      "Check-in": "a.created_at",
      "Check-out": "a.created_at",
      Transaccion: "a.created_at",
      Creacion: "a.created_at",
    };

    if (query.startDate && query.endDate) {
      conditions.push(`${type_filters[filterType]} BETWEEN ? AND ?`);
      values.push(query.startDate, query.endDate);
    } else if (query.startDate) {
      conditions.push(`${type_filters[filterType]} >= ?`);
      values.push(query.startDate);
    } else if (query.endDate) {
      conditions.push(`${type_filters[filterType]} <= ?`);
      values.push(query.endDate);
    }

    if (query.startCantidad && query.endCantidad) {
      conditions.push(`a.monto_credito BETWEEN ? AND ?`);
      values.push(query.startCantidad, query.endCantidad);
    } else if (query.startCantidad) {
      conditions.push(`a.monto_credito >= ?`);
      values.push(query.startCantidad);
    } else if (query.endCantidad) {
      conditions.push(`a.monto_credito <= ?`);
      values.push(query.endCantidad);
    }

    if (query.vendedor) {
      conditions.push(`a.vendedor LIKE ?`);
      values.push(`%${query.vendedor.split(" ").join("%")}%`);
    }
    if (query.notas) {
      conditions.push(`a.notas LIKE ?`);
      values.push(`%${query.notas.split(" ").join("%")}%`);
    }
    if (query.estado_credito) {
      conditions.push(`a.tiene_credito_consolidado = ?`);
      values.push(query.estado_credito == "Activo" ? 1 : 0);
    }
    if (query.telefono) {
      conditions.push(`vw.telefono LIKE ?`);
      values.push(`%${query.telefono.toString().split(" ").join("%")}%`);
    }
    if (query.correo) {
      conditions.push(`vw.correo LIKE ?`);
      values.push(`%${query.correo.toString().split(" ").join("%")}%`);
    }
    if (query.client) {
      conditions.push(
        `(CONCAT_WS(' ', vw.primer_nombre, vw.segundo_nombre, vw.apellido_paterno, vw.apellido_materno) LIKE ? OR a.id_agente LIKE ?)`
      );
      values.push(`%${query.client.split(" ").join("%")}%`);
      values.push(`%${query.client.split(" ").join("%")}%`);
    }

    const queryget = `
select
  vw.*,
	CONCAT_WS(' ', vw.primer_nombre, vw.segundo_nombre, vw.apellido_paterno, vw.apellido_materno) AS nombre_agente_completo,
  a.*
FROM agentes as a
JOIN vw_details_agente as vw ON vw.id_agente = a.id_agente
WHERE vw.correo is not null ${
      conditions.length ? "AND " + conditions.join(" AND ") : ""
    }
order by a.created_at desc;
`;
    const response = await executeQuery(queryget, values);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error server", details: error });
  }
});
//Extrae los datos del agente por id
router.get("/id", async (req, res) => {
  try {
    const query = `select vw_details_agente.*, agentes.tiene_credito_consolidado, agentes.monto_credito from agentes JOIN vw_details_agente ON vw_details_agente.id_agente = agentes.id_agente WHERE vw_details_agente.id_agente = ?;`;
    const response = await executeQuery(query, [req.query.id]);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error server", details: error });
  }
});

module.exports = router;
