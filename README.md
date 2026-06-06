# 🛵 Shopee Fleet Dashboard

Dashboard de acompanhamento de frota própria — **LM Hub SP · Campinas · São Martinho**

---

## 🚀 Deploy no Vercel (passo a passo)

### 1. Pré-requisitos
- Conta no [GitHub](https://github.com) (gratuita)
- Conta no [Vercel](https://vercel.com) (gratuita)

### 2. Suba o projeto no GitHub

```bash
# Na pasta do projeto:
git init
git add .
git commit -m "feat: Shopee Fleet Dashboard v1"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/shopee-fleet.git
git push -u origin main
```

### 3. Importe no Vercel

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Clique em **"Import Git Repository"**
3. Selecione o repositório `shopee-fleet`
4. Configurações detectadas automaticamente:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
5. Clique em **Deploy** ✅

### 4. Domínio personalizado (opcional)

No painel do Vercel:
- `Settings → Domains → Add Domain`
- Digite seu domínio (ex: `fleet.suaempresa.com.br`)
- Aponte o DNS conforme as instruções

---

## 💻 Rodar localmente

```bash
npm install
npm run dev
# Acesse: http://localhost:3000
```

---

## 📁 Estrutura do projeto

```
shopee-fleet/
├── index.html          # Entry point HTML (splash screen inclusa)
├── vercel.json         # Config Vercel (SPA routing + cache)
├── vite.config.js      # Build config
├── package.json        # Dependências
└── src/
    ├── main.jsx        # Bootstrap React
    └── App.jsx         # Dashboard completo
```

---

## 📦 Dependências principais

| Pacote       | Versão  | Uso                     |
|-------------|---------|-------------------------|
| React        | 18.x    | Framework UI            |
| Recharts     | 2.x     | Gráficos interativos    |
| Vite         | 5.x     | Build & Dev server      |

---

## 🎨 Tema

Cores oficiais **Shopee** — laranja `#EE4D2D` como cor dominante.

---

## ✉️ Suporte

Para dúvidas de configuração, entre em contato com o time de tecnologia.
