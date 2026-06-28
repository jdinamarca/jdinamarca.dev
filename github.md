# GitHub Authentication Guide: Solving Multiple Account Issues

## Problem Overview

When you tried to push to GitHub, you encountered a 403 permission error:
```
remote: Permission to jdinamarca/jdinamarca.dev.git denied to jsondinamarca.
fatal: unable to access 'https://github.com/jdinamarca/jdinamarca.dev.git/': The requested URL returned error: 403
```

This happened because Git was trying to authenticate using your work email (`jdinamarca@snakode.com`) for a personal repository, and GitHub denied access.

## The Solution: SSH Authentication

We solved this by configuring SSH (Secure Shell) authentication instead of HTTPS.

### What is SSH?

SSH (Secure Shell) is a cryptographic network protocol that provides secure communication between two systems. In our case, it allows your local machine to securely communicate with GitHub's servers.

### How SSH Works for GitHub

1. **Key Generation**: We created a public/private key pair
   - Private key: Stored securely on your machine
   - Public key: Added to your GitHub account

2. **Authentication Process**:
   - When you connect to GitHub, your machine presents the private key
   - GitHub verifies it matches the public key you added
   - If they match, GitHub grants access without needing your password

## Step-by-Step Process

### 1. Generate SSH Key
```bash
ssh-keygen -t ed25519 -C "tu-email-personal@gmail.com"
```

### 2. Add Public Key to GitHub
- Copy your public key: `cat ~/.ssh/id_ed25519.pub`
- Go to GitHub Settings > SSH and GPG keys > New SSH key
- Paste your public key

### 3. Test Connection
```bash
ssh -T git@github.com
```

### 4. Update Git Remote URL
```bash
git remote set-url origin git@github.com:jdinamarca/jdinamarca.dev.git
```

## Why This Works

- **Separate Authentication**: SSH uses key-based authentication instead of username/password
- **Account Independence**: Each SSH key can be associated with a specific GitHub account
- **No More 403 Errors**: GitHub authenticates you based on the SSH key, not your email

## Managing Multiple GitHub Accounts

If you have multiple accounts (work and personal), you can:

1. **Generate separate SSH keys** for each account
2. **Configure SSH config** to use different keys for different hosts
3. **Use SSH instead of HTTPS** for all repositories

## Verification

After setup, you can verify:
```bash
ssh -T git@github.com  # Should show authentication success
git push -u origin main  # Should work without 403 error
```

## Benefits of SSH

- **Secure**: Uses public-key cryptography
- **Convenient**: No need to enter password for each push
- **Scalable**: Easy to manage multiple accounts
- **Reliable**: Works consistently across different networks

## Common Issues and Solutions

- **Permission denied**: Verify your public key is correctly added to GitHub
- **Host authenticity warning**: Accept once (safe for GitHub)
- **Wrong account access**: Check which SSH key is being used

This SSH setup provides a robust solution for managing multiple GitHub accounts and ensures secure, reliable authentication for your repositories.