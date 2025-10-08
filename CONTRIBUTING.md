# Contributing to IE Alumni Connect

Thank you for your interest in contributing! 🎉

## Development Setup

1. **Fork and clone** the repository
2. **Install dependencies**: `pnpm install`
3. **Copy environment variables**: `cp .env.example .env.local`
4. **Set up MongoDB Atlas** and add your connection string
5. **Run development server**: `pnpm dev`

## Pull Request Process

1. Create a feature branch: `git checkout -b feature/your-feature-name`
2. Make your changes and commit: `git commit -m "feat: add new feature"`
3. Write or update tests as needed
4. Ensure tests pass: `pnpm test`
5. Ensure linting passes: `pnpm lint`
6. Push and create a pull request

## Commit Convention

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Code Style

- Use TypeScript for all new code
- Follow the existing code style
- Write meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

## Questions?

Feel free to open an issue for any questions or concerns!