# NIST Mobile Security Audit Workflow Guide

## Overview

The **NIST Mobile Security Audit** workflow automatically runs on every merge to `main` and on pull requests. It validates your Recipes-Galore mobile app against:

- **OWASP Mobile Top 10** (M1-M10)
- **NIST SP 800-218 Secure Software Development Framework (SSDF)**
- **Firebase Security Best Practices**

## Workflow Triggers

- ✅ Every push to `main` branch
- ✅ Every pull request targeting `main` branch

## Security Checks Performed

### M1: Improper Credential Usage
**What it checks:**
- Hardcoded API keys, tokens, or credentials in source code
- Firebase config outside of environment files
- Weak token storage patterns

**Fix if flagged:**
```typescript
// ❌ WRONG: Hardcoded credentials
const apiKey = "sk-abc123def456";

// ✅ CORRECT: Use environment configuration
import { environment } from '../../environments/environment';
const apiKey = environment.firebase.apiKey;
```

### M2: Inadequate Supply Chain Security
**What it checks:**
- Outdated or vulnerable npm dependencies
- Unsafe package versions
- Dependency lock file consistency

**Fix if flagged:**
```bash
# Update vulnerable dependencies
npm update
npm audit fix

# Review critical vulnerabilities
npm audit --audit-level=critical
```

### M3: Insecure Authentication/Authorization
**What it checks:**
- Firebase Auth proper implementation
- Auth state management patterns
- Route guards on protected pages
- Social provider configuration

**Fix if flagged:**
- Ensure `auth.service.ts` uses `@angular/fire/auth`
- Verify route guards in `app.routes.ts`
- Confirm auth state listeners with `onAuthStateChanged`

### M4: Insufficient Input/Output Validation
**What it checks:**
- Direct `innerHTML` usage (XSS vulnerability)
- Bypassed Angular sanitization (e.g., `bypassSecurityTrustHtml`)
- Unsafe data binding

**Fix if flagged:**
```typescript
// ❌ WRONG: Direct innerHTML
element.innerHTML = userInput;

// ✅ CORRECT: Let Angular handle sanitization
<div [innerText]="userInput"></div>
```

### M5: Insecure Communication
**What it checks:**
- Non-HTTPS endpoints
- Plain HTTP calls in production

**Fix if flagged:**
```typescript
// ❌ WRONG
const url = "http://api.example.com/data";

// ✅ CORRECT: Use HTTPS only
const url = "https://api.example.com/data";
```

### M6: Inadequate Privacy Controls
**What it checks:**
- Sensitive data logged to console (passwords, tokens, credentials)
- Sensitive data in plain text logs

**Fix if flagged:**
```typescript
// ❌ WRONG: Logging sensitive data
console.log('User token:', token);
console.log('Password:', password);

// ✅ CORRECT: Log only non-sensitive identifiers
console.log('User authenticated: ' + userId);
```

### M9: Insecure Data Storage
**What it checks:**
- Proper use of Firestore (managed encryption) vs browser storage
- Unencrypted local storage usage

**Fix if flagged:**
- Use **Firestore** for all user data (automatically encrypted)
- Only use browser storage for non-sensitive UI state
- Never store auth tokens in localStorage

### M10: Insufficient Cryptography
**What it checks:**
- Use of deprecated algorithms
- Hardcoded encryption keys
- Weak cryptographic implementations

**Fix if flagged:**
- Firebase handles encryption automatically
- Don't implement custom crypto—use Firebase services

### Firebase Configuration Validation
**What it checks:**
- Firebase config in `environment.ts`
- Firebase config in `environment.prod.ts`
- Separate dev/prod Firebase projects

**Fix if flagged:**
```typescript
// src/environments/environment.ts (DEV)
export const environment = {
  production: false,
  firebase: {
    apiKey: "YOUR_DEV_API_KEY",
    projectId: "recipes-galore-dev",
    // ... other config
  }
};

// src/environments/environment.prod.ts (PROD)
export const environment = {
  production: true,
  firebase: {
    apiKey: "YOUR_PROD_API_KEY",
    projectId: "recipes-galore-prod",
    // ... other config
  }
};
```

