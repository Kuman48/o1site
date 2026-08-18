// Sadece YEREL calistirma icin (npm start). Vercel'de bu dosya kullanilmaz,
// onun yerine api/index.js devreye girer.
import app from './app.js';
import { config } from './config.js';

app.listen(config.port, () => {
  console.log(`[o1-analytics] http://localhost:${config.port} adresinde calisiyor (chain=${config.chain})`);
});
