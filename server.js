'use strict';

const path = require('path');
const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const { rateLimit } = require('express-rate-limit');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProd = process.env.NODE_ENV === 'production';
const PUBLIC_DIR = path.join(__dirname, 'public');

app.disable('x-powered-by');

if (process.env.TRUST_PROXY) {
  app.set('trust proxy', Number(process.env.TRUST_PROXY) || 1);
}

app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        fontSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: isProd ? [] : null,
      },
    },
    hsts: isProd ? { maxAge: 31536000, includeSubDomains: true } : false,
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  })
);

app.use((req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), payment=(), usb=()'
  );
  next();
});

app.use((req, res, next) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.setHeader('Allow', 'GET, HEAD');
    return res.status(405).type('text').send('Method Not Allowed');
  }
  if (req.url.length > 2048) {
    return res.status(414).type('text').send('URI Too Long');
  }
  next();
});

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    limit: 300,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: 'Слишком много запросов. Попробуй через минуту.',
  })
);

app.use(compression());

const TIPS = [
  'Используй const по умолчанию, а let — только если значение будет меняться.',
  'Сравнивай через ===, а не ==: так JS не будет тайком приводить типы.',
  'console.log() — лучший друг новичка. Не понимаешь, что в переменной? Выведи её.',
  'Называй переменные по смыслу: userAge понятнее, чем x.',
  'Одна функция — одна задача. Если в названии появляется «и», раздели её на две.',
  'Вставляешь текст от пользователя на страницу? Только textContent, не innerHTML.',
  'Ошибка в консоли — это подсказка, а не приговор. Читай её с первой строки.',
  'Массив из массива получай через map и filter — исходные данные останутся целыми.',
  'Любой fetch оборачивай в try...catch: сеть может подвести в любой момент.',
  'Не заучивай синтаксис — пиши код руками. Память пальцев работает лучше зубрёжки.',
];

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Слишком много запросов. Попробуй через минуту.' },
});

app.get('/api/tip', apiLimiter, (req, res) => {
  const id = Math.floor(Math.random() * TIPS.length);
  res.setHeader('Cache-Control', 'no-store');
  res.json({ id: id + 1, total: TIPS.length, text: TIPS[id] });
});

app.use('/api', (req, res) => {
  res.status(404).json({ error: 'Not found' });
});

app.use(
  express.static(PUBLIC_DIR, {
    dotfiles: 'ignore',
    extensions: ['html'],
    maxAge: isProd ? '1d' : 0,
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  })
);

app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, '404.html'));
});

app.use((err, req, res, next) => {
  const status = err.status >= 400 && err.status < 500 ? err.status : 500;
  if (status === 500) console.error(err);
  res.status(status).type('text').send(status === 500 ? 'Ошибка сервера' : 'Некорректный запрос');
});

const server = app.listen(PORT, () => {
  console.log(`let's JS запущен: http://localhost:${PORT}`);
});

server.requestTimeout = 30 * 1000;
server.headersTimeout = 15 * 1000;
server.keepAliveTimeout = 5 * 1000;

function shutdown() {
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 5000).unref();
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
