import fetch from 'node-fetch';
import { config } from './config.js';

/**
 * NOT: docs.o1.exchange/llms.txt uzerindeki sayfa basliklarindan cikarilan
 * "en olasi" path'ler. Prod'a almadan once OpenAPI spesifikasyonuyla
 * (docs.o1.exchange/launchpad-api-openapi.yaml) dogrulayin. Yanit sekli
 * API'den donen gercek alan adlarina gore normalize edilecek sekilde
 * esnek yazildi (bkz. asagidaki pick* yardimcilari).
 */

const BASE = config.baseUrl;

async function request(path, params = {}) {
  const url = new URL(BASE + path);
  url.searchParams.set('chain', config.chain);
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) url.searchParams.set(k, v);
  }

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${config.apiKey}` },
  });

  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }

  if (!res.ok) {
    throw Object.assign(new Error(`o1 API ${res.status} @ ${path}: ${text.slice(0, 300)}`), { status: res.status });
  }
  return data;
}

function pickList(resp) {
  if (Array.isArray(resp)) return resp;
  return resp?.data ?? resp?.items ?? resp?.tokens ?? resp?.results ?? [];
}

export async function listNewTokens(limit = 30) {
  const resp = await request('/v1/tokens', { sort: 'newest', limit });
  return pickList(resp);
}

export async function listTrendingTokens(limit = 30) {
  const resp = await request('/v1/tokens', { sort: 'volume_desc', limit });
  return pickList(resp);
}

export async function searchTokens(q, limit = 20) {
  const resp = await request('/v1/tokens/search', { q, limit });
  return pickList(resp);
}

export async function getTokenDetails(address) {
  return request(`/v1/tokens/${address}`, { include: 'pool,market' });
}

export async function listTokenTrades(address, limit = 200) {
  const resp = await request(`/v1/tokens/${address}/trades`, { limit });
  return pickList(resp);
}

export async function listTokenHolders(address, limit = 50) {
  const resp = await request(`/v1/tokens/${address}/holders`, { limit });
  return pickList(resp);
}

export async function getWalletOverview(address) {
  return request(`/v1/wallets/${address}`);
}

export async function listWalletActivity(address, limit = 50) {
  const resp = await request(`/v1/wallets/${address}/activity`, { limit });
  return pickList(resp);
}
