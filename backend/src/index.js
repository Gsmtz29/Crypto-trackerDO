const express     = require('express');
const cors        = require('cors');
const pool        = require('./db/connection');
const logger      = require('./logger');
const cryptoRoutes = require('./routes/crypto');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api/crypto', cryptoRoutes);

app.get('/health', (_req, res) => {
  logger.info('Health check OK');
  res.json({ status: 'ok' });
});

async function initDB() {
  // Reintenta hasta que MySQL esté listo
  for (let i = 0; i < 10; i++) {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS queries (
          id          INT AUTO_INCREMENT PRIMARY KEY,
          symbol      VARCHAR(50)     NOT NULL,
          price_usd   DECIMAL(20, 8),
          price_mxn   DECIMAL(20, 4),
          queried_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);
      logger.info('Base de datos inicializada correctamente');
      return;
    } catch (err) {
      logger.warn(`Esperando DB... intento ${i + 1}/10`);
      await new Promise(r => setTimeout(r, 3000));
    }
  }
  logger.error('No se pudo conectar a la base de datos');
  process.exit(1);
}

initDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Servidor iniciado en puerto ${PORT}`);
  });
});
