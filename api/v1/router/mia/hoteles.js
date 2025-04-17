const router = require("express").Router()
const controller = require("../../controller/hoteles")

router.get("/", controller.readGroupByHotel)


router.post("/Agregar-hotel",controller.AgregarHotel);
router.get("/Consultar-hoteles",controller.consultaHoteles);
router.patch("/Editar-hotel",controller.actualizaHotel)
router.patch("/Eliminar-hotel",controller.eliminaHotelLogico);
router.get("/Consultar-precio-sencilla/:id_hotel",controller.consultaPrecioSencilla);
router.get("/Consultar-precio-doble/:id_hotel",controller.consultaPrecioDoble);
router.get("/Filtra-hoteles/:opc",controller.filtra_hoteles);
module.exports = router;