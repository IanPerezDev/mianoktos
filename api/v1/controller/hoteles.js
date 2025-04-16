const {executeSP, executeQuery} = require("../../../config/db");
const { v4: uuidv4 } = require("uuid");


const AgregarHotel = async (req, res) => {
  console.log('Llegó al endpoint de agregar hotel');
  
  try {
    // Extraer datos del cuerpo de la solicitud con valores por defecto
    const {
      // Datos básicos del hotel
      id_excel,
      tipo_negociacion = null,
      nombre,
      id_cadena,
      correo = null,
      telefono = null,
      rfc = null,
      razon_social = null,
      direccion,
      latitud = null,
      longitud = null,
      estado,
      ciudad_zona,
      codigoPostal = null,
      colonia = null,
      tipo_hospedaje = 'hotel',
      cuenta_de_deposito = null,
      vigencia_convenio = null,
      tipo_pago = null,
      disponibilidad_precio = null,
      contacto_convenio = null,
      contacto_recepcion = null,
      impuestos_porcentaje = null,
      impuestos_moneda = null,
      menoresEdad = null,
      paxExtraPersona = null,
      transportacion = null,
      transportacionComentarios = null,
      urlImagenHotel = null,
      urlImagenHotelQ = null,
      urlImagenHotelQQ = null,
      calificacion = null,
      activo = 1,
      
      // Datos de desayuno (estructura opcional)
      desayuno = {
        sencilla: { incluye: false, costo: null, precio: null },
        doble: { incluye: false, costo: null, precio: null, costo_extra: null },
        comentarios: null
      },
      
      // Tarifas (estructura opcional)
      tarifas = {
        general: {
          costo_q: null,
          precio_q: null,
          costo_qq: null,
          precio_qq: null
        },
        preferenciales: []
      }
    } = req.body;

    // Validar campos obligatorios
    if (!nombre || !id_cadena || !direccion || !estado || !ciudad_zona) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos obligatorios: nombre, id_cadena, direccion, estado, ciudad_zona"
      });
    }

    // Generar ID único para el hotel
    const id_hotel = `emp-${uuidv4()}`;

    // Preparar tarifas preferenciales (manejar caso cuando no vienen)
    const tarifas_preferenciales_json = tarifas.preferenciales && tarifas.preferenciales.length > 0 
      ? JSON.stringify(tarifas.preferenciales) 
      : null;

    // Ejecutar el stored procedure
    const result = await executeSP("sp_inserta_hotel3", [
      // Datos del hotel
      id_excel || null,
      tipo_negociacion,
      nombre,
      id_cadena,
      correo,
      telefono,
      rfc,
      razon_social,
      direccion,
      latitud,
      longitud,
      estado,
      ciudad_zona,
      codigoPostal,
      colonia,
      tipo_hospedaje,
      cuenta_de_deposito,
      vigencia_convenio,
      tipo_pago,
      disponibilidad_precio,
      contacto_convenio,
      contacto_recepcion,
      impuestos_porcentaje,
      impuestos_moneda,
      menoresEdad,
      paxExtraPersona,
      transportacion,
      transportacionComentarios,
      urlImagenHotel,
      urlImagenHotelQ,
      urlImagenHotelQQ,
      calificacion,
      activo,
      
      // Datos de desayuno
      desayuno.sencilla.incluye,
      desayuno.sencilla.costo,
      desayuno.sencilla.precio,
      desayuno.doble.incluye,
      desayuno.doble.costo,
      desayuno.doble.precio,
      desayuno.doble.costo_extra,
      desayuno.comentarios,
      
      // Tarifa general
      tarifas.general.costo_q,
      tarifas.general.precio_q,
      tarifas.general.costo_qq,
      tarifas.general.precio_qq,
      
      // Tarifas preferenciales (JSON)
      tarifas_preferenciales_json
    ],false);

    res.status(200).json({ 
      success: true, 
      data: {
        hotel_creado: result,
        message: "Hotel creado exitosamente"
      } 
    });

  } catch (error) {
    console.error('Error en AgregarHotel:', error);
    res.status(500).json({
      success: false,
      message: "Error al crear el hotel",
      error: error.message
    });
  }
};
const consultaHoteles= async (req,res) => {
    //console.log("Verificando que llegamos a est endpoint")
    try {
      const hoteles = await executeSP("sp_nuevo_get_hoteles",[],false);
      if(!hoteles){
        res.status(404).json({message: "No se encontraron hoteles registrados"});
      }else{
        res.status(200).json({message: "Hoteles recuperados con exito",data: hoteles});
      }
    } catch (error) {
      res.status(500).json({message: "Error interno del srvidor"});
    }
  }
  const actualizaHotel = async (req, res) => {
    const {
      id_hotel,
      id_cadena,
      nombre,
      correo,
      telefono,
      rfc,
      razon_social,
      direccion,
      latitud,
      longitud,
      convenio,
      descripcion,
      calificacion,
      tipo_hospedaje,
      cuenta_de_deposito,
      Estado,
      Ciudad_Zona,
      NoktosQ,
      NoktosQQ,
      MenoresEdad,
      PaxExtraPersona,
      DesayunoIncluido,
      DesayunoComentarios,
      DesayunoPrecioPorPersona,
      Transportacion,
      TransportacionComentarios,
      URLImagenHotel,
      URLImagenHotelQ,
      URLImagenHotelQQ,
      Activo,
      Comentarios,
      Id_Sepomex,
      CodigoPostal,
      Id_hotel_excel
    } = req.body;
    //console.log("id_cadena (typeof):", id_cadena, typeof id_cadena);
    try {
      const hotel_actualizado = await executeSP("sp_actualizar_hotel", [
        id_hotel,
        id_cadena,
        nombre,
        correo,
        telefono,
        rfc,
        razon_social,
        direccion,
        latitud,
        longitud,
        convenio,
        descripcion,
        calificacion,
        tipo_hospedaje,
        cuenta_de_deposito,
        Estado,
        Ciudad_Zona,
        NoktosQ,
        NoktosQQ,
        MenoresEdad,
        PaxExtraPersona,
        DesayunoIncluido,
        DesayunoComentarios,
        DesayunoPrecioPorPersona,
        Transportacion,
        TransportacionComentarios,
        URLImagenHotel,
        URLImagenHotelQ,
        URLImagenHotelQQ,
        Activo,
        Comentarios,
        Id_Sepomex,
        CodigoPostal,
        Id_hotel_excel
      ],false);
  
      res.status(200).json({
        success: true,
        message: "Hotel actualizado correctamente",
        data: hotel_actualizado
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error al actualizar el hotel",
        error: error.message
      });
    }
  };

  const eliminaHotelLogico = async (req,res) => {
    const {id_hotel}= req.body;
    try {
      const borrado = await executeSP("elimina_hotel_logico",[id_hotel],false);
      res.status(200).json({message: "Eliminacion exitosa del hotel ",data_borrada: borrado})
    } catch (error) {
      res.status(500).json({message: "error interno del servidor", error:error});
    }
  }
  const consultaPrecioSencilla = async (req, res) => {
    // Tomamos el id_hotel desde params o query
    const id_hotel = req.params.id_hotel || req.query.id_hotel;
  
    //console.log("ID hotel recibido:", id_hotel);
  
    if (!id_hotel) {
      return res.status(400).json({ message: "Falta el parámetro id_hotel" });
    }
  
    try {
      const result = await executeSP("get_precio_habitacion_sencilla", [id_hotel],false);
      //console.log(result)
      const precio_sencilla = result?.[0]?.precio_sencilla  
      if (precio_sencilla === undefined) {
        return res
          .status(404)
          .json({ message: "No se encontró el precio de la habitación sencilla" });
      }
  
      res.status(200).json({ message: "Precio encontrado", precio: precio_sencilla });
    } catch (error) {
      console.error("Error ejecutando SP:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };
  
  const consultaPrecioDoble = async (req, res) => {
    // Tomamos el id_hotel desde params o query
    const id_hotel = req.params.id_hotel || req.query.id_hotel;
  
    //console.log("ID hotel recibido:", id_hotel);
  
    if (!id_hotel) {
      return res.status(400).json({ message: "Falta el parámetro id_hotel" });
    }
  
    try {
      const result = await executeSP("get_precio_habitacion_doble", [[id_hotel]],false);
  
      // Si el resultado viene como: [ { precio_doble: '4200.00' } ]
      const precio_doble = result?.[0]?.precio_doble;
  
      if (precio_doble == null) {
        return res
          .status(404)
          .json({ message: "No se encontró el precio de la habitación doble" });
      }
  
      res.status(200).json({
        message: "Precio encontrado",
        precio: parseFloat(precio_doble),
      });
    } catch (error) {
      console.error("Error ejecutando SP:", error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  };

  const filtra_hoteles = async (req,res) => {
    const opc = req.params;
    if(opc==1){
      try {
        const hoteles_activos = await executeSP("sp_hoteles_activos",[],false);
        res.status(200).json({message: "Hoteles activos recuperados",data: hoteles_activos});
      } catch (error) {
        res.status(500).json({message: "Error interno del servidor", errorinfo: error})
      }
    }else if(opc==2){
      try {
        const hoteles_inactivos = await executeSP("sp_hoteles_inactivos",[],false);
        res.status(200).json({message: "Hoteles inactivos recuperados",data: hoteles_inactivos});
      } catch (error) {
        res.status(500).json({message: "Error interno del servidor", errorinfo: error})
      }
    }
    
  };
  const  idcadena_por_codigo = async (req,res) => {
    
  }
  
  module.exports = {AgregarHotel,consultaHoteles,actualizaHotel,
    eliminaHotelLogico,consultaPrecioSencilla,consultaPrecioDoble,filtra_hoteles}