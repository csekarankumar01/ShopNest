# Security Guidelines

## 🔐 Protecting Your Project

### 1. Never Commit Secrets to Git

❌ **NEVER commit these files:**
- `.env`
- `.env.local`
- `.env.production`
- Any files containing API keys, passwords, or tokens

✅ **DO commit these files:**
- `.env.example` (with placeholder values)
- `.gitignore` (properly configured)

### 2. Using Environment Files Locally

```bash
# Create your local .env from the template
cp backend/.env.example backend/.env

# Edit with your actual credentials
nano backend/.env
```

### 3. GitHub Secret Scanning

GitHub automatically scans for exposed secrets. If you accidentally commit secrets:

1. **Immediately rotate the exposed credentials**
2. **Use `git filter-branch` to remove from history:**
   ```bash
   git filter-branch --tree-filter 'rm -f .env' HEAD~10..HEAD
   git push --force
   ```
3. **Replace the credentials** in all third-party services

### 4. Deployment Platform Secrets

When deploying on **Render** or **Vercel**:

1. Use the platform's environment variable manager
2. Never paste secrets into public files
3. Use platform-specific secrets features when available

**Render:**
- Dashboard → Environment → Add Variables
- Marked as "Encrypted"

**Vercel:**
- Settings → Environment Variables
- Select scope (production, preview, development)

### 5. Required Credentials

Get these from:

| Service | How to Get |
|---------|-----------|
| **MongoDB URI** | MongoDB Atlas dashboard |
| **JWT_SECRET** | Generate a random string: `openssl rand -base64 32` |
| **Cloudinary** | Sign up at cloudinary.com |
| **Razorpay** | Sign up at razorpay.com (use test keys) |
| **Gmail App Password** | Google Account Settings → Security |

### 6. Rotating Credentials

When you suspect exposure:

1. **Disable old credentials** in the third-party service
2. **Generate new credentials**
3. **Update in deployment platform**
4. **Update local `.env` files**
5. **Redeploy application**

### 7. What NOT to Do

❌ Post screenshots with secrets visible
❌ Share `.env` files via email
❌ Hardcode secrets in code
❌ Push development `.env` to production
❌ Use the same secrets for dev and production

### 8. What TO Do

✅ Use `.env.example` as documentation
✅ Rotate credentials regularly
✅ Use strong, random values for JWT_SECRET
✅ Enable 2FA on third-party services
✅ Audit git history periodically
✅ Use different credentials for each environment

---

## 🚨 If You Expose Secrets

**Immediate Actions:**

1. **Stop the server immediately**
2. **Rotate all exposed credentials:**
   - Generate new JWT_SECRET
   - Disable old Razorpay keys
   - Create new Cloudinary API credentials
   - Generate new MongoDB credentials
3. **Remove from git history:**
   ```bash
   git filter-branch --tree-filter 'rm -f .env' --prune-empty -f -- --all
   git push --force
   ```
4. **Update in deployment platform**
5. **Restart services**

---

## ✅ Security Checklist

Before deploying to production:

- [ ] `.env` file is in `.gitignore`
- [ ] No `.env` file in git history
- [ ] `.env.example` contains only placeholders
- [ ] All credentials are unique (not reused from other projects)
- [ ] JWT_SECRET is a strong random value
- [ ] Production Razorpay keys are used (not test keys)
- [ ] Database credentials are secure
- [ ] HTTPS is enabled
- [ ] CORS is properly configured
- [ ] Sensitive logs are not exposed

---

## 📚 Resources

- [GitHub - Managing encrypted secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [OWASP - Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [Render - Environment Variables](https://render.com/docs/environment-variables)
- [Vercel - Environment Variables](https://vercel.com/docs/projects/environment-variables)

---

**Remember: Security is not optional. Protect your credentials!** 🔒
