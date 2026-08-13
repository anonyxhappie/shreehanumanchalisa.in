# GitHub Pages 404 findings

Checked URL: https://anonyxhappie.github.io/shreehanumanchalisa.in/

GitHub Pages API reports Pages enabled with `build_type: workflow`, `html_url: https://anonyxhappie.github.io/shreehanumanchalisa.in/`, and source branch `main`.

The latest main workflow run `31674392739` completed successfully. A direct curl request returned HTTP 200 and the deployed app HTML, including base-prefixed asset URLs such as `/shreehanumanchalisa.in/assets/index-DvYfF5Cj.js`.

The browser-rendered page nevertheless showed the app's own React 404 screen. This means the host is serving the built HTML, but the client-side router is receiving a pathname it does not recognize or the deployed asset/app state is stale. Next checks should inspect the browser URL/path and the built JavaScript route handling, then add a GitHub Pages-safe fallback or pathname normalization if needed.
