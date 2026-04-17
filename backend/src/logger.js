const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logFile = path.join(logDir, 'app.log');

function log(level, message) {
  const now = new Date();
  const ts = now.toISOString().replace('T', ' ').slice(0, 19);
  const line = `[${ts}] ${level}: ${message}\n`;
  fs.appendFileSync(logFile, line);
  process.stdout.write(line);
}

module.exports = {
  info:  (msg) => log('INFO',  msg),
  error: (msg) => log('ERROR', msg),
  warn:  (msg) => log('WARN',  msg),
};
