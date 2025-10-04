# Well: Classificador de Questões OBI

Aplicação mobile-first desenvolvida em Next.js + Tailwind CSS para exploração, filtragem e classificação de questões da Olimpíada Brasileira de Informática (OBI).

O objetivo principal é contribuir para a criação de materiais educacionais voltados ao treinamento da OBI, oferecendo suporte tanto para estudantes quanto para professores no processo de aprendizagem.

Esta é uma iniciativa open-source, com foco em Problemas de Lógica, em alinhamento com a BNCC da Computação, buscando fortalecer o ensino de pensamento computacional e incentivar a presença da computação na educação básica.

---

## 🚀 Funcionalidades

- Explorar questões com **filtros por Ano, Nível, Fase e Classe**.
- Classificação automática das questões em:
  - **Ordenação** → Problemas envolvendo a ordem de objetos.
  - **Agrupamento** → Problemas envolvendo a pertença de objetos a grupos.
  - **Outros** → Problemas que envolvem cálculos, representações gráficas etc.
- Modal com visual limpo para exibição de **enunciado, pergunta e alternativas**.
- Página de **Repositório** para questões ainda não classificadas.
- Integração com **API da OpenAI** para classificação automática com chain of thought prompting.
---

## 🛠️ Tecnologias

- [Next.js 15 (App Router)](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [OpenAI API](https://platform.openai.com/)

---

## Repositório do Projeto
```bash
git clone git@github.com:thiagocghc/Well_Classificador.git
```

## 📂 Estrutura
<pre lang="markdown"> ```
├── /app
│   ├── /classificar       → Página para classificar novas questões
│   ├── /repositorio       → Página do repositório (questões sem classe)
│   ├── /sobre             → Página sobre o projeto
│   └── /api/classificar   → Endpoint para integração com OpenAI
│
├── /components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── HomePage.tsx       → Página inicial
│   ├── SobrePage.tsx      → Página "Sobre"
│   ├── RepositorioPage.tsx→ Página do repositório
│   ├── FilterBar.tsx
│   ├── QuestionCard.tsx
│   ├── QuestionModal.tsx
│   ├── QuestionModalRepo.tsx
│   └── ui.tsx             → Componentes reutilizáveis (botões, selects, inputs, etc.)
│
├── /hooks
│   ├── useCsvData.ts
│   └── useCsvDataRepo.ts
│
├── /public
│   ├── logo.png
│   ├── dataset.csv
│   └── dataset_repositorio.csv
│
├── /lib
│   └── csv.ts             → Funções utilitárias para CSV
│
├── package.json
└── README.md

``` </pre>

## Dependências
NodeJS 22.20.0
npx create-next-app@latest myapp
npm install openai
npm install react-icons

## ENV
Você deve obter uma API KEY da OPENAI
OPENAI_API_KEY="sua_chave"
OPENAI_MODEL=gpt-5-mini

## Contato
Autor: Thiago Almeida
GitHub: @thiagocghc
WhatsApp: 67 98402-6511
