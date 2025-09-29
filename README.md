# Well: Classificador de Questões OBI

Interface **web mobile-first** desenvolvida em **Next.js + Tailwind CSS** para **explorar, filtrar e classificar questões da Olimpíada Brasileira de Informática (OBI)**.  
O projeto é educacional e open-source, com foco em **Aprendizado de Máquina** e **Ciência da Computação** aplicada à educação.

---

## 🚀 Funcionalidades

- Explorar questões com **filtros por Ano, Nível e Fase**.
- Classificação automática das questões em:
  - **Ordenação** → Problemas envolvendo a ordem de objetos.
  - **Agrupamento** → Problemas envolvendo a pertença de objetos a grupos.
  - **Outros** → Problemas que envolvem cálculos, representações gráficas etc.
- Modal com visual limpo para exibição de **enunciado, pergunta e alternativas**.
- Página de **Repositório** para questões ainda não classificadas.
- Integração com **API da OpenAI** para classificação automática.
---

## 🛠️ Tecnologias

- [Next.js 15 (App Router)](https://nextjs.org/)
- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [OpenAI API](https://platform.openai.com/)
- [PapaParse](https://www.papaparse.com/) (futuro parser de CSVs complexos)

---

⚙️ Como rodar localmente

## Repositório do Projeto
```bash
git clone https://github.com/seuusuario/well-classificador-obi.git
cd well-classificador-obi

## 📂 Estrutura

├── /app
│ ├── /classificar → Página para classificar novas questões
│ ├── /repositorio → Página do repositório (questões sem classe)
│ ├── /sobre → Página sobre o projeto
│ └── /api/classificar → Endpoint para integração com OpenAI
│
├── /components
│ ├── Navbar.tsx
│ ├── Footer.tsx
│ ├── FilterBar.tsx
│ ├── QuestionCard.tsx
│ ├── QuestionModal.tsx
│ └── QuestionModalRepo.tsx
│
├── /hooks
│ ├── useCsvData.ts
│ └── useCsvDataRepo.ts
│
├── /public
│ ├── logo.png
│ ├── dataset.csv
│ └── dataset_repositorio.csv
│
├── /lib
│ └── csv.ts → Funções utilitárias para CSV
│
├── package.json
└── README.md

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
