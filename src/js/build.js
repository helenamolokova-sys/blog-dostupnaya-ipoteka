const fs = require('fs');
const path = require('path');

// Загружаем фото Елены
let ELENA_PHOTO_BASE64 = '';
try {
    ELENA_PHOTO_BASE64 = fs.readFileSync(path.join(__dirname, '../config.txt'), 'utf8').trim();
} catch (e) {
    console.warn('⚠️  Photo config not found, hero will show gradient placeholder');
}

// Параметры Яндекс Метрики
const YANDEX_METRIKA_ID = '00000000'; // TODO: обновить на реальный ID

// Категории (БЕЗ эмодзи — только названия)
const CATEGORIES = {
    'Кредитная история': '',
    'Одобрение и отказы': '',
    'Новостройка': '',
    'Рефинансирование': '',
    'Программы ипотеки': '',
    'Страхование': '',
    'Заёмщики': '',
    'Математика': ''
};

// Читаем все статьи
function getAllArticles() {
    const articlesDir = path.join(__dirname, '../../articles');
    const articles = [];

    if (!fs.existsSync(articlesDir)) {
        fs.mkdirSync(articlesDir, { recursive: true });
        return articles;
    }

    const files = fs.readdirSync(articlesDir).filter(f => f.endsWith('.json'));

    files.forEach(file => {
        try {
            const data = JSON.parse(fs.readFileSync(path.join(articlesDir, file), 'utf8'));
            articles.push({
                ...data,
                slug: file.replace('.json', '')
            });
        } catch (e) {
            console.error(`Error reading ${file}:`, e);
        }
    });

    return articles.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Генерируем главную страницу
function generateIndex(articles) {
    let articlesHtml = '';

    articles.forEach(article => {
        // Находим другие статьи в той же категории для внутренних ссылок
        const relatedArticles = articles
            .filter(a => a.category === article.category && a.slug !== article.slug)
            .slice(0, 2);

        let relatedLinks = '';
        relatedArticles.forEach(related => {
            relatedLinks += `<a href="/blog/${related.slug}.html" style="color: #D4A85C; font-weight: 600;">«${related.title}»</a><br>`;
        });

        articlesHtml += `
        <article class="article-card">
            <div class="article-thumb">
                <div style="width: 240px; height: 160px; background: linear-gradient(135deg, #E8D5B7 0%, #D9C5A0 100%); border-radius: 8px;"></div>
            </div>
            <div class="article-body">
                <div class="article-meta">${article.category}</div>
                <h3><a href="/blog/${article.slug}.html">${article.title}</a></h3>
                <div class="article-excerpt">
                    ${article.hook}
                    ${relatedLinks ? `<br><br><strong>Читайте также:</strong><br>${relatedLinks}` : ''}
                </div>
                <a href="/blog/${article.slug}.html" class="article-cta">Читать полную версию →</a>
            </div>
        </article>`;
    });

    // Генерируем категории (без эмодзи)
    let categoriesHtml = '';
    Object.entries(CATEGORIES).forEach(([cat]) => {
        const count = articles.filter(a => a.category === cat).length;
        if (count > 0) {
            categoriesHtml += `
            <div class="category-link">
                ${cat}
                <span class="category-badge">${count}</span>
            </div>`;
        }
    });

    const indexHtml = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Доступная Ипотека - Экспертные статьи о получении ипотеки</title>
    <meta name="description" content="Блог о получении ипотеки. Экспертные советы, анализ программ, помощь при проблемной кредитной истории.">
    <meta name="keywords" content="ипотека, получение ипотеки, кредитная история, банк, консультация">
    <meta property="og:title" content="Доступная Ипотека">
    <meta property="og:description" content="Экспертные статьи о получении ипотеки">
    <meta property="og:type" content="website">
    <meta property="og:url" content="https://dostupnayaipoteka.ru/blog/">
    <link rel="canonical" href="https://dostupnayaipoteka.ru/blog/">
    <link rel="stylesheet" href="/blog/css/style.css">
    <script async src="https://mc.yandex.ru/metrika/tag.js"></script>
    <script>
        window.yaCounter${YANDEX_METRIKA_ID} = new Ya.Metrica({id:${YANDEX_METRIKA_ID}, clickmap:true, trackLinks:true, accurateTrackBounce:true, webvisor:true});
    </script>
    <noscript><div><img src="https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}" style="position:absolute; left:-9999px;" alt="" /></div></noscript>
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="header-logo">
            <div class="logo-mark">D</div>
            Доступная Ипотека
        </div>
    </div>

    <!-- Hero -->
    <div style="display: grid; grid-template-columns: 1fr 1.2fr; gap: 0; align-items: stretch; background: white; min-height: 560px;">
        <div style="padding: 80px 60px; display: flex; flex-direction: column; justify-content: center; background: linear-gradient(135deg, #FAFAF8 0%, #F5F3F0 100%);">
            <div style="font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 2px; color: #D4A85C; margin-bottom: 12px;">Профессиональная консультация</div>
            <div style="font-family: 'Clash Display', sans-serif; font-size: 52px; font-weight: 700; line-height: 1.1; margin-bottom: 20px; color: #0F0F0F; letter-spacing: -1px;">Ипотека без стресса</div>
            <div style="font-size: 17px; line-height: 1.6; color: #555; margin-bottom: 40px; max-width: 520px;">20+ лет помощи в получении ипотеки. Анализируем вашу ситуацию. Находим оптимальный вариант. Помогаем даже при проблемной ситуации.</div>
            <a href="https://max.ru/id263101640599_3_bot" style="display: inline-flex; align-items: center; gap: 10px; padding: 16px 32px; background: #D4A85C; color: white; border-radius: 8px; font-size: 14px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; transition: all 0.3s cubic-bezier(0.23, 1, 0.320, 1); width: fit-content;">Запросить консультацию →</a>
        </div>
        <div style="background: ${ELENA_PHOTO_BASE64 ? `url(data:image/jpeg;base64,${ELENA_PHOTO_BASE64})` : 'linear-gradient(135deg, #E8D5B7 0%, #D9C5A0 100%)'} center/cover; overflow: hidden;"></div>
    </div>

    <!-- Main -->
    <div class="container">
        <!-- Статьи -->
        <div class="articles">
            <h2 class="articles-title">Статьи</h2>
            ${articlesHtml}
        </div>

        <!-- Sidebar -->
        <div class="sidebar">
            <div>
                <div class="sidebar-section-title">Рубрики</div>
                <div class="categories-list">
                    ${categoriesHtml}
                </div>
            </div>

            <div class="profile-card">
                <div class="profile-name">Елена Молокова</div>
                <div class="profile-title">Руководитель центра</div>
                <div class="profile-bio">Руководитель ипотечно-консультационного центра Доступная ипотека. 15+ лет в ипотечном рынке. Кандидат экономических наук. Инвестор с 2008 года. Помогла 3500+ клиентам получить одобрение и найти доходный вариант новостройки.</div>
                <div class="profile-contacts">
                    <a href="https://t.me/MolokovaBot" class="profile-contact">Telegram</a>
                    <a href="https://max.ru/id263101640599_3_bot" class="profile-contact">MAX</a>
                    <a href="https://wa.me/message/OAWRJBRP7ZA2M1" class="profile-contact">WhatsApp</a>
                    <a href="mailto:helena.molokova@gmail.com" class="profile-contact">Email</a>
                </div>
            </div>
        </div>
    </div>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-logo">Доступная Ипотека</div>
        <div class="footer-desc">Экспертная консультация в получении ипотеки. Персональный анализ. Реальная помощь для вашей ситуации.</div>
        <div class="footer-links">
            <a href="https://t.me/dostupnayaipoteka">Telegram</a>
            <a href="https://youtube.com/c/dostupnayaipoteka">YouTube</a>
            <a href="https://vk.com/dostupnayaipoteka">ВКонтакте</a>
            <a href="https://instagram.com/molokova_ipoteka">Instagram</a>
        </div>
    </footer>
</body>
</html>`;

    fs.writeFileSync(path.join(__dirname, '../../docs/index.html'), indexHtml);
    console.log('✅ Generated index.html');
}

// Генерируем страницы статей
function generateArticlePages(articles) {
    const articleTemplate = `<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{TITLE} - Доступная ипотека</title>
    <meta name="description" content="{HOOK}">
    <meta name="keywords" content="ипотека, {CATEGORY}">
    <meta property="og:title" content="{TITLE}">
    <meta property="og:description" content="{HOOK}">
    <meta property="og:type" content="article">
    <meta property="og:url" content="https://dostupnayaipoteka.ru/blog/{SLUG}.html">
    <link rel="canonical" href="https://dostupnayaipoteka.ru/blog/{SLUG}.html">
    <link rel="stylesheet" href="/blog/css/style.css">
</head>
<body>
    <!-- Header -->
    <div class="header">
        <div class="header-logo">
            <div class="logo-mark">D</div>
            Доступная Ипотека
        </div>
    </div>

    <!-- Article Container -->
    <div class="article-container">
        <main class="article-content">
            <article class="article-page">
                <div class="article-meta">{CATEGORY}</div>
                <h1>{TITLE}</h1>
                <div class="article-hook">{HOOK}</div>
                <div class="article-text">
                    {CONTENT}
                </div>

                <!-- Call to Action -->
                <div class="cta-block">
                    <h3>Нужна консультация по вашей ситуации?</h3>
                    <p>Расскажите о вашем случае, и я помогу найти оптимальный вариант ипотеки.</p>
                    <a href="https://max.ru/id263101640599_3_bot" class="cta-button">Написать в MAX →</a>
                </div>
            </article>
        </main>

        <!-- Sidebar -->
        <aside class="article-sidebar">
            <!-- Консультант -->
            <div class="profile-card">
                <div class="profile-name">Елена Молокова</div>
                <div class="profile-title">Руководитель центра</div>
                <div class="profile-bio">Руководитель ипотечно-консультационного центра Доступная ипотека. 15+ лет в ипотечном рынке. Кандидат экономических наук. Инвестор с 2008 года. Помогла 3500+ клиентам получить одобрение и найти доходный вариант новостройки.</div>
                <div class="profile-contacts">
                    <a href="https://t.me/MolokovaBot">Telegram</a>
                    <a href="https://max.ru/id263101640599_3_bot">MAX</a>
                    <a href="https://wa.me/message/OAWRJBRP7ZA2M1">WhatsApp</a>
                    <a href="mailto:helena.molokova@gmail.com">Email</a>
                </div>
            </div>

            <!-- Другие статьи по теме -->
            <div class="related-articles">
                <h3>Другие статьи по теме</h3>
                <div class="related-list">
                    {RELATED_ARTICLES}
                </div>
            </div>

            <!-- Соц сети -->
            <div class="social-block">
                <h3>Мои каналы</h3>
                <div class="social-links">
                    <a href="https://t.me/dostupnayaipoteka">Telegram канал</a>
                    <a href="https://youtube.com/c/dostupnayaipoteka">YouTube</a>
                    <a href="https://vk.com/dostupnayaipoteka">ВКонтакте</a>
                    <a href="https://instagram.com/molokova_ipoteka">Instagram</a>
                </div>
            </div>
        </aside>
    </div>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-logo">Доступная Ипотека</div>
        <div class="footer-desc">Экспертная консультация в получении ипотеки. Персональный анализ. Реальная помощь для вашей ситуации.</div>
        <div class="footer-links">
            <a href="https://t.me/dostupnayaipoteka">Telegram</a>
            <a href="https://youtube.com/c/dostupnayaipoteka">YouTube</a>
            <a href="https://vk.com/dostupnayaipoteka">ВКонтакте</a>
        </div>
    </footer>
</body>
</html>`;

    articles.forEach(article => {
        // Находим другие статьи в той же категории
        const relatedArticles = articles
            .filter(a => a.category === article.category && a.slug !== article.slug)
            .slice(0, 3);

        let relatedHtml = '';
        relatedArticles.forEach(related => {
            relatedHtml += `
            <div class="related-item">
                <a href="/blog/${related.slug}.html">${related.title}</a>
            </div>`;
        });

        let html = articleTemplate;
        // Используем функцию для замены всех вхождений, не только первого
        html = html.split('{TITLE}').join(article.title);
        html = html.split('{HOOK}').join(article.hook);
        html = html.split('{CATEGORY}').join(article.category);
        html = html.split('{DATE}').join(formatDate(article.date));
        html = html.split('{CONTENT}').join(article.content);
        html = html.split('{SLUG}').join(article.slug);
        html = html.split('{RELATED_ARTICLES}').join(relatedHtml);

        const outputPath = path.join(__dirname, `../../docs/${article.slug}.html`);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, html);
        console.log(`✅ Generated ${article.slug}.html`);
    });
}

// Генерируем sitemap.xml
function generateSitemap(articles) {
    let urls = `  <url>
    <loc>https://dostupnayaipoteka.ru/blog/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>`;

    articles.forEach(article => {
        urls += `
  <url>
    <loc>https://dostupnayaipoteka.ru/blog/${article.slug}.html</loc>
    <lastmod>${article.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
    });

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    fs.writeFileSync(path.join(__dirname, '../../docs/sitemap.xml'), sitemap);
    console.log('✅ Generated sitemap.xml');
}

// Генерируем robots.txt
function generateRobots() {
    const robots = `User-agent: *
Allow: /blog/
Disallow: /blog/admin/

Sitemap: https://dostupnayaipoteka.ru/blog/sitemap.xml`;

    fs.writeFileSync(path.join(__dirname, '../../docs/robots.txt'), robots);
    console.log('✅ Generated robots.txt');
}

// Копируем CSS
function copyCss() {
    const cssSource = path.join(__dirname, '../css/style.css');
    const cssDir = path.join(__dirname, '../../docs/css');
    const cssDest = path.join(cssDir, 'style.css');

    fs.mkdirSync(cssDir, { recursive: true });
    fs.copyFileSync(cssSource, cssDest);
    console.log('✅ Copied CSS');
}

// Форматируем дату
function formatDate(dateStr) {
    const date = new Date(dateStr);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('ru-RU', options);
}

// Main
console.log('🚀 Building blog...');
const articles = getAllArticles();
console.log(`Found ${articles.length} articles`);

copyCss();
generateIndex(articles);
generateArticlePages(articles);
generateSitemap(articles);
generateRobots();

console.log('✅ Blog built successfully!');
