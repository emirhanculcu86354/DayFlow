# Dayflow

Günlük planlayıcı: saat saat takvim, görevler, alışkanlıklar, notlar, odak zamanlayıcı ve AI planlayıcı. Tek sayfa, sunucu gerektirmez; Türkçe, İngilizce ve İspanyolca dillerini destekler.

## Dosyalar

| Dosya | Görevi |
|---|---|
| `index.html` | Uygulamanın tamamı (HTML + CSS + JS) |
| `manifest.webmanifest` | PWA tanımı (ana ekrana yükleme, kısayollar) |
| `sw.js` | Service worker (çevrimdışı çalışma, bildirimler) |
| `icons/` | PWA ve iOS ikonları |
| `privacy.html` | Gizlilik politikası + KVKK aydınlatma metni (TR/EN) |
| `terms.html` | Kullanım koşulları (TR/EN) |

## Yerelde çalıştırma

```bash
python -m http.server 5173
```

Ardından http://localhost:5173 adresini aç. (Service worker `file://` üzerinde çalışmaz; mutlaka bir sunucu üzerinden aç.)

## Yayınlama

Klasörü olduğu gibi herhangi bir statik barındırma servisine yükle: Netlify, Vercel, Cloudflare Pages, GitHub Pages. HTTPS zorunludur (PWA kurulumu ve bildirimler için gerekir).

## Satıştan önce yapılacaklar

1. **İletişim bilgileri:** `index.html` içindeki `BRAND` nesnesinde `supportEmail` ve `website` alanlarını güncelle.
2. **Yasal metinler:** `privacy.html` ve `terms.html` dosyalarındaki `[ŞİRKET / KİŞİ ADI]`, `[ADRES]` ve `destek@dayflow.app` alanlarını doldur. Metinleri yayınlamadan önce bir hukukçuya kontrol ettir.
3. **Alan adı:** Sitenin adresi belli olunca `og:image` için tam URL kullan (örn. `https://alanadin.com/dayflow-icon-1024.png`).
4. **Yeni sürüm yayınlarken:** `index.html` içindeki `APP.release` ve `sw.js` içindeki `VERSION` değerlerini birlikte artır. Kullanıcılara "Yeni sürüm hazır" bildirimi gider.

## Dayflow Pro (şu an demo)

`index.html` içindeki `PRO` nesnesi ayarları tutar. `demo: true` iken ödeme ekranı gerçek para çekmez ve kart bilgisi istemez. Ekran yalnızca bir demo lisans anahtarı üretir (`DF-XXXX-XXXX-XXXX`).

- **Ücretsiz:** takvim, görevler, notlar, hatırlatmalar, odak zamanlayıcı, en fazla 3 alışkanlık, 7 günlük istatistik, JSON yedek
- **Pro:** AI planlayıcı, sınırsız alışkanlık, 30 günlük istatistik, şablonlar, dosya ekleri, ICS/CSV dışa aktarma, özel kategoriler ve vurgu renkleri
- Lisans kullanıcı verisinden ayrı saklanır (`dayflow:license`); "Tüm verileri sil" ya da yedek geri yükleme lisansı etkilemez.
- Pro kapandığında hiçbir veri silinmez veya kilitlenmez; yalnızca yeni ekleme engellenir.

**Gerçek ödemeye geçiş:** sağlayıcıyı (örn. Lemon Squeezy) seç, `PRO.checkoutUrl` alanına ödeme bağlantısını yaz, `PRO.demo` değerini `false` yap ve `validKey` / `activateKey` fonksiyonlarını sağlayıcının lisans doğrulama API'sine bağla.

## Çalışma modları

- **Bağımsız web / PWA:** Veriler `localStorage` ve IndexedDB'de (dosya ekleri) tutulur. AI planlayıcı cihaz üzerindeki kural tabanlı motorla çalışır ("2 saat ders, 45 dk spor, 10:00-11:30 toplantı" gibi ifadeleri anlar).
- **Claude Artifact içinde:** Bulut senkronu, Claude ile AI planlama ve platformun dosya/indirme servisleri otomatik olarak devreye girer.
