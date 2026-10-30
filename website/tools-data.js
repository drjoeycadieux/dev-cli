/*
 * Dev-CLI tool catalog.
 * Kept in sync with the TOOLS array in src/main.rs.
 * Used by tools.html (search/filter) and the interactive demo on index.html.
 */
window.DEV_CLI_TOOLS = [
    // Languages
    { name: "nodejs", id: "OpenJS.NodeJS", description: "Node.js JavaScript runtime", binary: "node", category: "Languages" },
    { name: "python", id: "Python.Python.3", description: "Python programming language", binary: "python", category: "Languages" },
    { name: "go", id: "Google.Go", description: "Go programming language", binary: "go", category: "Languages" },
    { name: "rust", id: "Rustlang.Rust.MSVC", description: "Rust programming language", binary: "rustc", category: "Languages" },
    { name: "java", id: "Oracle.JDK.21", description: "Java Development Kit", binary: "java", category: "Languages" },
    { name: "php", id: "PHP.PHP", description: "PHP scripting language", binary: "php", category: "Languages" },

    // Version Control
    { name: "git", id: "Git.Git", description: "Git version control system", binary: "git", category: "Version Control" },
    { name: "github-cli", id: "GitHub.cli", description: "GitHub command line interface", binary: "gh", category: "Version Control" },

    // Editors & IDEs
    { name: "vscode", id: "Microsoft.VisualStudioCode", description: "Visual Studio Code editor", binary: "code", category: "Editors" },
    { name: "vim", id: "vim.vim", description: "Vim text editor", binary: "vim", category: "Editors" },
    { name: "notepad++", id: "Notepad++.Notepad++", description: "Notepad++ text editor", binary: "notepad++", category: "Editors" },

    // Build & Package Managers
    { name: "cmake", id: "Kitware.CMake", description: "CMake build system", binary: "cmake", category: "Build Tools" },
    { name: "gradle", id: "Gradle.Gradle", description: "Gradle build automation", binary: "gradle", category: "Build Tools" },
    { name: "maven", id: "Apache.Maven", description: "Apache Maven build tool", binary: "mvn", category: "Build Tools" },

    // Container & Virtualization
    { name: "docker", id: "Docker.DockerDesktop", description: "Docker Desktop containers", binary: "docker", category: "Containers" },
    { name: "kubectl", id: "Kubernetes.kubectl", description: "Kubernetes command line tool", binary: "kubectl", category: "Containers" },

    // Databases
    { name: "postgresql", id: "PostgreSQL.PostgreSQL", description: "PostgreSQL database system", binary: "psql", category: "Databases" },
    { name: "mysql", id: "MySQL.MySQL.8.0", description: "MySQL database system", binary: "mysql", category: "Databases" },
    { name: "mongodb", id: "MongoDB.Server", description: "MongoDB NoSQL database", binary: "mongod", category: "Databases" },

    // Cloud & DevOps
    { name: "aws-cli", id: "Amazon.AWSCLI", description: "AWS command line interface", binary: "aws", category: "Cloud" },
    { name: "azure-cli", id: "Microsoft.AzureCLI", description: "Azure command line interface", binary: "az", category: "Cloud" },
    { name: "terraform", id: "HashiCorp.Terraform", description: "Terraform infrastructure automation", binary: "terraform", category: "Cloud" }
];
