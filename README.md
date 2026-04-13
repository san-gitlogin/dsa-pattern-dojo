# The Pattern Dojo 🥋

Interactive DSA pattern learning app with step-by-step visualizations, real-world analogies, and line-by-line code explanations.

## Local Development

```bash
npm install
npm run dev
```

## Deploy to GitHub Pages

### Option 1: Automatic (GitHub Actions)

Every push to `main` auto-deploys. Just:

1. Create a new repo on GitHub named `dsa-pattern-dojo`
2. Push this code:
   ```bash
   git init
   git add .
   git commit -m "initial commit"
   git remote add origin https://github.com/san-gitlogin/dsa-pattern-dojo.git
   git branch -M main
   git push -u origin main
   ```
3. Go to **Settings > Pages** > Source: **GitHub Actions**
4. Wait for the action to finish — your site is live at:  
   `https://san-gitlogin.github.io/dsa-pattern-dojo/`

### Option 2: Manual deploy

```bash
npm run deploy
```
Then in **Settings > Pages**, set source to **Deploy from branch** > `gh-pages`.

## Important

If you use a **different repo name**, update these two places:

1. `vite.config.js` → `base: '/your-repo-name/'`
2. `package.json` → `homepage: 'https://san-gitlogin.github.io/your-repo-name/'`
