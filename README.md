# lod-starter-kit

This is a starter kit for experimenting with Linked Open Data (LOD) at the workshop on the [Open Data Day München 2026](https://veranstaltungen.muenchen.de/rit/veranstaltungen/open-data-day-muenchen-2026/).

It contains two routes to explore:
- `create-lod` is about creating LOD by transforming other types of data into it
  - I used scripts `04`, `05` and `06` to build up the demo use case "family friendly Munich" during the workshop
- `use-lod` is about different ways to use existing LOD
  - `02` used the output of the previous scripts to build an interactive map for the use case

Both folders share the `package.json` file.

> For the purpose of the workshop I built a little reverse proxy to a shared virtuoso instance. I moved its code [here](https://github.com/benjaminaaron/virtuoso-sparql-reverse-proxy).

## Setup

Node.js is required. Download and installation instructions can be found [here](https://nodejs.org/en/download).

```bash
npm install
```
