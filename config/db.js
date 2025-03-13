const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'juanin+3',
  database: 'mia',
  waitForConnections: true,
  connectionLimit: 15,
});

async function executeQuery(query, params) {
  try {
    const [results] = await pool.execute(query, params);
    return results;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function executeTransaction(query, params, callback) {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [results] = await connection.execute(query, params);
    const resultsCallback = await callback(results, connection);
    await connection.commit();
    return { results, resultsCallback };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
}

module.exports = { pool, executeQuery, executeTransaction };