# Release & Version Bump Workflow

## Overview

The **Release & Version Bump** workflow is a manual, controlled release process that:

1. Asks the developer which version component to bump (major, minor, or patch)
2. Updates `package.json` and `package-lock.json`
3. Commits the version change directly to `main`
4. Creates a GitHub Release with automated release notes

## Important Features

✅ **Manual Trigger Only** (`workflow_dispatch`)
- Cannot run automatically
- Developer explicitly chooses when to release
- Not triggered by merges or CI/CD events

✅ **Isolated from Security Audits**
- NIST Mobile Security Audit workflow ignores `package.json` commits
- Version bumps don't trigger unnecessary security scans
- Keeps workflows independent and focused

✅ **Semantic Versioning**
- **Patch** (x.y.**Z**) — Bug fixes, security patches, minor improvements
- **Minor** (x.**Y**.z) — New features, backward compatible
- **Major** (**X**.y.z) — Breaking changes, major updates

## How to Use

### Step 1: Navigate to GitHub Actions
1. Go to your repository on GitHub
2. Click **Actions** tab
3. Select **Release & Version Bump** workflow

### Step 2: Trigger the Workflow
1. Click **Run workflow** button
2. Select the version bump type:
   - `patch` — Bug fixes, patches
   - `minor` — New features
   - `major` — Breaking changes
3. Click **Run workflow**

### Step 3: Monitor the Execution
- Workflow runs automatically with your selected version type
- Updates `package.json` version
- Commits to `main` automatically
- Creates GitHub Release

### Step 4: Add Release Notes
1. Go to **Releases** on GitHub
2. Click on the newly created release (e.g., `v1.0.0`)
3. Click **Edit release**
4. Add release notes in the description:
   - New features
   - Bug fixes
   - Breaking changes
   - Known issues

## Version Examples

| Current | Bump Type | New Version | Use Case |
|---------|-----------|-------------|----------|
| 0.0.1 | patch | 0.0.2 | Bug fix, security patch |
| 0.0.2 | minor | 0.1.0 | New recipe feature |
| 0.1.0 | major | 1.0.0 | First production release |
| 1.0.0 | patch | 1.0.1 | Hotfix |
| 1.0.1 | minor | 1.1.0 | New auth provider |
| 1.1.0 | major | 2.0.0 | Major architecture change |

## What the Workflow Does

### 1. Version Bump
```bash
npm version [patch|minor|major] --no-git-tag-version
```
Automatically calculates new version:
- **Patch:** Increments Z in x.y.Z
- **Minor:** Increments Y in x.Y.z (resets Z to 0)
- **Major:** Increments X in X.y.z (resets Y and Z to 0)

### 2. Commit to Main
```bash
git add package.json package-lock.json
git commit -m "chore: bump version to [VERSION]"
git push origin main
```

### 3. Create Release
- Creates GitHub Release tag: `v[VERSION]`
- Includes automated release notes
- Links to commits since last release

## Important Notes

⚠️ **Direct Commits to Main**
- This workflow commits directly to `main` (not via PR)
- Reserved for release management only
- Standard development uses PRs with security audits

⚠️ **Security Audit Bypass**
- Package.json commits are ignored by `nist-mobile-audit.yml`
- This keeps version bumps fast and focused
- Other code changes still trigger full security audit

⚠️ **Mobile App Distribution**
- After release, handle mobile app builds separately:
  - iOS build → TestFlight/App Store
  - Android build → Play Store

## Workflow States

```
Manual Trigger (workflow_dispatch)
    ↓
Get Current Version
    ↓
Bump Version (patch/minor/major)
    ↓
Commit to Main
    ↓
Create GitHub Release
    ↓
Display Release Summary
```

## Troubleshooting

### "Commit failed"
- Another PR may be merging simultaneously
- Wait a few moments and retry

### "Release creation failed"
- GitHub token permissions issue
- Contact repository administrators

### "Wrong version bumped"
- Can't undo automatically (by design)
- Option 1: Create hotfix branch and merge
- Option 2: Manual adjustment via next release

## Integration with CI/CD

The release workflow is **completely isolated**:

| Workflow | Trigger | Includes |
|----------|---------|----------|
| `nist-mobile-audit.yml` | PR + push to main (code) | Security audit, tests |
| `release.yml` | Manual (workflow_dispatch) | Version bump, release creation |

**Result:** Version bumps never trigger security scans, keeping workflows focused and fast.

## Mobile App Store Deployment

After release is created:

1. **Update version in build tools:**
   - Xcode (iOS)
   - Android Studio (Android)

2. **Verify app version in UX:**
   - Check Profile page footer: `Version v[VERSION]`

3. **Submit to app stores:**
   - Apple App Store Connect
   - Google Play Console

4. **Link release to app store submissions:**
   - Document in GitHub Release notes
   - Cross-reference TestFlight/Play Store build numbers
