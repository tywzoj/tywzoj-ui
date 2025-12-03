# Getting Started

This guide will help you set up your development environment for the project. Follow the steps below to install the necessary tools and dependencies.

## Prerequisites

Follow the [Development Environment Setup](setup.md) guide to install Git and Node.js.
Make sure you have Git and Node.js installed on your machine before proceeding.

## Clone the Repository

If you are already cloned the repository in the setup step, you can directly navigate to the project directory.

```sh
cd tywzoj-ui
```

If you haven't cloned the repository yet, run:

```sh
git clone git@github.com:tywzoj/tywzoj-ui.git
cd tywzoj-ui
```

**Note:** You need to have SSH access to clone the repository using the above command. Please follow the [GitHub SSH setup guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh) if you haven't set up SSH keys yet.

## Build the Project

Please ensure you have finished the [Development Environment Setup](setup.md) steps before building the project.

Go to the project directory and run:

```sh
yarn i18n # Generate i18n files
yarn build # Build the project
```

The built files will be located in the `dist` directory.

## Debugging

Copy the `.env.development` file to `.env.development.local` and modify it as needed for your local development environment:

```sh
cp .env.development .env.development.local
```

To start a development server with hot-reloading, run:

```sh
yarn start
```

This will start the vite development server on <http://localhost:5055>. Any changes you make to the source code will automatically reload the application.

Please install the following Chrome extensions for better debugging experience:

- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/lmhkpmbekcpmknklioeibfkpmmfibljd)

## Contributing

### Checkout a New Branch

Before making any changes, create a new branch from the `main` branch:

```sh
git checkout main
git pull
git checkout -b users/your-username/feature-description
```

### Make Changes

Make the necessary changes to the codebase using VSCode.

```sh
code .
```

Please install the recommended extensions when prompted by VSCode for a better development experience.

### Commit Changes

After making changes, stage and commit them with a descriptive message:

```sh
git add .
git commit -m "Add feature description"
```

Or you can use VSCode's built-in Git interface to stage and commit changes.

### Push Changes

Push your branch to the remote repository:

```sh
git push -u origin users/your-username/feature-description
```

Or use VSCode's Git interface to push changes.

### Create a Pull Request

Go to the repository on GitHub and create a pull request from your branch to the `main` branch.

### Code Review

Your pull request will be reviewed by the maintainers. Address any feedback and make necessary changes.

You just need to make changes in your branch and push them; the pull request will be updated automatically. Do NOT close and reopen the pull request.

### Merge Pull Request

Once your pull request is approved and passes all checks, it can be merged into the `main` branch.

If any CI checks fail, you PR merge will be blocked. Please fix the issues and push the changes to your branch. You should try to lint and build the project locally before pushing changes to avoid CI failures.

You branch will be squashed when merged, so after your PR is merged, you can safely delete your branch. And do NOT reuse the same branch name for future work.
