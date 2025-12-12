---
title: "Пишем свой Redux"
description: "разбираем магию стейт-менеджеров"
pubDate: "Dec 12 2025"
heroImage: "../../assets/post-1.jpeg"
---

Мы все привыкли использовать готовые инструменты: Redux Toolkit, Zustand, MobX. Мы пишем useStore, и магия происходит сама собой: данные обновляются, компоненты перерисовываются. Но что на самом деле происходит внутри этого «черного ящика»?

Многие разработчики боятся заглянуть под капот. Кажется, что там сложная математика и магия вуду. На самом деле, сердце любой такой библиотеки держится на трех простых концепциях: Замыкания, Паттерн Наблюдатель (Observer) и один специальный хук React.

Сегодня мы с нуля напишем свой стейт-менеджер. Мы начнем с "наивной" версии на чистом JS, набьем шишки на оптимизации рендеров и придем к тому же решению, которое используют создатели Redux и Zustand.

### Акт 1: Сердце на чистом JS

Прежде чем трогать React, давайте создадим само хранилище. По сути, нам нужно место, где лежат данные, и способ узнать, что они изменились.

Нам понадобятся три элемента:

- State (Состояние) — защищенная переменная с данными.
- Subscribers (Подписчики) — список функций, которые нужно вызвать, когда данные изменятся.
- Methods (Методы) — API для чтения, изменения и подписки.
- Вот как это выглядит на ванильном JavaScript:

```js
function createStore(initialState) {
  // 1. Скрытое состояние (благодаря замыканию оно недоступно снаружи напрямую)
  let state = initialState;

  // 2. Список слушателей. Используем Set, чтобы функции не дублировались
  const listeners = new Set();

  return {
    // Получить актуальные данные
    getState: () => state,

    // Обновить данные и оповестить всех подписчиков
    setState: (newState) => {
      state = { ...state, ...newState }; // Иммутабельное обновление
      listeners.forEach((listener) => listener(state)); // "Эй, данные изменились!"
    },

    // Подписаться на обновления
    subscribe: (listener) => {
      listeners.add(listener);
      // Возвращаем функцию отписки (cleanup)
      return () => listeners.delete(listener);
    },
  };
}
```

Всего 20 строк кода. Мы используем замыкание, чтобы спрятать state, и паттерн Observer для реактивности.

Давайте проверим:

```js
const store = createStore({ count: 0 });

store.subscribe((state) => console.log("New state:", state));

store.setState({ count: 1 });
// Консоль: New state: { count: 1 }
```

Работает! Но React об этом пока ничего не знает.

### Акт 2: Первая попытка «поженить» Store и React

Чтобы React перерисовал компонент, нужно изменить его внутреннее состояние. Самый простой способ — использовать useState.

Давайте напишем хук useStore, который подписывается на наш стор и синхронизирует его с локальным стейтом компонента.

```js
import { useState, useEffect } from "react";

function useStore(store) {
  const [state, setState] = useState(store.getState());

  useEffect(() => {
    // Подписываемся на стор
    const unsubscribe = store.subscribe((newState) => {
      // Когда стор обновился, обновляем стейт компонента -> вызывает ререндер
      setState(newState);
    });

    // Не забываем отписаться при размонтировании
    return () => unsubscribe();
  }, [store]);

  return state;
}
```

В чем проблема этого решения?
Представьте, что у нас в сторе много данных: { count: 0, user: 'Alex', theme: 'dark' }. А в компоненте мы используем только счетчик:

```js
const { count } = useStore(store);
```

Если где-то в другом месте изменится user, наш стор создаст новый объект состояния. Хук useStore увидит новый объект, вызовет setState, и наш компонент перерисуется, хотя count не изменился.

В больших приложениях это убийца производительности.

### Акт 3: Оптимизация и боль

Чтобы избежать лишних рендеров, нам нужны Селекторы — функции, которые выбирают только нужный кусочек данных.

Мы хотим писать так:

```js
const count = useStore((state) => state.count);
```

Если мы попробуем реализовать это вручную через useEffect, мы столкнемся с целым ворохом проблем:

Лишние рендеры: Нам нужно сравнивать предыдущий результат селектора с новым.

Протухшие замыкания (Stale Closures): Если селектор зависит от пропсов компонента, useEffect может запомнить старую версию функции.

Tearing (Разрывы): В новых версиях React (Concurrent Mode) состояние может измениться прямо во время рендера, и пользователь увидит несогласованный интерфейс.

Мы могли бы написать сложную логику с useRef для хранения текущего селектора и ручного сравнения данных, но... зачем?

### Акт 4: Рояль в кустах — useSyncExternalStore

Команда React знала об этих болях. В React 18 появился хук, созданный специально для таких библиотек, как наша — useSyncExternalStore.

Он делает всё: подписывается, проверяет изменения, избегает тиринга и лишних рендеров.

Вот как выглядит наш финальный, профессиональный хук:

```js
import { useSyncExternalStore, useCallback } from "react";

function useStore(selector) {
  return useSyncExternalStore(
    store.subscribe, // Функция подписки
    // Функция получения снимка данных.
    // Оборачиваем в useCallback, чтобы создавать селектор только при необходимости
    useCallback(() => selector(store.getState()), [selector])
  );
}
```

Важный нюанс: Стабильность селекторов
Здесь есть подводный камень. Если вы используете селектор так:

```js
// ❌ Плохо
const count = useStore((state) => state.count);
```

...то при каждом рендере создается новая функция. useSyncExternalStore видит новую функцию getSnapshot и переподписывается заново. Это очень дорого.

Как правильно? Выносите селекторы за пределы компонента!

```js
// ✅ Хорошо
const selectCount = (state) => state.count;

const Counter = () => {
  const count = useStore(selectCount); // Ссылка стабильна
  return <div>{count}</div>;
};
```

### Финальный результат

Мы написали свой мини-Redux всего за пару минут. Вот полный код, готовый к использованию:

```js
import React, { useSyncExternalStore, useCallback } from "react";

// 1. Создаем стор (Vanilla JS)
export function createStore(initialState) {
  let state = initialState;
  const listeners = new Set();

  return {
    getState: () => state,
    setState: (newState) => {
      state = { ...state, ...newState };
      listeners.forEach((l) => l(state));
    },
    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}

// 2. Создаем React-хук
export function useStore(store, selector) {
  return useSyncExternalStore(
    store.subscribe,
    useCallback(() => selector(store.getState()), [store, selector])
  );
}
```

**Использование:**

```js
const myStore = createStore({ count: 0, user: "Vertex" });
const selectCount = (state) => state.count;

function App() {
  const count = useStore(myStore, selectCount);

  return (
    <button onClick={() => myStore.setState({ count: count + 1 })}>
      Count: {count}
    </button>
  );
}
```

Поздравляю! Теперь вы не просто пользователь библиотек, вы понимаете их архитектуру. В следующий раз, когда будете дебажить Zustand или Redux, вы будете точно знать, куда смотреть.
