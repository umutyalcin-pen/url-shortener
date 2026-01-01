# 🔗 URL Kısaltıcı

Basit, şık ve kullanımı kolay bir URL kısaltıcı uygulaması.

![Node.js](https://img.shields.io/badge/Node.js-18+-green)
![Express](https://img.shields.io/badge/Express-4.18-blue)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Özellikler

- 🎨 Modern ve şık arayüz (glassmorphism tasarım)
- 🔗 Site adına göre akıllı kısa kod üretimi
- 📊 Tıklama sayacı
- 📋 Tek tıkla kopyalama
- 📱 Mobil uyumlu tasarım

## 🚀 Kurulum

```bash
# Bağımlılıkları yükle
npm install

# Sunucuyu başlat
npm start
```

Tarayıcıda [http://localhost:3000](http://localhost:3000) adresini açın.

## 📝 Kullanım

1. URL giriş alanına kısaltmak istediğiniz URL'yi yapıştırın
2. "Kısalt" butonuna tıklayın
3. Oluşturulan kısa URL'yi kopyalayın ve paylaşın

## 🔤 Kısa Kod Örnekleri

| Orijinal Site | Kısa Kod Formatı |
|---------------|------------------|
| youtube.com   | `yt-xxxxx`       |
| github.com    | `gh-xxxxx`       |
| instagram.com | `ig-xxxxx`       |
| twitter.com   | `tw-xxxxx`       |
| reddit.com    | `rd-xxxxx`       |

## 📁 Proje Yapısı

```
url-shortener/
├── index.html      # Arayüz
├── server.js       # Express sunucusu
├── package.json    # Proje yapılandırması
├── .gitignore      # Git hariç tutma
└── README.md       # Bu dosya
```

## ⚠️ Notlar

- URL'ler bellekte tutulur, sunucu yeniden başlatıldığında silinir
- Sadece yerel kullanım içindir (localhost)

## 📄 Lisans

MIT License
