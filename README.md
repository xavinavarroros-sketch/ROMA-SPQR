# ROME-YES App

React/Vite app for the Roman Republic strategy roleplay game.

## Latest update
- Motions now auto-resolve when AYE or NAY reaches majority of enrolled senators.
- Automatically passed/failed motions are marked as auto-majority.
- Court case submitters can rewrite/edit their submitted cases before Praetor/GM approval.
- Court case submitters can withdraw their submitted case before approval.
- Praetor Urbanus and GM retain full case management controls.

## Railway
Build Command: npm install && npm run build
Start Command: npm run start

Do not upload node_modules, dist, .env, .env.local, or package-lock.json.

## Latest update: Winter seasons and seasonal production

- Campaign calendar now uses five seasons: Spring, Early Summer, Late Summer, Autumn and Winter.
- Winter automatically reduces food production by 25%.
- The reduction applies to regional food income and private estate/business food income.
- Food-producing businesses show a winter marker when winter efficiency is reduced.
- A season banner appears in player and GM areas, changing tone/color by season.
- When advancing into winter, the app posts a notification warning that food production is reduced.
