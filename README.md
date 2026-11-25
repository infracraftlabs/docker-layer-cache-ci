# docker-layer-cache-ci

Demo for the InfraCraft Labs guide
[Docker layer caching in CI](https://infracraftlabs.com/insights/faster-docker-builds-in-ci/).

The same small TypeScript app is built three ways on every push, each with its own GitHub Actions cache scope:

| Job | Dockerfile | Cache export |
| --- | --- | --- |
| `naive` | `Dockerfile.naive` (copies everything, then `npm ci`) | `type=gha`, `mode=max` |
| `ordered-min` | `Dockerfile` (lockfiles first, multi-stage) | `type=gha`, `mode=min` (the default) |
| `ordered-max` | `Dockerfile` | `type=gha`, `mode=max` |

After a code-only change, look at which `RUN npm ci` steps show `CACHED` in each job's log.

## Results (25 November 2026)

GitHub-hosted `ubuntu-24.04`, Buildx 0.39.0, `type=gha` cache. One cold run, then three code-only pushes
(changing one line in `src/index.ts`). Each job uses its own cache scope.

| After a code-only change | Build-stage `npm ci` | Final-stage `npm ci` | Build step, median of 3 |
| --- | --- | --- | --- |
| `naive` | reran (426 packages) | n/a | 14 s |
| `ordered-min` | reran (426 packages) | from cache | 15 s |
| `ordered-max` | from cache | from cache | 17 s |

- The hit pattern was identical in all three runs. With `mode=min` (the default), the build stage's install is not
  exported, so a clean runner reinstalls it every time. Only `mode=max` keeps it.
- No time was saved here: `npm ci` for this app takes about 3 s on the runner, which is about what restoring the
  cached layers costs. Single runs ranged from 7 to 30 s. The cache pays off when the skipped step is expensive.
- Read the log, not the duration: a miss shows npm's `added 426 packages` line; a hit from the imported cache shows
  the layer being downloaded and extracted instead.

The same three setups were run three times locally (Docker 29.7.2, registry cache, a fresh builder per build):
7.6 s, 7.8 s and 5.4 s median for `naive`, `ordered-min` and `ordered-max`, with the same hit pattern.
