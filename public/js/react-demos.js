'use strict';

const reactDemos = {
  hero(box) {
    const button = box.querySelector('.window__out button');
    let count = 0;
    button.addEventListener('click', () => {
      count = count + 1;
      button.textContent = `Нажато: ${count}`;
    });
  },

  card(box) {
    const input = box.querySelector('input');
    const hello = box.querySelector('[data-role="hello"]');
    const len = box.querySelector('[data-role="len"]');
    const render = () => {
      const name = input.value.trim();
      hello.textContent = `Привет, ${name}!`;
      len.textContent = `Букв в имени: ${name.length}`;
    };
    input.addEventListener('input', render);
    render();
  },

  button(box) {
    const label = box.querySelector('input');
    const variant = box.querySelector('select');
    const preview = box.querySelector('[data-role="preview"]');
    const code = box.querySelector('[data-role="code"]');
    const render = () => {
      preview.textContent = label.value || ' ';
      preview.className = `btn btn--${variant.value} btn--sm`;
      code.textContent = `<Button label="${label.value}" variant="${variant.value}" />`;
    };
    label.addEventListener('input', render);
    variant.addEventListener('change', render);
    render();
  },

  counter(box) {
    const plus = box.querySelector('[data-role="plus"]');
    const renders = box.querySelector('[data-role="renders"]');
    let count = 0;
    let renderCount = 1;
    const setCount = (next) => {
      if (next === count) return;
      count = next;
      renderCount = renderCount + 1;
      plus.textContent = `Нажато: ${count}`;
      renders.textContent = renderCount;
    };
    plus.addEventListener('click', () => setCount(count + 1));
    box.querySelector('[data-role="reset"]').addEventListener('click', () => setCount(0));
  },

  like(box) {
    const button = box.querySelector('button');
    const state = box.querySelector('[data-role="state"]');
    const likes = 128;
    let liked = false;
    button.addEventListener('click', () => {
      liked = !liked;
      button.textContent = `${liked ? '♥' : '♡'} ${likes + (liked ? 1 : 0)}`;
      button.classList.toggle('is-liked', liked);
      button.setAttribute('aria-pressed', String(liked));
      state.textContent = String(liked);
    });
  },

  chars(box) {
    const input = box.querySelector('input');
    const button = box.querySelector('button');
    const out = box.querySelector('.demo__out');
    input.addEventListener('input', () => {
      out.textContent = `Осталось символов: ${60 - input.value.length}`;
      button.disabled = input.value.trim() === '';
    });
    button.addEventListener('click', () => {
      input.value = '';
      button.disabled = true;
      out.textContent = 'Отзыв отправлен. Осталось символов: 60';
    });
  },

  toggle(box) {
    const button = box.querySelector('button');
    const panel = box.querySelector('.demo-box');
    const state = box.querySelector('[data-role="state"]');
    let isOpen = false;
    button.addEventListener('click', () => {
      isOpen = !isOpen;
      panel.hidden = !isOpen;
      button.textContent = isOpen ? 'Скрыть состав' : 'Показать состав';
      button.setAttribute('aria-expanded', String(isOpen));
      state.textContent = String(isOpen);
    });
  },

  todos(box) {
    const input = box.querySelector('input[type="text"]');
    const filter = box.querySelector('[data-role="filter"]');
    const list = box.querySelector('ul');
    const out = box.querySelector('.demo__out');
    let nextId = 3;
    let tasks = [
      { id: 1, text: 'Прочитать про key', done: true },
      { id: 2, text: 'Написать свой список', done: false },
    ];

    const render = () => {
      const visible = filter.checked ? tasks.filter((task) => !task.done) : tasks;
      list.textContent = '';
      visible.forEach((task) => {
        const item = document.createElement('li');
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'task' + (task.done ? ' is-done' : '');
        button.textContent = `${task.done ? '✓' : '○'} ${task.text}`;
        button.setAttribute('aria-pressed', String(task.done));
        button.addEventListener('click', () => {
          tasks = tasks.map((t) => (t.id === task.id ? { ...t, done: !t.done } : t));
          render();
        });
        item.appendChild(button);
        list.appendChild(item);
      });
      const left = tasks.filter((task) => !task.done).length;
      out.textContent = visible.length === 0 ? 'Всё сделано' : `Осталось задач: ${left} из ${tasks.length}`;
    };

    const add = () => {
      const text = input.value.trim();
      if (!text) return;
      tasks = [...tasks, { id: nextId, text, done: false }];
      nextId = nextId + 1;
      input.value = '';
      render();
    };

    box.querySelector('[data-role="add"]').addEventListener('click', add);
    input.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') add();
    });
    filter.addEventListener('change', render);
    render();
  },

  stopwatch(box) {
    const toggle = box.querySelector('[data-role="toggle"]');
    const value = box.querySelector('[data-role="value"]');
    const out = box.querySelector('.demo__out');
    let seconds = 0;
    let timerId = null;

    const stop = () => {
      clearInterval(timerId);
      timerId = null;
      toggle.textContent = 'Старт';
      out.textContent = 'Очистка сработала: интервал остановлен';
    };

    toggle.addEventListener('click', () => {
      if (timerId !== null) {
        stop();
        return;
      }
      timerId = setInterval(() => {
        seconds = seconds + 1;
        value.textContent = seconds;
      }, 1000);
      toggle.textContent = 'Пауза';
      out.textContent = 'Эффект запустил интервал';
    });

    box.querySelector('[data-role="reset"]').addEventListener('click', () => {
      seconds = 0;
      value.textContent = seconds;
    });
  },

  focus(box) {
    const input = box.querySelector('input');
    box.querySelector('button').addEventListener('click', () => input.focus());
  },

  tip(box) {
    const button = box.querySelector('button');
    const out = box.querySelector('.demo__out');
    const state = box.querySelector('[data-role="state"]');
    button.addEventListener('click', async () => {
      button.disabled = true;
      out.textContent = 'Загрузка…';
      state.textContent = 'tip = null, error = null';
      try {
        const response = await fetch('/api/tip');
        if (!response.ok) throw new Error(String(response.status));
        const tip = await response.json();
        out.textContent = tip.text;
        state.textContent = `tip = { id: ${tip.id}, text: '…' }, error = null`;
      } catch (error) {
        out.textContent = 'Не удалось загрузить совет. Запущен ли сервер? (npm start)';
        state.textContent = "tip = null, error = 'Не удалось загрузить совет'";
      } finally {
        button.disabled = false;
      }
    });
  },

  remember(box) {
    const input = box.querySelector('input');
    const out = box.querySelector('.demo__out');
    const KEY = 'react-demo-name';
    let saved = '';
    try {
      saved = localStorage.getItem(KEY) || '';
    } catch (e) {}
    input.value = saved;
    out.textContent = saved
      ? `С возвращением, ${saved}! Имя пришло из localStorage.`
      : 'Введи имя и обнови страницу: поле его вспомнит.';
    input.addEventListener('input', () => {
      try {
        localStorage.setItem(KEY, input.value);
      } catch (e) {}
      out.textContent = input.value
        ? `Сохранено: «${input.value}». Теперь обнови страницу.`
        : 'Введи имя и обнови страницу: поле его вспомнит.';
    });
  },
};

document.querySelectorAll('[data-demo]').forEach((box) => {
  const init = reactDemos[box.dataset.demo];
  if (init) init(box);
});
