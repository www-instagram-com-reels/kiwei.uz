KIWEI.UZ - Local static anime site

Quick start

1. Open `index.html` in your browser (double-click or use Live Server).
2. Admin panel: click the "Admin" button, select or create an admin, then click "➕ Anime Qo'shish".
3. To export site data (animes, admins, genres) click the "Export" button — this downloads `kiwei_data.json` you can commit to GitHub.

Push to GitHub (basic):

```bash
# from the project folder
git init
git add .
git commit -m "Initial KIWEI.UZ site"
# create repo on GitHub, then:
git remote add origin https://github.com/youruser/yourrepo.git
git branch -M main
git push -u origin main
```

Notes
- Data is stored in browser `localStorage`. Use Export to get JSON.
- For production, move data to a backend or host static files on GitHub Pages.
