# OLD MEN Task Force HQ

A GitHub Pages-ready Boom Beach task force showcase for **OLD MEN** (`#PCC00J08`).

The page acts as a lightweight command board: current operation, command structure, previous leaders, player of the week, roster highlights, squad rules, and a sortable full roster.

## Run Locally

```bash
npm install
npm run dev
```

The dev server serves `docs/` at `http://localhost:3000`.

## Project Structure

- `docs/index.html` - static page shell and content sections
- `docs/styles.css` - tactical visual system, responsive layout, motion, and roster cards
- `docs/app.js` - player config, roster data, computed badges, filtering, sorting, and rendering

## Updating Stats

Most task force data lives near the top of `docs/app.js`.

- Update `LAST_UPDATED` and `CURRENT_OP` for each refresh.
- Update `POTW_DATA` for Player of the Week.
- Update `MEMBERS` for roster stats, role changes, missed attacks, and participation.
- Update `PLAYER_CONFIG` for custom avatars, titles, and accent colors.

Roster Intel, Attacks, and Participation are treated as grand totals. The activity panel intentionally labels those as roster highlights rather than weekly stats.

## Deployment

This repository is already shaped for GitHub Pages. Publish the `docs/` directory from the repository settings.
