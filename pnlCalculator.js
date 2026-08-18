/**
 * Bir token'in trade listesinden cuzdan bazli basit ortalama-maliyet (average cost)
 * kar/zarar hesaplar. Sadece bu token'in o1 Launchpad uzerindeki islemlerini kapsar;
 * cuzdanin baska yerdeki (CEX, farkli DEX) islemlerini goremeyiz.
 *
 * Beklenen trade alanlari (API'nin gercek alan adlarina gore normalize edilir):
 *  - wallet / trader / maker
 *  - side / type ('buy' | 'sell')
 *  - amountToken / tokenAmount
 *  - amountQuote / quoteAmount
 *  - price
 *  - timestamp / createdAt
 */
export function computeWalletPnL(trades) {
  const byWallet = new Map();

  const sorted = [...trades].sort((a, b) => tsOf(a) - tsOf(b));

  for (const t of sorted) {
    const wallet = t.wallet || t.trader || t.maker || t.address;
    if (!wallet) continue;

    const side = normalizeSide(t.side ?? t.type);
    const amountToken = parseFloat(t.amountToken ?? t.tokenAmount ?? 0);
    const amountQuote = parseFloat(t.amountQuote ?? t.quoteAmount ?? 0);
    if (!amountToken || !amountQuote) continue;

    const price = amountQuote / amountToken;

    let pos = byWallet.get(wallet);
    if (!pos) {
      pos = { wallet, tokenBalance: 0, avgCost: 0, realizedPnL: 0, quoteSpent: 0, quoteReceived: 0, trades: 0 };
      byWallet.set(wallet, pos);
    }
    pos.trades += 1;

    if (side === 'buy') {
      const newTotalCost = pos.avgCost * pos.tokenBalance + amountQuote;
      pos.tokenBalance += amountToken;
      pos.avgCost = pos.tokenBalance > 0 ? newTotalCost / pos.tokenBalance : 0;
      pos.quoteSpent += amountQuote;
    } else if (side === 'sell') {
      const sellAmount = Math.min(amountToken, pos.tokenBalance);
      pos.realizedPnL += (price - pos.avgCost) * sellAmount;
      pos.tokenBalance -= sellAmount;
      pos.quoteReceived += amountQuote;
    }
  }

  return [...byWallet.values()].map((p) => ({
    wallet: p.wallet,
    trades: p.trades,
    realizedPnL: round(p.realizedPnL),
    quoteSpent: round(p.quoteSpent),
    quoteReceived: round(p.quoteReceived),
    remainingTokenBalance: round(p.tokenBalance),
    avgCost: round(p.avgCost),
  }));
}

export function topTradersByPnL(trades, limit = 10) {
  return computeWalletPnL(trades)
    .sort((a, b) => b.realizedPnL - a.realizedPnL)
    .slice(0, limit);
}

function normalizeSide(s) {
  const v = String(s || '').toLowerCase();
  if (v.includes('buy') || v.includes('long') || v === '0') return 'buy';
  if (v.includes('sell') || v.includes('short') || v === '1') return 'sell';
  return v;
}

function tsOf(t) {
  return new Date(t.timestamp || t.createdAt || 0).getTime();
}

function round(n) {
  return Math.round(n * 1e6) / 1e6;
}
