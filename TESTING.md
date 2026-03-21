# Pre-Push Testing Guide

This project uses GitHub Actions to automatically test and validate code before it goes to production.

## What Gets Tested?

✅ **Tests** - Unit tests run on every push  
✅ **Build** - Release build verification  
✅ **Format** - Code formatting (rustfmt)  
✅ **Lint** - Code quality checks (clippy)  
✅ **Security** - Dependency vulnerability audit  

## Run Tests Locally Before Pushing

### Quick Test
```powershell
cargo test
```

### Full Validation (Recommended)
```powershell
# Run all tests
cargo test --verbose

# Check formatting
cargo fmt -- --check

# Run clippy (linter)
cargo clippy -- -D warnings

# Build release version
cargo build --release
```

### One-Command Validation
```powershell
# Run everything at once
cargo test --verbose; cargo fmt -- --check; cargo clippy -- -D warnings; cargo build --release
```

## How CI/CD Works

**When you push:**
1. GitHub Actions automatically runs tests
2. If tests **pass** ✅ → Code is safe to merge
3. If tests **fail** ❌ → Push is blocked until fixed

**Check Status:**
- Go to your GitHub repo
- Click the **Actions** tab
- See real-time test results

## Pull Request Flow

1. Create a feature branch
2. Make your changes
3. Push to your branch
4. GitHub Actions runs automatically
5. Once all checks pass ✅, create a Pull Request
6. Merge when ready

## Fix Common Issues

### Tests Failing?
```powershell
cargo test -- --nocapture   # See detailed output
```

### Format Issues?
```powershell
cargo fmt   # Auto-fix formatting
```

### Clippy Warnings?
```powershell
cargo clippy --fix   # Auto-fix some issues
```

## Need Help?

Check the GitHub Actions logs:
1. Go to **Actions** tab in your repo
2. Click the failed workflow
3. See exactly what failed
4. Fix locally and push again

---

**Remember:** Better to catch bugs here than in production! 🚀
