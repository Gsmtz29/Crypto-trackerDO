const express = require('express');
const axios   = require('axios');
const pool    = require('../db/connection');
const logger  = require('../logger');

const router = express.Router();

// GET /api/crypto/:coin  — consulta precio y guarda en DB
router.get('/:coin', async (req, res) => {
  const coin = req.params.coin.toLowerCase().trim();
  try {
    logger.info(`Consulta de precio: ${coin}`);

    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price`,
      { params: { ids: coin, vs_currencies: 'usd,mxn' } }
    );

    if (!data[coin]) {
      logger.warn(`Símbolo no encontrado: ${coin}`);
      return res.status(404).json({ error: 'Criptomoneda no encontrada' });
    }

    const { usd, mxn } = data[coin];

    await pool.query(
      'INSERT INTO queries (symbol, price_usd, price_mxn) VALUES (?, ?, ?)',
      [coin, usd, mxn]
    );

    logger.info(`Guardado: ${coin} = $${usd} USD / $${mxn} MXN`);
    res.json({ symbol: coin, price_usd: usd, price_mxn: mxn });

  } catch (err) {
    logger.error(`Error consultando ${coin}: ${err.message}`);
    res.status(500).json({ error: 'Error al consultar precio' });
  }
});

// GET /api/crypto/history/all  — devuelve las últimas 50 consultas
router.get('/history/all', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM queries ORDER BY queried_at DESC LIMIT 50'
    );
    logger.info(`Historial solicitado: ${rows.length} registros`);
    res.json(rows);
  } catch (err) {
    logger.error(`Error obteniendo historial: ${err.message}`);
    res.status(500).json({ error: 'Error al obtener historial' });
  }
});

module.exports = router;
