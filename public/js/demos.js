'use strict';

const demos = {
  greet(box) {
    const input = box.querySelector('input');
    const out = box.querySelector('.demo__out');
    const render = () => {
      const name = input.value.trim();
      out.textContent = name
        ? `Привет, ${name}! В твоём имени ${name.length} букв.`
        : 'Введи имя, и строка соберётся сама.';
    };
    input.addEventListener('input', render);
    render();
  },

  password(box) {
    const input = box.querySelector('input');
    const out = box.querySelector('.demo__out');
    input.addEventListener('input', () => {
      const value = input.value;
      let message;
      let state;
      if (value.length === 0) {
        message = 'Начни вводить пароль';
        state = '';
      } else if (value.length < 8) {
        message = `Слишком короткий: ещё ${8 - value.length} симв.`;
        state = 'bad';
      } else if (!/\d/.test(value)) {
        message = 'Добавь хотя бы одну цифру';
        state = 'warn';
      } else {
        message = 'Отличный пароль!';
        state = 'good';
      }
      out.textContent = message;
      out.dataset.state = state;
    });
  },

  stars(box) {
    const range = box.querySelector('input');
    const out = box.querySelector('.demo__out');
    const render = () => {
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        stars += i <= Number(range.value) ? '★' : '☆';
      }
      out.textContent = `${stars}  (${range.value} из 5)`;
    };
    range.addEventListener('input', render);
    render();
  },

  price(box) {
    const priceInput = box.querySelector('[data-role="price"]');
    const discountSelect = box.querySelector('[data-role="discount"]');
    const out = box.querySelector('.demo__out');

    function getFinalPrice(price, discount = 0) {
      return Math.round(price - (price * discount) / 100);
    }

    const render = () => {
      const price = Number(priceInput.value) || 0;
      const discount = Number(discountSelect.value);
      const final = getFinalPrice(price, discount);
      out.textContent = `К оплате: ${final.toLocaleString('ru-RU')} ₽ (экономия ${(price - final).toLocaleString('ru-RU')} ₽)`;
    };
    priceInput.addEventListener('input', render);
    discountSelect.addEventListener('change', render);
    render();
  },

  filter(box) {
    const products = [
      { title: 'Чехол для телефона', price: 890 },
      { title: 'Беспроводная мышь', price: 1990 },
      { title: 'Клавиатура', price: 4500 },
      { title: 'Наушники', price: 7900 },
      { title: 'Монитор 24"', price: 15900 },
    ];
    const range = box.querySelector('input');
    const label = box.querySelector('[data-role="max"]');
    const list = box.querySelector('ul');
    const out = box.querySelector('.demo__out');

    const render = () => {
      const max = Number(range.value);
      const affordable = products.filter((product) => product.price <= max);
      const total = affordable.reduce((sum, product) => sum + product.price, 0);

      label.textContent = max.toLocaleString('ru-RU') + ' ₽';
      list.textContent = '';
      affordable.forEach((product) => {
        const item = document.createElement('li');
        item.textContent = `${product.title}: ${product.price.toLocaleString('ru-RU')} ₽`;
        list.appendChild(item);
      });
      out.textContent = `Найдено: ${affordable.length}, на сумму ${total.toLocaleString('ru-RU')} ₽`;
    };
    range.addEventListener('input', render);
    render();
  },

  like(box) {
    const button = box.querySelector('button');
    const count = box.querySelector('[data-role="count"]');
    let likes = 0;
    button.addEventListener('click', () => {
      likes++;
      count.textContent = likes;
      button.classList.add('is-liked');
    });
  },

  todo(box) {
    const form = box.querySelector('form');
    const input = box.querySelector('input');
    const list = box.querySelector('ul');

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const text = input.value.trim();
      if (!text) return;

      const item = document.createElement('li');
      item.textContent = text;
      item.title = 'Нажми, чтобы удалить';
      list.appendChild(item);
      input.value = '';
      input.focus();
    });

    list.addEventListener('click', (event) => {
      if (event.target.tagName === 'LI') event.target.remove();
    });
  },

  toast(box) {
    const button = box.querySelector('button');
    const toast = box.querySelector('.toast');
    let timerId;
    button.addEventListener('click', () => {
      toast.classList.add('is-visible');
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        toast.classList.remove('is-visible');
      }, 3000);
    });
  },

  countdown(box) {
    const button = box.querySelector('button');
    const out = box.querySelector('.demo__out');
    let timerId = null;
    button.addEventListener('click', () => {
      if (timerId) return;
      let seconds = 10;
      out.textContent = `Код отправлен. Повторить можно через ${seconds} с`;
      button.disabled = true;
      timerId = setInterval(() => {
        seconds--;
        if (seconds > 0) {
          out.textContent = `Код отправлен. Повторить можно через ${seconds} с`;
        } else {
          clearInterval(timerId);
          timerId = null;
          button.disabled = false;
          out.textContent = 'Можно отправить код ещё раз';
        }
      }, 1000);
    });
  },

  debounce(box) {
    const cities = ['Москва', 'Минск', 'Мурманск', 'Казань', 'Калининград', 'Киев', 'Новосибирск', 'Нижний Новгород', 'Санкт-Петербург', 'Самара', 'Сочи', 'Алматы', 'Астана'];
    const input = box.querySelector('input');
    const out = box.querySelector('.demo__out');
    const counter = box.querySelector('[data-role="count"]');
    let timerId;
    let requests = 0;

    input.addEventListener('input', () => {
      out.textContent = 'Ждём, пока ты допечатаешь…';
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        requests++;
        counter.textContent = requests;
        const query = input.value.trim().toLowerCase();
        const found = query ? cities.filter((city) => city.toLowerCase().startsWith(query)) : [];
        out.textContent = !query ? 'Введи первые буквы города' : found.length ? found.join(', ') : 'Ничего не найдено';
      }, 500);
    });
  },

  fetch(box) {
    const button = box.querySelector('button');
    const out = box.querySelector('.demo__out');
    button.addEventListener('click', async () => {
      button.disabled = true;
      out.textContent = 'Загрузка…';
      try {
        const response = await fetch('/api/tip');
        if (!response.ok) throw new Error('Сервер ответил: ' + response.status);
        const tip = await response.json();
        out.textContent = `Совет №${tip.id}: ${tip.text}`;
      } catch (error) {
        out.textContent = 'Не удалось загрузить совет. Запущен ли сервер? (npm start)';
      } finally {
        button.disabled = false;
      }
    });
  },

  counter(box) {
    const value = box.querySelector('[data-role="value"]');
    let score = 0;
    box.querySelector('[data-role="plus"]').addEventListener('click', () => {
      score = score + 1;
      value.textContent = score;
    });
    box.querySelector('[data-role="reset"]').addEventListener('click', () => {
      score = 0;
      value.textContent = score;
    });
  },

  typecheck(box) {
    const input = box.querySelector('input');
    const out = box.querySelector('.demo__out');
    const render = () => {
      const raw = input.value.trim();
      if (!raw) {
        out.textContent = 'Поле пустое. Напиши что-нибудь.';
      } else if (raw === 'true' || raw === 'false') {
        out.textContent = `typeof ${raw} вернёт 'boolean'. Это ответ «да» или «нет».`;
      } else if (!Number.isNaN(Number(raw))) {
        out.textContent = `typeof ${raw} вернёт 'number'. Это число, с ним можно считать.`;
      } else {
        out.textContent = `typeof '${raw}' вернёт 'string'. Это строка, то есть текст.`;
      }
    };
    input.addEventListener('input', render);
    render();
  },

  calc(box) {
    const a = box.querySelector('[data-role="a"]');
    const b = box.querySelector('[data-role="b"]');
    const op = box.querySelector('[data-role="op"]');
    const out = box.querySelector('.demo__out');
    const render = () => {
      const x = Number(a.value);
      const y = Number(b.value);
      let result;
      switch (op.value) {
        case '+': result = x + y; break;
        case '-': result = x - y; break;
        case '*': result = x * y; break;
        case '/': result = x / y; break;
        default: result = x % y;
      }
      out.textContent = `${x} ${op.value} ${y} = ${result}`;
    };
    [a, b, op].forEach((el) => el.addEventListener('input', render));
    render();
  },

  stock(box) {
    const input = box.querySelector('input');
    const out = box.querySelector('.demo__out');
    const render = () => {
      const count = Number(input.value);
      const label = count > 0 ? 'В наличии' : 'Нет в наличии';
      out.textContent = label;
      out.dataset.state = count > 0 ? 'good' : 'bad';
    };
    input.addEventListener('input', render);
    render();
  },

  order(box) {
    const select = box.querySelector('select');
    const out = box.querySelector('.demo__out');
    const render = () => {
      let text;
      switch (select.value) {
        case 'new':
          text = 'Заказ принят';
          break;
        case 'shipped':
          text = 'Заказ в пути';
          break;
        case 'done':
          text = 'Заказ доставлен';
          break;
        default:
          text = 'Статус неизвестен (сработал default)';
      }
      out.textContent = text;
    };
    select.addEventListener('change', render);
    render();
  },

  hello(box) {
    const out = box.querySelector('.demo__out');
    let calls = 0;
    box.querySelector('button').addEventListener('click', () => {
      calls++;
      out.textContent = `Привет! (функцию вызвали раз: ${calls})`;
    });
  },

  double(box) {
    const input = box.querySelector('input');
    const out = box.querySelector('.demo__out');
    const double = (n) => n * 2;
    const render = () => {
      const n = Number(input.value);
      out.textContent = `double(${n}) вернёт ${double(n)}`;
    };
    input.addEventListener('input', render);
    render();
  },

  array(box) {
    const pool = ['яблоко', 'банан', 'киви', 'манго', 'груша', 'слива'];
    const fruits = ['яблоко', 'банан'];
    const value = box.querySelector('[data-role="value"]');
    const length = box.querySelector('[data-role="length"]');
    const pushBtn = box.querySelector('[data-role="push"]');
    const popBtn = box.querySelector('[data-role="pop"]');
    const render = () => {
      value.textContent = `[${fruits.map((fruit) => `'${fruit}'`).join(', ')}]`;
      length.textContent = fruits.length;
      pushBtn.disabled = fruits.length >= pool.length;
      popBtn.disabled = fruits.length === 0;
    };
    pushBtn.addEventListener('click', () => {
      fruits.push(pool[fruits.length]);
      render();
    });
    popBtn.addEventListener('click', () => {
      fruits.pop();
      render();
    });
    render();
  },

  object(box) {
    const nameInput = box.querySelector('[data-role="name"]');
    const ageInput = box.querySelector('[data-role="age"]');
    const objectOut = box.querySelector('[data-role="object"]');
    const readOut = box.querySelector('[data-role="read"]');
    const render = () => {
      const user = { name: nameInput.value.trim(), age: Number(ageInput.value) };
      objectOut.textContent = `{ name: '${user.name}', age: ${user.age} }`;
      readOut.textContent = `'${user.name}'`;
    };
    nameInput.addEventListener('input', render);
    ageInput.addEventListener('input', render);
    render();
  },

  json(box) {
    const theme = box.querySelector('[data-role="theme"]');
    const size = box.querySelector('[data-role="size"]');
    const out = box.querySelector('[data-role="json"]');
    const render = () => {
      const settings = { theme: theme.value, fontSize: Number(size.value) };
      out.textContent = `'${JSON.stringify(settings)}'`;
    };
    theme.addEventListener('change', render);
    size.addEventListener('input', render);
    render();
  },

  classes(box) {
    const block = box.querySelector('.demo-box');
    let changed = false;
    box.querySelector('[data-role="text"]').addEventListener('click', () => {
      changed = !changed;
      block.textContent = changed ? 'Мой текст поменял JavaScript' : 'Я обычный блок';
    });
    box.querySelector('[data-role="toggle"]').addEventListener('click', () => {
      block.classList.toggle('is-active');
    });
  },

  wait(box) {
    const button = box.querySelector('button');
    const out = box.querySelector('.demo__out');
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    button.addEventListener('click', async () => {
      button.disabled = true;
      out.textContent = 'Загрузка… (функция стоит на await)';
      await wait(2000);
      out.textContent = 'Готово! Прошло 2 секунды, и страница всё это время работала.';
      button.disabled = false;
    });
  },
};

document.querySelectorAll('[data-demo]').forEach((box) => {
  const init = demos[box.dataset.demo];
  if (init) init(box);
});
