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

Results are added below once the runs are done.
