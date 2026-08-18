# Vercel'de yayınlama (bilgisayarsız, tamamen mobilden)

Node.js kurmana gerek yok — Vercel derlemeyi kendi sunucularında yapıyor. Tek gereken: kodun GitHub'da olması ve API key'in Vercel'e "Environment Variable" olarak girilmesi.

## 1) GitHub'a yükle

1. github.com'a gir, hesap yoksa ücretsiz aç.
2. Sağ üstten **"+" → "New repository"**. İsim ver (örn: `o1-analytics`), **Private** seç, "Create repository".
3. Repo sayfasında **"uploading an existing file"** linkine tıkla (ya da "Add file → Upload files").
4. Bu klasördeki **tüm dosya ve klasörleri** (`api/`, `src/`, `public/`, `package.json`, `vercel.json`, `.gitignore`, `README.md`) sürükle-bırak ile yükle.
   - **`.env` veya `.env.example` dosyasını YÜKLEME** — API key'i repoya koymayalım, birazdan Vercel'e ayrı gireceğiz.
5. Alt kısımda "Commit changes" ile onayla.

## 2) Vercel'e bağla

1. vercel.com'a gir, **"Continue with GitHub"** ile giriş yap (aynı hesabınla).
2. **"Add New..." → "Project"**.
3. Az önce yüklediğin `o1-analytics` reposunu seç → **"Import"**.
4. **"Environment Variables"** bölümüne şunları tek tek ekle (`.env.example` dosyasındaki değerlerle aynı):

   | Key | Value |
   |---|---|
   | `O1_API_KEY` | (senin API key'in) |
   | `O1_API_BASE_URL` | `https://api.o1.exchange` |
   | `O1_CHAIN` | `base` |
   | `REFRESH_INTERVAL_SECONDS` | `60` |

5. **"Deploy"** tuşuna bas. 30-60 saniye içinde bitiyor.
6. Vercel sana `https://o1-analytics-xxxx.vercel.app` gibi bir URL verecek — site orada canlı.

## Sonradan kod değiştirirsen

GitHub'daki dosyayı güncelleyip commit ettiğinde, Vercel otomatik olarak yeniden deploy eder — tekrar hiçbir şey yapmana gerek yok.

## Not

`PORT` değişkenini Vercel'e girme — Vercel serverless olduğu için kendi portlamasını kendisi yönetiyor, o değişken sadece yerel (`npm start`) çalıştırmada kullanılıyor.
