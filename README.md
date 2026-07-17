# OLD MEN Task Force HQ

A GitHub Pages-ready Boom Beach task force showcase for **OLD MEN** (`#PCC00J08`).

The page acts as a lightweight command board: current operation, command structure, previous leaders, spotlighted player, roster highlights, squad rules, and a sortable full roster.

## Run Locally

```bash
npm install
npm run dev
```

The dev server serves `docs/` at `http://localhost:3000`.

## Project Structure

- `docs/index.html` - static page shell and content sections
- `docs/data.js` - static task force data: roster, player config, changelog, graveyard, and current operation
- `docs/styles.css` - tactical visual system, responsive layout, motion, and roster cards
- `docs/app.js` - computed badges, filtering, sorting, and rendering

## Updating Stats

Most task force data lives in `docs/data.js`.

- Update `lastUpdated` and `currentOperation` for each refresh.
- Update `spotlightedPlayer` to change the Spotlighted Player (just set `name` to a current roster member).
- Update `members` for roster stats, role changes, missed attacks, and participation.
- Update `playerConfig` for custom avatars, titles, and accent colors.
- Update `roleChanges` and `graveyard` when players join, are promoted/demoted, or leave.

Roster Intel, Attacks, and Participation are treated as grand totals. The activity panel intentionally labels those as roster highlights rather than weekly stats.

## Deployment

This repository is already shaped for GitHub Pages. Publish the `docs/` directory from the repository settings.
