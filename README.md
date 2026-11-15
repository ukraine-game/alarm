# Мапа тривог — симулятор

1. **Worker (щоб токен не був у репозиторії).** Cloudflare → Workers → Create → встав `worker.js`.
   Settings → Variables: секрети `UA_TOKEN` (твій токен Ukraine Alarm) і `ACCESS_CODE` (код для друзів),
   змінна `ALLOWED` = `https://ТВІЙНІК.github.io,http://localhost:8000`.
2. **config.js:** `API` = адреса Worker, `HOSTS`/`ORIGINAL` = твій GitHub Pages домен. Токен сюди НЕ вставляти.
3. **GitHub Pages:** завантаж папку в репозиторій → Settings → Pages. Друзям дай посилання й `ACCESS_CODE`.
4. Без Worker (`API:''`) кожен вводить власний токен у вікні входу — працює лише якщо API дозволяє CORS.
Токен із репозиторію / браузерного коду читається будь-ким — тому лише Worker або ручне введення.
