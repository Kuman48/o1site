import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from './config.js';
import {
  listNewTokens,
  listTrendingTokens,
  searchTokens,
  getTokenDetails,
  listTokenTrades,
  listTokenHolders,
  getWalletOverview,
  listWalletActivity,
} from './o1Client.js';
import { topTradersByPnL } from './pnlCalculator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Yerelde calisirken statik dosyalari da bu app sunsun (Vercel'de bunu
// Vercel'in kendi statik servisi yapiyor, orada bu satir zararsiz).
app.use(express.static(path.join(__dirname, '..', 'public')));

function handle(fn) {
  return async (req, res) => {
    try {
      res.json(await fn(req));
    } catch (e) {
      console.error(e.message);
      res.status(e.status || 500).json({ error: e.message });
    }
  };
}

app.get('/api/tokens/new', handle((req) => listNewTokens(Number(req.query.limit) || 30)));
app.get('/api/tokens/trending', handle((req) => listTrendingTokens(Number(req.query.limit) || 30)));
app.get('/api/tokens/search', handle((req) => searchTokens(req.query.q || '', Number(req.query.limit) || 20)));

app.get('/api/tokens/:address', handle((req) => getTokenDetails(req.params.address)));

app.get('/api/tokens/:address/holders', handle((req) =>
  listTokenHolders(req.params.address, Number(req.query.limit) || 50)
));

app.get('/api/tokens/:address/trades', handle((req) =>
  listTokenTrades(req.params.address, Number(req.query.limit) || 200)
));

app.get('/api/tokens/:address/top-traders', handle(async (req) => {
  const trades = await listTokenTrades(req.params.address, Number(req.query.limit) || 500);
  return {
    tokenAddress: req.params.address,
    tradeCount: trades.length,
    topTraders: topTradersByPnL(trades, Number(req.query.top) || 10),
    note: 'Sadece bu token icin o1 Launchpad uzerindeki islemlerden hesaplandi (average-cost yontemi).',
  };
}));

app.get('/api/wallets/:address', handle((req) => getWalletOverview(req.params.address)));
app.get('/api/wallets/:address/activity', handle((req) =>
  listWalletActivity(req.params.address, Number(req.query.limit) || 50)
));

export default app;
