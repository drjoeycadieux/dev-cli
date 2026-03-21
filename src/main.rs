use anyhow::Result;
use clap::{Parser, Subcommand};
use colored::*;
use indicatif::{ProgressBar, ProgressStyle};
use std::process::{Command, Stdio};
use which::which;

#[derive(Parser)]
#[command(name = "dev-cli")]
#[command(version)]
#[command(about = "A modern developer CLI for Windows", long_about = None)]
struct Cli {
    #[command(subcommand)]
    command: Commands,
}

#[derive(Subcommand)]
enum Commands {
    /// List available developer tools
    List,
    /// Install a developer tool
    Install {
        /// Name of the tool to install (e.g., nodejs, python, git)
        tool: String,
    },
    /// Check which tools are installed
    Check,
}

struct Tool {
    name: &'static str,
    id: &'static str,
    description: &'static str,
    binary: &'static str,
    category: &'static str,
}

const TOOLS: &[Tool] = &[
    // Languages
    Tool {
        name: "nodejs",
        id: "OpenJS.NodeJS",
        description: "Node.js JavaScript runtime",
        binary: "node",
        category: "Languages",
    },
    Tool {
        name: "python",
        id: "Python.Python.3",
        description: "Python programming language",
        binary: "python",
        category: "Languages",
    },
    Tool {
        name: "go",
        id: "Google.Go",
        description: "Go programming language",
        binary: "go",
        category: "Languages",
    },
    Tool {
        name: "rust",
        id: "Rustlang.Rust.MSVC",
        description: "Rust programming language",
        binary: "rustc",
        category: "Languages",
    },
    Tool {
        name: "java",
        id: "Oracle.JDK.21",
        description: "Java Development Kit",
        binary: "java",
        category: "Languages",
    },
    Tool {
        name: "php",
        id: "PHP.PHP",
        description: "PHP scripting language",
        binary: "php",
        category: "Languages",
    },
    
    // Version Control
    Tool {
        name: "git",
        id: "Git.Git",
        description: "Git version control system",
        binary: "git",
        category: "Version Control",
    },
    Tool {
        name: "github-cli",
        id: "GitHub.cli",
        description: "GitHub command line interface",
        binary: "gh",
        category: "Version Control",
    },
    
    // Editors & IDEs
    Tool {
        name: "vscode",
        id: "Microsoft.VisualStudioCode",
        description: "Visual Studio Code editor",
        binary: "code",
        category: "Editors",
    },
    Tool {
        name: "vim",
        id: "vim.vim",
        description: "Vim text editor",
        binary: "vim",
        category: "Editors",
    },
    Tool {
        name: "notepad++",
        id: "Notepad++.Notepad++",
        description: "Notepad++ text editor",
        binary: "notepad++",
        category: "Editors",
    },
    
    // Build & Package Managers
    Tool {
        name: "cmake",
        id: "Kitware.CMake",
        description: "CMake build system",
        binary: "cmake",
        category: "Build Tools",
    },
    Tool {
        name: "gradle",
        id: "Gradle.Gradle",
        description: "Gradle build automation",
        binary: "gradle",
        category: "Build Tools",
    },
    Tool {
        name: "maven",
        id: "Apache.Maven",
        description: "Apache Maven build tool",
        binary: "mvn",
        category: "Build Tools",
    },
    
    // Container & Virtualization
    Tool {
        name: "docker",
        id: "Docker.DockerDesktop",
        description: "Docker Desktop containers",
        binary: "docker",
        category: "Containers",
    },
    Tool {
        name: "kubectl",
        id: "Kubernetes.kubectl",
        description: "Kubernetes command line tool",
        binary: "kubectl",
        category: "Containers",
    },
    
    // Databases
    Tool {
        name: "postgresql",
        id: "PostgreSQL.PostgreSQL",
        description: "PostgreSQL database system",
        binary: "psql",
        category: "Databases",
    },
    Tool {
        name: "mysql",
        id: "MySQL.MySQL.8.0",
        description: "MySQL database system",
        binary: "mysql",
        category: "Databases",
    },
    Tool {
        name: "mongodb",
        id: "MongoDB.Server",
        description: "MongoDB NoSQL database",
        binary: "mongod",
        category: "Databases",
    },
    
    // Cloud & DevOps
    Tool {
        name: "aws-cli",
        id: "Amazon.AWSCLI",
        description: "AWS command line interface",
        binary: "aws",
        category: "Cloud",
    },
    Tool {
        name: "azure-cli",
        id: "Microsoft.AzureCLI",
        description: "Azure command line interface",
        binary: "az",
        category: "Cloud",
    },
    Tool {
        name: "terraform",
        id: "HashiCorp.Terraform",
        description: "Terraform infrastructure automation",
        binary: "terraform",
        category: "Cloud",
    },
];

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Commands::List => {
            println!("\n{}", "📦 Available Developer Tools:".bold().cyan());
            println!("{:-<70}", "");
            
            let mut current_category = "";
            for tool in TOOLS {
                if tool.category != current_category {
                    current_category = tool.category;
                    println!("\n{}", format!("  {} {}", "📁", current_category).bold().yellow());
                    println!("  {:-<66}", "");
                }
                println!(
                    "  {:<15} {} {}",
                    tool.name.green(),
                    "→".cyan(),
                    tool.description.dimmed()
                );
            }
            println!("{:-<70}\n", "");
            println!("{} Total tools available: {}\n", "✨".yellow(), TOOLS.len());
        }
        Commands::Install { tool } => {
            let tool_info = TOOLS.iter().find(|t| t.name == tool || t.id == tool);
            
            match tool_info {
                Some(t) => {
                    install_tool(t).await?;
                }
                None => {
                    println!("{} Tool '{}' not found in curated list. Trying winget anyway...", "ℹ".yellow(), tool);
                    install_generic(&tool).await?;
                }
            }
        }
        Commands::Check => {
            println!("\n{}", "System Tool Check:".bold().cyan());
            println!("{:-<40}", "");
            for tool in TOOLS {
                let status = if which(tool.binary).is_ok() {
                    "Installed".green().bold()
                } else {
                    "Not Found".red()
                };
                println!("{:<10} : {}", tool.name.bold(), status);
            }
            println!("{:-<40}\n", "");
        }
    }

    Ok(())
}

