use anyhow::Result;
use clap::{Parser, Subcommand};
use colored::*;
use indicatif::{ProgressBar, ProgressStyle};
use std::process::{Command, Stdio};
use which::which;

#[derive(Parser)]
#[command(name = "dev-cli")]
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
}

const TOOLS: &[Tool] = &[
    Tool {
        name: "nodejs",
        id: "OpenJS.NodeJS",
        description: "Node.js JavaScript runtime",
        binary: "node",
    },
    Tool {
        name: "python",
        id: "Python.Python.3",
        description: "Python programming language",
        binary: "python",
    },
    Tool {
        name: "git",
        id: "Git.Git",
        description: "Git version control system",
        binary: "git",
    },
    Tool {
        name: "vscode",
        id: "Microsoft.VisualStudioCode",
        description: "Visual Studio Code editor",
        binary: "code",
    },
    Tool {
        name: "go",
        id: "Google.Go",
        description: "Go programming language",
        binary: "go",
    },
    Tool {
        name: "docker",
        id: "Docker.DockerDesktop",
        description: "Docker Desktop",
        binary: "docker",
    },
];

#[tokio::main]
async fn main() -> Result<()> {
    let cli = Cli::parse();

    match cli.command {
        Commands::List => {
            println!("\n{}", "Available Developer Tools:".bold().cyan());
            println!("{:-<50}", "");
            for tool in TOOLS {
                println!(
                    "{:<10} | {:<25} | {}",
                    tool.name.green().bold(),
                    tool.id.dimmed(),
                    tool.description
                );
            }
            println!("{:-<50}\n", "");
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
