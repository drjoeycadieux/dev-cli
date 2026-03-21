# 🦀 Dev-CLI

**Tired of hunting for installers?** Dev-CLI is here to help! 🎉

This is a **modern, lightning-fast command-line tool** built with Rust that makes installing developer tools on Windows **super simple**. Think of it as your personal assistant for managing all those tools you need—Node.js, Python, Git, VS Code, and more—all from one command!

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows-blue.svg)
![Build](https://img.shields.io/badge/build-Rust-orange.svg)

---

## 🎯 What Problem Does This Solve?
- ❌ **No more manual downloads**: Stop visiting 10 different websites
- ❌ **No more broken installers**: Everything works reliably
- ❌ **No more guessing**: Our curated tool list makes it easy
- ✅ **Just one command**: `dev-cli install nodejs` and you're done!

---

## 🌐 Website & Docs
Want to see Dev-CLI in action?
👉 **[dev-cli.netlify.app](https://dev-cli.netlify.app)**

---

## 🚀 Get Started in 30 Seconds
Open PowerShell and paste this command:
```powershell
iwr -useb https://dev-cli.netlify.app/install.ps1 | iex
```

That's it! You're ready to go. Try it out:
```powershell
dev-cli install nodejs
```

---

## ✨ Why You'll Love It
- 🏃 **Lightning Fast**: Built with Rust—installs are blazingly quick
- 📦 **Curated Tools**: Pre-selected developer tools that actually matter
- 🎨 **Beautiful Output**: Colorful, interactive terminal experience
- 🛡️ **Zero Hassle**: One-command installs with zero configuration
- 💻 **Windows Native**: Works perfectly with Windows Package Manager (winget)

---

## 🛠️ Commands You'll Use
| Command | What It Does |
| :--- | :--- |
| `dev-cli list` | See all available tools 📋 |
| `dev-cli install <name>` | Install a tool (e.g., `dev-cli install git`) 📥 |
| `dev-cli check` | Check what tools you have installed ✅ |
| `dev-cli --help` | Get help anytime 💡 |

---

## 🏗️ Want to Build It Yourself?
### What You'll Need
- **Rust**: Get it from [rustup.rs](https://rustup.rs) (it's easy, I promise!)
- **Visual Studio Build Tools**: Just the C++ build tools part

### Let's Build! 🔨
1. Clone it:
   ```bash
   git clone https://github.com/drjoeycadieux/dev-cli.git
   cd dev-cli
   ```

2. Build it:
   ```bash
   cargo build --release
   ```

3. Your executable is here: `target/release/dev-cli.exe`

---

## 📂 Inside the Project
```
dev-cli/
├── src/              → Rust code ⚙️
├── website/          → Beautiful landing page 🌐
├── Cargo.toml        → Project setup file
└── netlify.toml      → Deployment config
```

---

## 🤝 Want to Help? 
We love contributions! Here's what to do:

1. **Fork** the project
2. **Create a branch** for your feature (`git checkout -b feature/MyAwesomeFeature`)
3. **Make your changes** and commit them (`git commit -m 'Added something cool'`)
4. **Push to your branch** (`git push origin feature/MyAwesomeFeature`)
5. **Open a Pull Request** and let's chat! 💬

---

## 📝 License
MIT License—feel free to use this however you want!

**Made with ❤️ by [Joey Cadieux](https://github.com/drjoeycadieux)**

**Got questions?** Check out the [GitHub Issues](https://github.com/drjoeycadieux/dev-cli/issues) or open a discussion! 🚀
