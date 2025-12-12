export type ProfileLink = {
  label: string;
  href: string;
};

export type Profile = {
  displayName: string;
  role: string;
  tagline: string;
  location?: string;
  focus: string[];
  stack: {
    core: string[];
    frontend: string[];
    backend: string[];
    quality: string[];
  };
  links: ProfileLink[];
};

export const PROFILE: Profile = {
  displayName: "Aleksei Lovchikov",
  role: "Full-stack разработчик",
  tagline:
    "Frontend-разработчик с 8-летним опытом. Создаю продуманные и быстрые интерфейсы на React и TypeScript, развиваюсь в бэкенде и геймдеве. Строю архитектуру, оптимизирую процессы и довожу продукты до результата.",
  location: "Cyprus",

  focus: [
    "Продуктовая разработка: от проработки требований до стабильных релизов",
    "Производительность и UX: быстрый рендер, предсказуемые состояния, ясные интерфейсы",
    "Инженерная дисциплина: типизация, тесты, код-ревью, документация",
    "Интеграции и автоматизация: API, пайплайны, CI/CD",
    "Архитектура фронтенда: дизайн-системы, FSD, SSR, оптимизация бандла",
    "Рост в бэкенде и системном дизайне: ответственность за фичу end-to-end",
    "Геймдев: практика на Unity (C#) и Rust/Bevy, работа с рендером и производительностью",
  ],

  stack: {
    core: ["TypeScript", "Node.js", "HTML", "CSS"],
    frontend: [
      "React",
      "Astro",
      "Vite",
      "SSR/SSG",
      "TailwindCSS",
      "Shadcn/UI",
      "Puppeteer",
      "Playwright / Vitest",
    ],
    backend: [
      "Node.js",
      "REST",
      "GraphQL",
      "PostgreSQL",
      "Redis",
      "Docker",
      "Rust",
    ],
    quality: ["Юнит-тесты", "E2E-тесты", "Code review", "Линтинг", "CI"],
  },

  links: [
    { label: "GitHub", href: "https://github.com/alekseylovchikov" },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/aleksei-lovchikov/",
    },
  ],
};
