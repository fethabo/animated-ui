## 1. Release Tooling Setup

- [x] 1.1 Add `@fethabo/tagman` to the repository release workflow as the single release entrypoint.
- [x] 1.2 Define the tagman configuration needed to derive release notes from git commits since the previous tag.
- [x] 1.3 Define the package-version update step so the tool writes the new version into `package.json` at tag time.

## 2. Changelog Automation

- [x] 2.1 Implement generation of `CHANGELOG.md` entries from commit history between release tags.
- [x] 2.2 Verify the generated changelog groups and formats entries consistently with the repository's commit history.
- [x] 2.3 Ensure the release flow no longer depends on manual changelog editing for future releases.

## 3. Version Tag Sync

- [x] 3.1 Make the release flow update the package version only when a new release tag is created.
- [x] 3.2 Verify the version written to `package.json` matches the generated release tag.
- [x] 3.3 Add safeguards so the runtime package does not gain a dependency on the release tool.

## 4. Documentation and Validation

- [x] 4.1 Document the new release workflow and the role of `@fethabo/tagman` in repository release notes or contributor docs.
- [x] 4.2 Validate the first tagman-generated release output against the current repository history.
- [x] 4.3 Confirm the release workflow leaves the published package usable without any runtime changes.
