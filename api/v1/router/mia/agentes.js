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

//En proceso de prueba y error
//Extrae a todos los agentes con los datos del primer viajero que tienen
router.get("/all", async (req, res) => {
  try {
    const query = `
select
  vw.*,
	CONCAT_WS(' ', vw.primer_nombre, vw.segundo_nombre, vw.apellido_paterno, vw.apellido_materno) AS nombre_agente_completo,
  a.tiene_credito_consolidado,
  a.monto_credito,
  a.notas,
  a.vendedor,
  a.created_at
FROM agentes as a
JOIN vw_details_agente as vw ON vw.id_agente = a.id_agente
order by a.created_at desc;
`;
    const response = await executeQuery(query);
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
