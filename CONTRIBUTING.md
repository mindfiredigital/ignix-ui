# Contributing to Ignix UI

We welcome and appreciate your contribution to Ignix UI. These guidelines will help ensure a smooth and collaborative process for everyone.

## How To Make Simlink Locally?

### Step 1: Install dependencies

```bash
pnpm i
```

### Step 2: Make build

```bash
pnpm build
```

### Step 3: Go to cli file

```bash
cd ./packages/cli
```

### Step 4: Link cli package

```bash
npm link
```

### Step 5: Go to your demo react app and install cli

```bash
npm link @animtion-ui/cli
```

### Step 6: Initialize Cli

```bash
npx animation-ui init
```

### Step 7: Add Components

```bash
npx animation-ui add <component-name>
```

## How Can You Contribute?

Here are some ways you can contribute to the project:

- Reporting bugs or issues
- Submitting feature requests
- Writing or improving documentation
- Fixing bugs
- Implementing new features

## Steps for Contributing

1. **Fork** the repository to your GitHub account.
2. **Clone** the forked repository to your local machine.
3. Create a new **branch** for your feature/fix: `git checkout -b feature/feature-name`.
4. **Make changes** and **test** to ensure they work as expected.
5. **Commit** your changes: `git commit -m 'Your descriptive commit message'`.
6. **Push** your branch to your GitHub repository: `git push origin feature-name`.
7. Create a **Pull Request (PR)** from your branch to the original repository's `main` or `master` branch.

## Pull Request Guidelines

- Make sure your PR addresses an issue or feature request.
- Describe your PR and provide context in the description.
- Keep your PR focused on a single change to make reviewing easier.
- Ensure your code follows the project's coding style and conventions.

## Code of Conduct and Licensing

Please ensure your contributions adhere to the project's [Code of Conduct](./CODE_OF_CONDUCT.md) and are licensed under the project's [License](./LICENSE).

## Need Help?

If you need further clarification or help, feel free to reach out by creating an issue or directly contacting the maintainers.

Thank you for your interest in contributing to TextIgniterJS! We appreciate your efforts in making this project better.

Happy contributing!
