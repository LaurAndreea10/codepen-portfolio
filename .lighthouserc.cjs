// Same URLs and thresholds, but PRs measure checked-out code rather than the live site.
const config = JSON.parse(JSON.stringify(require("./.lighthouserc.json")));
if (process.env.LHCI_TARGET === "local") {
  const base = "http://127.0.0.1:8765/";
  config.ci.collect.url = config.ci.collect.url.map((url) =>
    url.replace("https://laurandreea10.github.io/codepen-portfolio/", base),
  );
  config.ci.collect.startServerCommand = "node scripts/lighthouse-server.mjs";
  config.ci.collect.startServerReadyPattern = "Listening";
  config.ci.collect.startServerReadyTimeout = 10000;
}
module.exports = config;
