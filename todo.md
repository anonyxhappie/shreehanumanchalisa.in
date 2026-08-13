
## GitHub Pages hosting

- [ ] Inspect the PR branch and current Vite configuration.
- [ ] Configure the repository base path and GitHub Pages build workflow.
- [ ] Run the production build and push the hosting configuration.
- [ ] Enable GitHub Pages and wait for the deployment workflow.
- [ ] Verify the hosted URL and report the result.

## Main-branch Pages deployment

- [ ] Verify PR #1 is merged and inspect main branch state.
- [ ] Synchronize the Pages workflow and repository-hosted assets with main.
- [ ] Trigger the Pages workflow from main.
- [ ] Verify the live GitHub Pages URL and deployment status.

## GitHub Pages 404 diagnosis

- [ ] Inspect merged main, Pages configuration, latest workflow, and public response.
- [ ] Identify whether the 404 is caused by deployment status, artifact paths, or repository base configuration.
- [ ] Apply the minimal fix and push it to main through the appropriate branch.
- [ ] Rerun the Pages deployment and verify the public URL.

## GitHub Pages media loading

- [ ] Inspect deployed HTML, CSS, image, and audio URL responses.
- [ ] Identify missing repository-base prefixes or stale deployment files.
- [ ] Patch all media references and deploy through a follow-up pull request if needed.
- [ ] Verify the public images, audio, and styles after deployment.

## GitHub Actions check diagnosis

- [ ] Inspect the merged media-fix commit and all associated workflow runs.
- [ ] Identify the exact failed job and whether it is a duplicate, concurrency cancellation, or real build/deploy failure.
- [ ] Apply a workflow correction only if the failure is actionable.
- [ ] Verify the latest main deployment and explain the check status.

## Custom-domain GitHub Pages diagnosis

- [x] Inspect custom-domain HTTP, DNS, deployed HTML, and workflow state.
- [x] Identify whether the blank page is caused by repository base paths, CNAME handling, or runtime errors.
- [x] Apply the minimal custom-domain-safe fix through a follow-up branch and pull request.
- [ ] Verify the custom domain after deployment; awaiting PR #5 merge.

## Feedback and analytics

- [ ] Inspect current footer, analytics script, and event hooks.
- [ ] Add a feedback section with a static-site-safe submission path and privacy note.
- [ ] Add analytics events for language changes, playback, meaning toggle, and feedback clicks.
- [ ] Verify responsive layout, type-check, production build, and preview.
- [ ] Save a delivery checkpoint or follow-up pull request as appropriate.
