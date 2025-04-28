const { executeQuery, executeTransaction } = require("../../../config/db");
const { v4: uuidv4 } = require("uuid");

const createReservaFromOperaciones = async (body) => {
  try {
    const { solicitud } = body;
    const id_servicio = `ser-${uuidv4()}`;
    const query_servicio = `INSERT INTO servicios (id_servicio, total, subtotal, impuestos, is_credito, otros_impuestos, fecha_limite_pago) VALUES (?,?,?,?,?,?,?);`;
    const params_servicio = [
      id_servicio,
      solicitud.total,
      parseFloat((solicitud.total * 0.84).toFixed(2)),
      parseFloat((solicitud.total * 0.16).toFixed(2)),
      true,
      null,
      null,
    ];

    const response = await executeTransaction(
      query_servicio,
      params_servicio,
      async (results, connection) => {
        try {
          const id_solicitud = `sol-${uuidv4()}`;
          const query_solicitudes = `INSERT INTO solicitudes (id_solicitud, id_servicio, id_usuario_generador, confirmation_code, id_viajero, hotel, check_in, check_out, room, total, status) VALUES (?,?,?,?,?,?,?,?,?,?,?);`;
          const {
            confirmation_code,
            id_viajero,
            hotel,
            check_in,
            check_out,
            room,
            total,
            status,
            id_usuario_generador,
          } = solicitud;
          const params_solicitud = [
            id_solicitud,
            id_servicio,
            id_usuario_generador,
            confirmation_code,
            id_viajero,
            hotel,
            check_in,
            check_out,
            room,
            total,
            status,
          ];
          const response_solicitudes = await connection.execute(
            query_solicitudes,
            params_solicitud
          );

          const id_booking = `boo-${uuidv4()}`;
          const {
            estado,
            nombre_hotel,
            subtotal,
            impuestos,
            tipo_cuarto,
            noches,
            costo_subtotal,
            costo_total,
            costo_impuestos,
            codigo_reservacion_hotel,
            items,
          } = body;
          const query = `INSERT INTO bookings (id_booking, id_servicio, check_in, check_out, total, subtotal, impuestos, estado, costo_total, costo_subtotal, costo_impuestos, fecha_pago_proveedor, fecha_limite_cancelacion, id_solicitud ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
          const params = [
            id_booking,
            id_servicio,
            check_in,
            check_out,
            total,
            subtotal,
            impuestos,
            estado,
            costo_total,
            costo_subtotal,
            costo_impuestos,
            null,
            null,
            id_solicitud,
          ];
          const response_booking = await connection.execute(query, params);

          const id_hospedaje = `hos-${uuidv4()}`;
          const query_hospedaje = `INSERT INTO hospedajes (id_hospedaje, id_booking, nombre_hotel, cadena_hotel, codigo_reservacion_hotel, tipo_cuarto, noches, is_rembolsable, monto_penalizacion, conciliado, credito) VALUES (?,?,?,?,?,?,?,?,?,?,?);`;
          const params_hospedaje = [
            id_hospedaje,
            id_booking,
            nombre_hotel,
            null,
            codigo_reservacion_hotel,
            tipo_cuarto,
            noches,
            null,
            null,
            null,
            null,
          ];
          const response_hospedaje = await connection.execute(
            query_hospedaje,
            params_hospedaje
          );

          const itemsConId = items.map((item) => ({
            ...item,
            id_item: `ite-${uuidv4()}`,
            costo_total: item.total,
            costo_subtotal: parseFloat(item.subtotal.toFixed(2)),
            costo_impuestos: parseFloat(item.impuestos.toFixed(2)),
            costo_iva: parseFloat(item.total.toFixed(2)),
          }));
          const query_items = `INSERT INTO items (id_item, id_catalogo_item, id_factura, total, subtotal, impuestos, is_facturado, fecha_uso, id_hospedaje, costo_total, costo_subtotal, costo_impuestos, costo_iva, saldo) VALUES ${itemsConId
            .map((item) => "(?, ?,?,?,?,?,?,?,?, ?, ?, ?, ?, ?)")
            .join(",")};`;
          const params_items = itemsConId.flatMap((item) => [
            item.id_item,
            null,
            null,
            item.total,
            item.subtotal,
            item.impuestos,
            null,
            new Date().toISOString().split("T")[0],
            id_hospedaje,
            item.costo_total,
            item.costo_subtotal,
            item.costo_impuestos,
            item.costo_iva,
            item.total,
          ]);
          const response_items = await connection.execute(
            query_items,
            params_items
          );

          const id_pago_credito = `pag-${uuidv4()}`;
          const query_pagos = `INSERT INTO pagos(id_pago, id_servicio, monto_a_credito, responsable_pago_empresa, responsable_pago_agente, fecha_creacion, pago_por_credito, pendiente_por_cobrar, total, subtotal, impuestos) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`;
          const params_pagos = [
            id_pago_credito,
            id_servicio,
            solicitud.total,
            id_usuario_generador,
            null,
            new Date().toISOString().split("T")[0],
            0,
            true,
            solicitud.total,
            parseFloat((solicitud.total * 0.84).toFixed(2)),
            parseFloat((solicitud.total * 0.16).toFixed(2)),
          ];
          const response_pagos = await connection.execute(
            query_pagos,
            params_pagos
          );

          // Insertar en items_pagos
          const query_items_pagos = `
        INSERT INTO items_pagos (id_item, id_pago, monto)
        VALUES ${itemsConId.map(() => "(?, ?, ?)").join(",")};
      `;

          const params_items_pagos = itemsConId.flatMap((item) => [
            item.id_item,
            id_pago_credito,
            item.total,
          ]);

          await connection.execute(query_items_pagos, params_items_pagos);

          const taxesData = [];

          itemsConId.forEach((item) => {
            if (item.taxes && item.taxes.length > 0) {
              item.taxes.forEach((tax) => {
                taxesData.push({
                  id_item: item.id_item,
                  id_impuesto: 1, //Checar bien el cambio
                  base: tax.base,
                  total: tax.total,
                });
              });
            }
          });
          if (taxesData.length > 0) {
            const query_impuestos_items = `
    INSERT INTO impuestos_items (id_impuesto, id_item, base, total)
    VALUES ${taxesData.map(() => "(?, ?, ?, ?)").join(", ")};
  `;
            const params_impuestos_items = taxesData.flatMap((t) => [
              t.id_impuesto,
              t.id_item,
              t.base,
              t.total,
            ]);
            const response_impuestos_items = await connection.execute(
              query_impuestos_items,
              params_impuestos_items
            );
          }
        } catch (error) {
          throw error;
        }
      }
    );

    return { response, message: "Done" };
  } catch (error) {
    throw error;
  }
};

const insertarReserva = async (solicitud) => {
  try {
    const id_booking = `boo-${uuidv4()}`;
    const id_hospedaje = `hos-${uuidv4()}`;
    const {
      id_servicio,
      estado,
      check_in,
      check_out,
      id_viajero,
      nombre_hotel,
      total,
      subtotal,
      impuestos,
      tipo_cuarto,
      noches,
      costo_subtotal,
      costo_total,
      costo_impuestos,
      codigo_reservacion_hotel,
      items,
      id_solicitud,
    } = solicitud;
    console.log("Params Items:", solicitud);
    const query = `INSERT INTO bookings (id_booking, id_servicio, check_in, check_out, total, subtotal, impuestos, estado, costo_total, costo_subtotal, costo_impuestos, fecha_pago_proveedor, fecha_limite_cancelacion, id_solicitud ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);`;
    const params = [
      id_booking,
      id_servicio,
      check_in,
      check_out,
      total,
      subtotal,
      impuestos,
      estado,
      costo_total,
      costo_subtotal,
      costo_impuestos,
      null,
      null,
      id_solicitud,
    ];

    const response = await executeTransaction(
      query,
      params,
      async (results, connection) => {
        try {
          const query_hospedaje = `INSERT INTO hospedajes (id_hospedaje, id_booking, nombre_hotel, cadena_hotel, codigo_reservacion_hotel, tipo_cuarto, noches, is_rembolsable, monto_penalizacion, conciliado, credito) VALUES (?,?,?,?,?,?,?,?,?,?,?);`;
          const params_hospedaje = [
            id_hospedaje,
            id_booking,
            nombre_hotel,
            null,
            codigo_reservacion_hotel,
            tipo_cuarto,
            noches,
            null,
            null,
            null,
            null,
          ];

          const response_hospedaje = await connection.execute(
            query_hospedaje,
            params_hospedaje
          );

          const query_pago = `SELECT id_pago FROM pagos WHERE id_servicio = ? LIMIT 1;`;
          const [rows] = await connection.execute(query_pago, [id_servicio]);

          if (rows.length === 0) {
            const query_pago = `SELECT id_credito FROM pagos_credito WHERE id_servicio = ? LIMIT 1;`;
            const [rowss] = await connection.execute(query_pago, [id_servicio]);
            if (rowss.length === 0) {
              console.log("errrror");
              throw new Error(
                `No se encontró un pago para el servicio ${id_servicio}`
              );
            }
            console.log("credito");
            const itemsConId = items.map((item) => ({
              ...item,
              id_item: `ite-${uuidv4()}`,
              costo_total: item.total,
              costo_subtotal: parseFloat(item.subtotal.toFixed(2)),
              costo_impuestos: parseFloat(item.impuestos.toFixed(2)),
              costo_iva: parseFloat(item.total.toFixed(2)),
              saldo: parseFloat(0),
            }));
            const query_items = `INSERT INTO items (id_item, id_catalogo_item, id_factura, total, subtotal, impuestos, is_facturado, fecha_uso, id_hospedaje, costo_total, costo_subtotal, costo_impuestos, costo_iva,saldo) VALUES ${itemsConId
              .map((item) => "(?, ?,?,?,?,?,?,?,?, ?, ?, ?, ?, ?)")
              .join(",")};`;

            const params_items = itemsConId.flatMap((item) => [
              item.id_item,
              null,
              null,
              item.total,
              item.subtotal,
              item.impuestos,
              null,
              new Date().toISOString().split("T")[0],
              id_hospedaje,
              item.costo_total,
              item.costo_subtotal,
              item.costo_impuestos,
              item.costo_iva,
              item.saldo,
            ]);

            const response_items = await connection.execute(
              query_items,
              params_items
            );

            const taxesData = [];

            itemsConId.forEach((item) => {
              if (item.taxes && item.taxes.length > 0) {
                item.taxes.forEach((tax) => {
                  taxesData.push({
                    id_item: item.id_item,
                    id_impuesto: 1, //Checar bien el cambio
                    base: tax.base,
                    total: tax.total,
                  });
                });
              }
            });
            console.log(taxesData);

            if (taxesData.length > 0) {
              const query_impuestos_items = `
            INSERT INTO impuestos_items (id_impuesto, id_item, base, total)
            VALUES ${taxesData.map(() => "(?, ?, ?, ?)").join(", ")};
          `;

              const params_impuestos_items = taxesData.flatMap((t) => [
                t.id_impuesto,
                t.id_item,
                t.base,
                t.total,
              ]);

              const response_impuestos_items = await connection.execute(
                query_impuestos_items,
                params_impuestos_items
              );
            }

            const response_solicitud = await connection.execute(
              `UPDATE solicitudes SET status = "complete" WHERE id_solicitud = ?;`,
              [id_solicitud]
            );

            return { response_hospedaje, response_items, response_solicitud };
          }
          //pago de contado
          else {
            const id_pago = rows[0].id_pago;

            console.log("gola");
            const itemsConId = items.map((item) => ({
              ...item,
              id_item: `ite-${uuidv4()}`,
              costo_total: item.total,
              costo_subtotal: parseFloat(item.subtotal.toFixed(2)),
              costo_impuestos: parseFloat(item.impuestos.toFixed(2)),
              costo_iva: parseFloat(item.total.toFixed(2)),
            }));
            const query_items = `INSERT INTO items (id_item, id_catalogo_item, id_factura, total, subtotal, impuestos, is_facturado, fecha_uso, id_hospedaje, costo_total, costo_subtotal, costo_impuestos, costo_iva) VALUES ${itemsConId
              .map((item) => "(?, ?,?,?,?,?,?,?,?, ?, ?, ?, ?)")
              .join(",")};`;

            const params_items = itemsConId.flatMap((item) => [
              item.id_item,
              null,
              null,
              item.total,
              item.subtotal,
              item.impuestos,
              null,
              new Date().toISOString().split("T")[0],
              id_hospedaje,
              item.costo_total,
              item.costo_subtotal,
              item.costo_impuestos,
              item.costo_iva,
            ]);

            const response_items = await connection.execute(
              query_items,
              params_items
            );

            // Insertar en items_pagos
            const query_items_pagos = `
            INSERT INTO items_pagos (id_item, id_pago, monto)
            VALUES ${itemsConId.map(() => "(?, ?, ?)").join(",")};
          `;

            const params_items_pagos = itemsConId.flatMap((item) => [
              item.id_item,
              id_pago,
              item.total,
            ]);

            await connection.execute(query_items_pagos, params_items_pagos);

            const taxesData = [];

            itemsConId.forEach((item) => {
              if (item.taxes && item.taxes.length > 0) {
                item.taxes.forEach((tax) => {
                  taxesData.push({
                    id_item: item.id_item,
                    id_impuesto: 1, //Checar bien el cambio
                    base: tax.base,
                    total: tax.total,
                  });
                });
              }
            });
            console.log(taxesData);

            if (taxesData.length > 0) {
              const query_impuestos_items = `
            INSERT INTO impuestos_items (id_impuesto, id_item, base, total)
            VALUES ${taxesData.map(() => "(?, ?, ?, ?)").join(", ")};
          `;

              const params_impuestos_items = taxesData.flatMap((t) => [
                t.id_impuesto,
                t.id_item,
                t.base,
                t.total,
              ]);

              const response_impuestos_items = await connection.execute(
                query_impuestos_items,
                params_impuestos_items
              );
            }

            const response_solicitud = await connection.execute(
              `UPDATE solicitudes SET status = "complete" WHERE id_solicitud = ?;`,
              [id_solicitud]
            );

            return { response_hospedaje, response_items, response_solicitud };
          }
        } catch (error) {
          throw error;
        }
      }
    );

    return response;
  } catch (error) {
    throw error; // Lanza el error para que puedas manejarlo donde llames la función
  }
};

const getReserva = async () => {
  try {
    const query = `select * from bookings left join hospedajes on bookings.id_booking = hospedajes.id_booking;`;

    // Ejecutar el procedimiento almacenado
    const response = await executeQuery(query);

    return response; // Retorna el resultado de la ejecución
  } catch (error) {
    throw error; // Lanza el error para que puedas manejarlo donde llames la función
  }
};
const getReservaById = async (id) => {
  try {
    const query = `select 
s.id_servicio,
s.created_at,
s.is_credito,
so.id_solicitud,
so.confirmation_code,
so.hotel,
so.check_in,
so.check_out,
so.room,
so.total,
so.id_usuario_generador,
b.id_booking, 
h.codigo_reservacion_hotel, 
p.id_pago, 
p.pendiente_por_cobrar,
p.monto_a_credito,
fp.id_factura,
vw.primer_nombre,
vw.apellido_paterno
from solicitudes as so
LEFT JOIN servicios as s ON so.id_servicio = s.id_servicio
LEFT JOIN bookings as b ON so.id_solicitud = b.id_solicitud
LEFT JOIN hospedajes as h ON b.id_booking = h.id_booking
LEFT JOIN pagos as p ON so.id_servicio = p.id_servicio
LEFT JOIN facturas_pagos as fp ON p.id_pago = fp.id_pago
LEFT JOIN viajeros_con_empresas_con_agentes as vw ON vw.id_agente = so.id_viajero
WHERE id_usuario_generador in (
	select id_empresa 
	from empresas_agentes 
	where id_agente = ?
) or id_usuario_generador = ?
GROUP BY so.id_solicitud
ORDER BY s.created_at DESC;`;

    // Ejecutar el procedimiento almacenado
    const response = await executeQuery(query, [id, id]);

    return response; // Retorna el resultado de la ejecución
  } catch (error) {
    throw error; // Lanza el error para que puedas manejarlo donde llames la función
  }
};
const getReservaAll = async () => {
  try {
    const query = `select 
s.id_servicio,
s.created_at,
s.is_credito,
so.id_solicitud,
so.confirmation_code,
so.hotel,
so.check_in,
so.check_out,
so.room,
so.total,
so.id_usuario_generador,
b.id_booking, 
h.codigo_reservacion_hotel, 
p.id_pago, 
p.pendiente_por_cobrar,
p.monto_a_credito,
fp.id_factura,
vw.primer_nombre,
vw.apellido_paterno
from solicitudes as so
LEFT JOIN servicios as s ON so.id_servicio = s.id_servicio
LEFT JOIN bookings as b ON so.id_solicitud = b.id_solicitud
LEFT JOIN hospedajes as h ON b.id_booking = h.id_booking
LEFT JOIN pagos as p ON so.id_servicio = p.id_servicio
LEFT JOIN facturas_pagos as fp ON p.id_pago = fp.id_pago
LEFT JOIN viajeros_con_empresas_con_agentes as vw ON vw.id_agente = so.id_viajero
WHERE b.id_booking IS NOT NULL
GROUP BY so.id_solicitud
ORDER BY s.created_at DESC;`;

    // Ejecutar el procedimiento almacenado
    const response = await executeQuery(query);

    return response; // Retorna el resultado de la ejecución
  } catch (error) {
    throw error; // Lanza el error para que puedas manejarlo donde llames la función
  }
};

module.exports = {
  insertarReserva,
  getReserva,
  getReservaById,
  createReservaFromOperaciones,
  getReservaAll,
};