async fn install_tool(tool: &Tool) -> Result<()> {
    println!("{} Preparing to install {}...", "🚀".cyan(), tool.name.green().bold());

    let pb = ProgressBar::new_spinner();
    pb.set_style(
        ProgressStyle::default_spinner()
            .tick_chars("⠁⠂⠄⡀⢀⠠⠐⠈")
            .template("{spinner:.green} {msg}")?,
    );
    pb.set_message(format!("Installing {} via winget...", tool.name));
    pb.enable_steady_tick(std::time::Duration::from_millis(100));

    let status = Command::new("winget")
        .arg("install")
        .arg("--id")
        .arg(tool.id)
        .arg("--silent")
        .arg("--accept-source-agreements")
        .arg("--accept-package-agreements")
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .status()?;

    pb.finish_and_clear();

    if status.success() {
        println!("{} Successfully installed {}!", "✔".green(), tool.name.bold());
    } else {
        println!("{} Failed to install {}. (Exit code: {:?})", "✘".red(), tool.name.bold(), status.code());
    }

    Ok(())
}

async fn install_generic(tool_id: &str) -> Result<()> {
    let pb = ProgressBar::new_spinner();
    pb.set_message(format!("Installing {} via winget...", tool_id));
    pb.enable_steady_tick(std::time::Duration::from_millis(100));

    let status = Command::new("winget")
        .arg("install")
        .arg("--id")
        .arg(tool_id)
        .arg("--silent")
        .arg("--accept-source-agreements")
        .arg("--accept-package-agreements")
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .status()?;

    pb.finish_and_clear();

    if status.success() {
        println!("{} Successfully installed {}!", "✔".green(), tool_id.bold());
    } else {
        println!("{} Failed to install {}.", "✘".red(), tool_id.bold());
    }

    Ok(())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_tools_exist() {
        assert!(!TOOLS.is_empty(), "Tools list should not be empty");
    }

    #[test]
    fn test_tools_count() {
        assert!(TOOLS.len() >= 20, "Should have at least 20 tools");
    }

    #[test]
    fn test_nodejs_tool_exists() {
        let nodejs = TOOLS.iter().find(|t| t.name == "nodejs");
        assert!(nodejs.is_some(), "nodejs tool should be in the list");
        
        if let Some(tool) = nodejs {
            assert_eq!(tool.binary, "node");
            assert_eq!(tool.id, "OpenJS.NodeJS");
            assert_eq!(tool.category, "Languages");
        }
    }

    #[test]
    fn test_python_tool_exists() {
        let python = TOOLS.iter().find(|t| t.name == "python");
        assert!(python.is_some(), "python tool should be in the list");
        
        if let Some(tool) = python {
            assert_eq!(tool.binary, "python");
            assert_eq!(tool.id, "Python.Python.3");
            assert_eq!(tool.category, "Languages");
        }
    }

    #[test]
    fn test_git_tool_exists() {
        let git = TOOLS.iter().find(|t| t.name == "git");
        assert!(git.is_some(), "git tool should be in the list");
        
        if let Some(tool) = git {
            assert_eq!(tool.binary, "git");
            assert_eq!(tool.category, "Version Control");
        }
    }

    #[test]
    fn test_docker_tool_exists() {
        let docker = TOOLS.iter().find(|t| t.name == "docker");
        assert!(docker.is_some(), "docker tool should be in the list");
        
        if let Some(tool) = docker {
            assert_eq!(tool.category, "Containers");
        }
    }

    #[test]
    fn test_all_tools_have_valid_properties() {
        for tool in TOOLS {
            assert!(!tool.name.is_empty(), "Tool name should not be empty");
            assert!(!tool.id.is_empty(), "Tool id should not be empty");
            assert!(!tool.binary.is_empty(), "Tool binary should not be empty");
            assert!(!tool.description.is_empty(), "Tool description should not be empty");
            assert!(!tool.category.is_empty(), "Tool category should not be empty");
        }
    }

    #[test]
    fn test_all_tools_have_categories() {
        let valid_categories = vec![
            "Languages",
            "Version Control",
            "Editors",
            "Build Tools",
            "Containers",
            "Databases",
            "Cloud",
        ];
        
        for tool in TOOLS {
            assert!(
                valid_categories.contains(&tool.category),
                "Tool {} has invalid category: {}",
                tool.name,
                tool.category
            );
        }
    }

    #[test]
    fn test_no_duplicate_tool_names() {
        let mut names: Vec<&str> = TOOLS.iter().map(|t| t.name).collect();
        let original_len = names.len();
        names.sort();
        names.dedup();
        assert_eq!(names.len(), original_len, "Found duplicate tool names");
    }
}
