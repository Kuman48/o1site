import app from '../src/app.js';

// Vercel bu dosyayi /api/* altindaki her istek icin cagirir.
// Express app kendi ic routing'ini req.url'e gore yapiyor, bu yuzden
// istek burada oldugu gibi app'e devrediliyor.
export default function handler(req, res) {
  return app(req, res);
}
