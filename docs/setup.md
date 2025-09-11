# Development Environment Setup

This guide helps you set up a development environment with Git and Node.js on macOS, Windows, or Linux (Ubuntu/Debian).

## Install Git

Install Git before anything else so you can clone repositories.

### macOS

On macOS, the recommended and supported method to install Git for development is the Apple Command Line Tools. Install them with:

```sh
xcode-select --install
```

After installation, verify Git is available:

```sh
git --version
```

### Windows

Install Git for Windows (Git Bash + GUI). Download the installer from the official site and run it.

Visit the Git download page: <https://git-scm.com>

### Ubuntu & Debian

Use the distribution package manager:

```bash
sudo apt update && sudo apt install git
```

## Clone the repository

```bash
git clone git@github.com:tywzoj/tywzoj-ui.git
cd tywzoj-ui
```

## Install NVM

This section shows a common approach to install and manage Node.js versions. Use nvm (or nvm-windows on Windows) so you can install and switch Node versions per project.

### Why use a version manager?

- Keeps multiple Node versions side-by-side
- Lets each project specify its required Node (via `.nvmrc` or documentation)

### macOS (Homebrew + nvm)

We recommend installing nvm via Homebrew on macOS. If you haven't installed Homebrew yet, follow the instructions at <https://brew.sh>.

1. Install nvm via [Homebrew](https://brew.sh):

    ```sh
    brew install nvm
    mkdir -p "$HOME/.nvm"
    ```

2. Add initialization to your shell config (`~/.zprofile`):

    ```sh
    export NVM_HOMEBREW=$(brew --prefix nvm)
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_HOMEBREW/nvm.sh" ] && \. "$NVM_HOMEBREW/nvm.sh"  # This loads nvm
    [ -s "$NVM_HOMEBREW/etc/bash_completion.d/nvm" ] && \. "$NVM_HOMEBREW/etc/bash_completion.d/nvm"  # This loads nvm bash_completion
    ```

    Then reload your shell:

    ```sh
    source ~/.zprofile
    ```

### Windows (nvm-windows)

Install nvm-windows (installer available on the releases page).

Visit the releases: <https://github.com/coreybutler/nvm-windows/releases>

### Ubuntu & Debian (nvm upstream)

Install the official nvm script and reload your shell:

```bash
curl -fsSL https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
source ~/.bashrc   # or source ~/.zshrc
```

## Install Node.js

In the project folder (a folder that has a `.nvmrc`), install the recorded version:

```sh
cd tywzoj-ui # you have already cloned the repo on the previous step
nvm install
nvm use
corepack enable
```

## Install Project Dependencies

Use yarn to install the project dependencies:

```sh
yarn
```