### Authentication Implementation Review
**What it checks:**
- Auth service exists and uses Firebase Auth
- Auth state management (observables)
- Social auth providers (Google, Apple)

### Route Guards Validation
**What it checks:**
- `auth.guard.ts` protects authenticated routes
- `auth-redirect.guard.ts` prevents authenticated users from login/signup
- Guards are applied to routes in `app.routes.ts`

## Understanding Workflow Output

### In GitHub Actions
1. **View the workflow run:** Go to **Actions** tab → **NIST Mobile Security Audit** → Latest run
2. **Summary view:** Shows audit findings organized by security control
3. **Step details:** Expand individual steps for detailed diagnostic output

### On Pull Requests
- Automated comment posted if issues are detected
- Click the comment to navigate to full audit results
- Workflow blocks merge if critical vulnerabilities exist

## Finding Severity Levels

| Level | Symbol | Meaning |
|-------|--------|---------|
| ✅ | PASS | Requirement satisfied; no action needed |
| ℹ️ | INFO | Informational; verify configuration is intentional |
| ⚠️ WARNING | Warning | Should be addressed; creates potential risk |
| ⚠️ CRITICAL | Critical | Must be fixed before merge to main |

## Addressing Audit Findings

**Workflow:**
1. Review all findings in the audit report
2. Fix issues in priority: CRITICAL → WARNING → INFO
3. Push fixes to your branch
4. Workflow runs automatically and updates audit report
5. Once all issues resolved, approval for merge

**Example: Fixing a CRITICAL Issue**
```bash
# 1. Review the audit finding (e.g., hardcoded API key in auth.service.ts)
# 2. Make the fix
git checkout -b fix/remove-hardcoded-credentials

# 3. Edit the file to remove hardcoded values
# (your fix here)

# 4. Commit and push
git add .
git commit -m "fix: remove hardcoded credentials"
git push origin fix/remove-hardcoded-credentials

# 5. Create PR and wait for workflow to re-run
# The audit will validate your fix
```

## Common Audit Patterns

### Pattern 1: Hardcoded Firebase Config
**Issue:**
```typescript
// ❌ WRONG: Hardcoded in component
const firebaseConfig = {
  apiKey: "abc123...",
  projectId: "recipes-galore",
};
```

**Solution:**
```typescript
// ✅ CORRECT: Import from environment
import { environment } from '../../environments/environment';
this.firebaseConfig = environment.firebase;
```

### Pattern 2: Unprotected Routes
**Issue:**
```typescript
// ❌ WRONG: No guard on protected route
{ path: 'profile', component: ProfilePage }
```

**Solution:**
```typescript
// ✅ CORRECT: Guard protects route
import { authGuard } from './guards/auth.guard';
{ path: 'profile', component: ProfilePage, canActivate: [authGuard] }
```

### Pattern 3: Sensitive Data in Console
**Issue:**
```typescript
// ❌ WRONG: Logs sensitive data
console.log('Auth Token:', this.authService.getToken());
```

**Solution:**
```typescript
// ✅ CORRECT: Log only identifiers
console.log('User authenticated');
```

## Workflow Configuration

The workflow is defined in `.github/workflows/nist-mobile-audit.yml` and includes:

- **Dependency scanning** (`npm audit`)
- **Hardcoded credential detection** (grep patterns)
- **XSS vulnerability scanning**
- **HTTPS enforcement checks**
- **Firebase configuration validation**
- **Auth guard verification**
- **TypeScript strict mode validation**
- **Unit test execution**

## Escalation & Support

If you need guidance on fixing audit findings:

1. **Reference the agent documentation:** [.github/agents/nist-mobile-auditor.agent.md](.github/agents/nist-mobile-auditor.agent.md)
2. **OWASP Mobile Security:** https://owasp.org/www-project-mobile-top-10/
3. **NIST 800-218:** https://csrc.nist.gov/publications/detail/sp/800-218/final
4. **Firebase Security:** https://firebase.google.com/support/privacy-and-security

## Updating the Audit Rules

To modify which security checks run, edit:
- **Checks:** `.github/workflows/nist-mobile-audit.yml`
- **Guidelines:** `.github/agents/nist-mobile-auditor.agent.md`

Changes to audit rules apply to all future runs on main/PRs.
