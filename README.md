# 📚 Blog Dostupnaya Ipoteka

Многостраничный блог для dostupnayaipoteka.ru/blog с автоматизацией через GitHub Actions.

## 🎯 Структура

```
blog-dostupnaya-ipoteka/
├── .github/workflows/
│   └── build-blog.yml              # GitHub Action для генерации
├── src/
│   ├── templates/
│   │   └── index.html              # Главная страница
│   ├── css/
│   │   └── style.css               # Единый стиль
│   └── js/
│       └── build.js                # Генератор HTML страниц
├── articles/                       # JSON файлы статей
├── docs/                           # Собранный сайт (GitHub Pages)
└── package.json
```

## 📝 Как добавлять статьи

### 1. Создать JSON файл статьи

Сохрани файл в папку `articles/` с именем: `NN-название-статьи.json`

**Пример: `articles/01-kreditnaya-istoriya.json`**

```json
{
  "title": "Что банк скрывает: ошибки в кредитной истории есть у 70%",
  "hook": "Как найти и исправить ошибки в КИ за 5 дней",
  "category": "Кредитная история",
  "date": "2026-08-24",
  "content": "<p>Первый абзац...</p><h2>Подзаголовок</h2><p>Текст...</p>"
}
```

### 2. Git commit

```bash
git add articles/01-kreditnaya-istoriya.json
git commit -m "📝 Новая статья: Кредитная история"
git push
```

### 3. GitHub Action автоматически:
- Генерирует HTML страницы
- Обновляет главную
- Публикует на GitHub Pages

✅ Статья онлайн за 1-2 минуты!

---

## 🏗️ Как генерировать HTML

### Локально (для тестирования)

```bash
npm install
npm run build
```

Откроется `/docs/index.html` с полным блогом.

---

## 📋 Структура JSON статьи

```json
{
  "title": "Заголовок статьи (должен быть привлекающим)",
  "hook": "Вирусный хук 1-2 строки - почему читать",
  "category": "Кредитная история | Одобрение и отказы | Новостройка | Рефинансирование | Программы ипотеки | Страхование",
  "date": "2026-08-24",
  "content": "<p>Основной HTML текст статьи...</p>"
}
```

### Категории (выбери одну)

- 📋 **Кредитная история**
- ✅ **Одобрение и отказы**
- 🏠 **Новостройка**
- 💰 **Рефинансирование**
- 👨‍👩‍👧 **Программы ипотеки**
- 🛡️ **Страхование**

---

## 🎨 HTML теги в content

Используй стандартный HTML:

```html
<p>Абзац текста</p>
<h2>Большой подзаголовок</h2>
<h3>Маленький подзаголовок</h3>
<ul>
  <li>Пункт списка</li>
</ul>
<ol>
  <li>Нумерованный пункт</li>
</ol>
<strong>Жирный текст</strong>
<em>Курсив</em>
```

---

## 🚀 GitHub Pages настройка

### 1. Включи GitHub Pages

1. Открой репозиторий на GitHub
2. **Settings** → **Pages**
3. **Source:** выбери `main` branch
4. **Folder:** `/docs`
5. Нажми **Save**

### 2. Пользовательский домен

1. В **Settings → Pages** введи: `dostupnayaipoteka.ru/blog`
2. В DNS настройках добавь CNAME или A record (если нужно)

**Для подпапки `/blog`:**
- Добавь в `_config.yml` (если нужно): `baseurl: "/blog"`

---

## 📊 Автоматизация: GitHub Action

**.github/workflows/build-blog.yml** автоматически:

1. Слушает push в `articles/latest.txt`
2. Читает путь к новой статье
3. Генерирует HTML
4. Коммитит в `main`
5. GitHub Pages публикует

**Не нужно ничего делать вручную!** ✨

---

## 🔍 SEO

Автоматически генерируется:

- ✅ **sitemap.xml** — для поисковиков
- ✅ **robots.txt** — для индексации
- ✅ **Meta теги** — для каждой страницы (title, description, keywords)
- ✅ **Структурированные URL** — `/blog/01-kreditnaya-istoriya.html`

---

## 📞 Контакты (встроены в каждую статью)

```
👉 Telegram: https://t.me/MolokovaBot
👉 Max: https://max.ru/id263101640599_3_bot
📧 Email: nev.fk@bk.ru
```

Если контакты изменятся → обнови в `src/templates/index.html` и `src/js/build.js`

---

## 🎯 Рабочий процесс

```
1. Облачная рутина генерирует статью (09:00, 11:00 MSK)
   ↓
2. Сохраняет в GitHub → articles/latest.txt
   ↓
3. GitHub Action считывает файл
   ↓
4. Генерирует JSON статью → articles/01-...json
   ↓
5. Build script создаёт HTML страницы
   ↓
6. Публикует на dostupnayaipoteka.ru/blog
```

**Время:** ~2 минуты от создания до публикации ⚡

---

## 🆘 Проблемы

### Статьи не появляются

1. Проверь, что JSON файл в папке `articles/`
2. Запусти локально: `npm run build`
3. Посмотри GitHub Actions логи (Actions tab)

### Стили не применяются

1. Проверь, что CSS скопировался в `/docs/css/`
2. Очисти кэш браузера (Ctrl+Shift+Delete)

### GitHub Pages не обновляется

1. Проверь **Settings → Pages** → Source = `/docs`
2. Дождись публикации (статус должен быть "deployed")

---

## 📌 Будущие планы

- [ ] Полная автоматизация через Zapier
- [ ] Социальные сети интеграция
- [ ] Поиск на сайте
- [ ] Система комментариев
- [ ] Analytics интеграция

---

**Готово к публикации!** 🚀
