# o1 Launchpad Analiz Sitesi

Yeni çıkan / hacim giren coinleri listeler; bir tokene tıklayınca top holder'ları ve **o token üzerinde o1 Launchpad'de en çok kazanan cüzdanları** (trade geçmişinden hesaplanmış K/Z) gösterir.

## ⚠️ Güvenlik notu

- `.env` içine API key'iniz zaten yazıldı. Bu dosya **asla** public bir repoya/paylaşıma gitmemeli.
- API key sadece `src/o1Client.js` üzerinden, sunucu tarafında kullanılıyor — tarayıcıya hiç gitmiyor.
- Bu key'i daha önce bu sohbette açık yazdınız; sohbeti başkasıyla paylaştıysanız o1.exchange panelinden **rotate edin**.

## Kurulum

```bash
cd o1-analytics
npm install
npm start
```

Site: `http://localhost:4100`

## Neler var

- **Yeni Coinler** sekmesi → `/v1/tokens?sort=newest`
- **Hacim Girenler** sekmesi → `/v1/tokens?sort=volume_desc`
- **Arama** → `/v1/tokens/search`
- Bir tokene tıklayınca:
  - **Top Holder'lar** → `/v1/tokens/:address/holders`
  - **En çok kazanan cüzdanlar** → tokenin trade geçmişi (`/v1/tokens/:address/trades`) çekilip `pnlCalculator.js` ile ortalama-maliyet yöntemiyle her cüzdanın gerçekleşen K/Z'si hesaplanıyor.

## Önemli sınırlamalar

1. **"En çok kazanan" sadece bu token + sadece o1 Launchpad'deki işlemleri kapsar.** Cüzdanın başka bir DEX/CEX'teki alım-satımını göremeyiz; gerçek toplam K/Z farklı olabilir.
2. **Endpoint yolları doğrulanmalı.** `src/o1Client.js` içindeki path'ler dokümantasyon sayfa başlıklarından türetildi. Sunucuyu ilk çalıştırdığınızda terminal loglarını izleyin — 404/şema hatası olursa şu kaynaklardan path/alan adlarını düzeltin:
   - https://docs.o1.exchange/launchpad-api-openapi.yaml
   - https://docs.o1.exchange/launchpad/api/read-endpoints
   - https://github.com/CohumanSpace/o1-api
3. API'nin gerçek trade/holder alan adları (`wallet`, `side`, `amountToken` vb.) farklıysa `pnlCalculator.js` ve `o1Client.js`'deki `pick*`/alan eşleme kısımlarını güncelleyin — kod bunu tek yerden yapacak şekilde yazıldı.

## Sonraki adımlar

- "En çok kazanan" hesaplamasını tüm tokenler genelinde birleştirip gerçek bir **genel leaderboard** haline getirebiliriz (çok sayıda token trade'ini toplu tarama gerektirir, rate limit'e dikkat).
- Fiyat grafiği (candlestick) eklenebilir.
- Sonuçları cache'leyip (Redis/SQLite) API çağrı sayısını azaltabiliriz.
