const express = require('express');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = 3000;

const urlDatabase = new Map();

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const domainPrefixes = {
    'youtube.com': 'yt',
    'www.youtube.com': 'yt',
    'youtu.be': 'yt',
    'github.com': 'gh',
    'stackoverflow.com': 'so',
    'twitter.com': 'tw',
    'x.com': 'x',
    'instagram.com': 'ig',
    'www.instagram.com': 'ig',
    'facebook.com': 'fb',
    'www.facebook.com': 'fb',
    'linkedin.com': 'li',
    'www.linkedin.com': 'li',
    'reddit.com': 'rd',
    'www.reddit.com': 'rd',
    'medium.com': 'md',
    'dev.to': 'dev',
    'amazon.com': 'amz',
    'www.amazon.com': 'amz',
    'amazon.com.tr': 'amztr',
    'www.amazon.com.tr': 'amztr',
    'wikipedia.org': 'wiki',
    'en.wikipedia.org': 'wiki',
    'tr.wikipedia.org': 'wiki',
    'google.com': 'g',
    'www.google.com': 'g',
    'drive.google.com': 'gdrive',
    'docs.google.com': 'gdocs',
    'netflix.com': 'nf',
    'www.netflix.com': 'nf',
    'spotify.com': 'sp',
    'open.spotify.com': 'sp',
    'twitch.tv': 'ttv',
    'www.twitch.tv': 'ttv',
    'discord.com': 'dc',
    'discord.gg': 'dc',
    'tiktok.com': 'tt',
    'www.tiktok.com': 'tt',
    'pinterest.com': 'pin',
    'www.pinterest.com': 'pin',
    'sahibinden.com': 'shbndn',
    'www.sahibinden.com': 'shbndn',
    'hepsiburada.com': 'hpsbrd',
    'www.hepsiburada.com': 'hpsbrd',
    'trendyol.com': 'trndyl',
    'www.trendyol.com': 'trndyl',
    'n11.com': 'n11',
    'www.n11.com': 'n11',
    'gittigidiyor.com': 'gg',
    'www.gittigidiyor.com': 'gg',
    'ciceksepeti.com': 'cckspt',
    'www.ciceksepeti.com': 'cckspt',
    'yemeksepeti.com': 'ymkspt',
    'www.yemeksepeti.com': 'ymkspt',
    'getir.com': 'gtr',
    'www.getir.com': 'gtr',
    'migros.com.tr': 'mgrs',
    'www.migros.com.tr': 'mgrs',
    'a101.com.tr': 'a101',
    'www.a101.com.tr': 'a101',
    'bim.com.tr': 'bim',
    'www.bim.com.tr': 'bim',
    'sok.com.tr': 'sok',
    'www.sok.com.tr': 'sok',
    'turkcell.com.tr': 'trkcel',
    'www.turkcell.com.tr': 'trkcel',
    'vodafone.com.tr': 'vdfn',
    'www.vodafone.com.tr': 'vdfn',
    'turktelekom.com.tr': 'ttlkm',
    'www.turktelekom.com.tr': 'ttlkm',
    'enuygun.com': 'nygun',
    'www.enuygun.com': 'nygun',
    'obilet.com': 'oblt',
    'www.obilet.com': 'oblt',
    'thy.com': 'thy',
    'www.thy.com': 'thy',
    'pegasus.com.tr': 'pgs',
    'www.pegasus.com.tr': 'pgs',
    'eksi.sözlük.com': 'eksi',
    'eksisozluk.com': 'eksi',
    'www.eksisozluk.com': 'eksi',
    'hurriyet.com.tr': 'hrryt',
    'www.hurriyet.com.tr': 'hrryt',
    'milliyet.com.tr': 'mllyt',
    'www.milliyet.com.tr': 'mllyt',
    'ntv.com.tr': 'ntv',
    'www.ntv.com.tr': 'ntv',
    'cnnturk.com': 'cnn',
    'www.cnnturk.com': 'cnn',
    'letgo.com': 'ltgo',
    'www.letgo.com': 'ltgo',
    'arabam.com': 'arbm',
    'www.arabam.com': 'arbm',
    'emlakjet.com': 'emlkjt',
    'www.emlakjet.com': 'emlkjt'
};

function removeVowels(str) {
    return str.replace(/[aeiouıöüAEIOUİÖÜ]/gi, '');
}

function getDomainPrefix(url) {
    try {
        const urlObj = new URL(url);
        const hostname = urlObj.hostname.toLowerCase();

        if (domainPrefixes[hostname]) {
            return domainPrefixes[hostname];
        }

        const withoutWww = hostname.replace(/^www\./, '');
        if (domainPrefixes[withoutWww]) {
            return domainPrefixes[withoutWww];
        }

        const domainParts = withoutWww.split('.');
        const mainDomain = domainParts[0];

        const abbreviated = removeVowels(mainDomain);
        if (abbreviated.length >= 3) {
            return abbreviated.substring(0, Math.min(6, abbreviated.length));
        }

        return mainDomain.substring(0, Math.min(4, mainDomain.length));
    } catch {
        return 'url';
    }
}

function generateShortCode(url) {
    const prefix = getDomainPrefix(url);
    const hash = crypto.createHash('md5').update(url + Date.now()).digest('hex').substring(0, 5);
    return `${prefix}-${hash}`;
}

app.post('/api/shorten', (req, res) => {
    const { url } = req.body;

    if (!url) {
        return res.status(400).json({ error: 'URL gerekli' });
    }

    try {
        new URL(url);
    } catch {
        return res.status(400).json({ error: 'Geçersiz URL formatı' });
    }

    const shortCode = generateShortCode(url);

    urlDatabase.set(shortCode, {
        originalUrl: url,
        createdAt: new Date().toISOString(),
        clicks: 0
    });

    const shortUrl = `http://localhost:${PORT}/${shortCode}`;

    res.json({
        success: true,
        shortCode,
        shortUrl,
        originalUrl: url
    });
});

app.get('/api/urls', (req, res) => {
    const urls = [];
    urlDatabase.forEach((value, key) => {
        urls.push({
            shortCode: key,
            ...value
        });
    });
    res.json(urls);
});

app.get('/:shortCode', (req, res) => {
    const { shortCode } = req.params;

    if (shortCode.includes('.')) {
        return res.status(404).send('Bulunamadı');
    }

    const urlData = urlDatabase.get(shortCode);

    if (!urlData) {
        return res.status(404).send(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>URL Bulunamadı</title>
                <style>
                    body {
                        font-family: 'Segoe UI', sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                        color: white;
                        text-align: center;
                    }
                    h1 { color: #ff6b7a; }
                    a { color: #00d9ff; }
                </style>
            </head>
            <body>
                <div>
                    <h1>404 - URL Bulunamadı</h1>
                    <p>Bu kısa URL geçersiz veya süresi dolmuş.</p>
                    <a href="/">Ana Sayfaya Dön</a>
                </div>
            </body>
            </html>
        `);
    }

    urlData.clicks++;

    res.redirect(urlData.originalUrl);
});

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║         🔗 URL Kısaltıcı Sunucusu          ║
╠════════════════════════════════════════════╣
║  Sunucu çalışıyor: http://localhost:${PORT}   ║
║  Durdurmak için: Ctrl + C                  ║
╚════════════════════════════════════════════╝
    `);
});
