# 🦀 Dev-CLI

**Dev-CLI** is a modern, high-performance command-line interface built with **Rust**, designed specifically for Windows developers. It serves as a beautiful, efficient wrapper around the **Windows Package Manager (winget)**, providing a curated toolset and a premium terminal experience.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Platform](https://img.shields.io/badge/platform-Windows-blue.svg)
![Build](https://img.shields.io/badge/build-Rust-orange.svg)

---

## 🌐 Website & Docs
Visit our live landing page and interactive documentation:
👉 **[dev-cli.netlify.app](https://dev-cli.netlify.app)**

---

## 🚀 Quick Install (PowerShell)
To install the latest version of Dev-CLI, run this in an administrative PowerShell window:
```powershell
iwr -useb https://dev-cli.netlify.app/install.ps1 | iex
```

---

## ✨ Features
-   **Ultra-Fast**: Built with Rust for blazing performance and 0ms startup times.
-   **Curated Tools**: Instant access to Node.js, Python, Git, VS Code, and more.
-   **Modern UI**: Beautiful spinners, colored outputs, and intuitive command structure.
-   **System Integrity**: Verify existing installations and discover missing dev tools with ease.
-   **Native Integration**: Powered by `winget` for reliable, standard Windows installations.

---

## 🛠️ Commands
| Command | Description |
| :--- | :--- |
| `dev-cli list` | Show all available tools in our curated set. |
| `dev-cli install <name>` | Securely install a developer tool (e.g., `nodejs`). |
| `dev-cli check` | Scan your system for currently installed tools. |
| `dev-cli --help` | Display common usage and help text. |

---

## 🏗️ Building from Source
### Prerequisites
-   **Rust Toolchain**: Install via [rustup.rs](https://rustup.rs).
-   **Visual Studio Build Tools**: Ensure the "C++ build tools" workload is installed for the MSVC linker.

### Steps
1.  Clone the repository:
    ```bash
    git clone https://github.com/drjoeycadieux/dev-cli.git
    cd dev-cli
    ```
2.  Build the project:
    ```bash
    cargo build --release
    ```
3.  The executable will be located in `target/release/dev-cli.exe`.

---

## 📂 Project Structure
-   `/src`: The Rust source code for the CLI.
-   `/website`: The premium landing page, docs, and assets.
-   `netlify.toml`: Deployment configuration for Netlify.
-   `Cargo.toml`: Rust dependency and project manifest.

---

## 🤝 Contributing
Contributions are what make the open-source community an amazing place!
1.  Fork the Project.
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4.  Push to the Branch (`git push origin feature/AmazingFeature`).
5.  Open a Pull Request.

---

## 📝 License
Distributed under the MIT License. See `LICENSE` for more information.

Built with ❤️ by [Joey Cadieux](https://github.com/drjoeycadieux)
