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
  role: "Full‑stack разработчик",
  tagline:
    "Делаю быстрые, доступные и аккуратно спроектированные веб‑продукты: от идеи и архитектуры до релиза и поддержки.",
  location: "Cyprus",
  focus: [
    "Продуктовая разработка: чёткие требования → предсказуемые релизы",
    "Производительность и UX: быстрый рендер, понятные состояния, без “магии”",
    "Инженерная дисциплина: типизация, тесты, ревью, документация",
    "Интеграции и автоматизация: API, пайплайны, CI/CD",
  ],
  stack: {
    core: ["TypeScript", "Node.js", "HTML", "CSS"],
    frontend: [
      "Astro",
      "Vite",
      "SSR/SSG",
      "React",
      "Vite",
      "TailwindCSS",
      "Shadcn/UI",
    ],
    backend: ["REST", "GraphQL", "PostgreSQL", "Redis", "Rust"],
    quality: ["Тестирование", "Code review"],
  },
  links: [
    {
      label: "GitHub",
      href: "https://github.com/alekseylovchikov",
    },
    {
      label: "LinkedIn",
      href: "https://www.linkedin.com/in/aleksei-lovchikov/",
    },
  ],
};
