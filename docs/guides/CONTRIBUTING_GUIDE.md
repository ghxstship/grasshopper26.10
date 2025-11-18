# Contributing Guide

**Version:** 1.0.0  
**Last Updated:** November 16, 2025

---

## Getting Started

### Prerequisites

- Node.js 20+
- Git
- GitHub account
- Code editor (VS Code recommended)

### Setup

```bash
# Fork and clone
git clone https://github.com/YOUR_USERNAME/gvteway-atlvs.git
cd gvteway-atlvs

# Install dependencies
npm install

# Create feature branch
git checkout -b feature/your-feature-name
```

---

## Development Workflow

### 1. Create Issue

- Check existing issues first
- Create new issue with clear description
- Get issue assigned to you

### 2. Create Branch

```bash
git checkout develop
git pull origin develop
git checkout -b feature/issue-123-description
```

### 3. Make Changes

- Write code following style guide
- Add tests for new features
- Update documentation

### 4. Commit Changes

```bash
git add .
git commit -m "feat: add new feature"
```

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatting
- `refactor`: Code restructuring
- `test`: Tests
- `chore`: Maintenance

### 5. Push and Create PR

```bash
git push origin feature/issue-123-description
```

Create Pull Request on GitHub with:
- Clear title and description
- Link to related issue
- Screenshots if UI changes
- Test results

### 6. Code Review

- Address reviewer feedback
- Make requested changes
- Push updates to same branch

### 7. Merge

- Squash and merge after approval
- Delete feature branch

---

## Code Standards

### TypeScript

- Use strict mode
- Define types for all functions
- No `any` types
- Use interfaces for objects

### React

- Functional components only
- Use hooks properly
- Follow Atomic Design
- Add prop types

### Testing

- Unit tests for services
- Component tests for UI
- E2E tests for critical flows
- Minimum 80% coverage

### Documentation

- JSDoc for public APIs
- README for new features
- Update relevant guides

---

## Pull Request Guidelines

### PR Title

```
<type>(<scope>): <description>

Examples:
feat(gvteway): add event search
fix(compvss): resolve QR scanning issue
docs(api): update API documentation
```

### PR Description Template

```markdown
## Description
Brief description of changes

## Related Issue
Closes #123

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows style guide
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests added/updated
- [ ] No new warnings
```

---

## Review Process

### For Authors

1. Self-review your changes
2. Ensure all tests pass
3. Update documentation
4. Request 2+ reviewers
5. Address feedback promptly

### For Reviewers

1. Check code quality
2. Verify tests
3. Test functionality
4. Provide constructive feedback
5. Approve when ready

---

## Reporting Bugs

### Bug Report Template

```markdown
## Description
Clear description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Screenshots
(if applicable)

## Environment
- OS: [e.g. macOS 14]
- Browser: [e.g. Chrome 120]
- Version: [e.g. 1.0.0]

## Additional Context
Any other relevant information
```

---

## Feature Requests

### Feature Request Template

```markdown
## Problem
What problem does this solve?

## Proposed Solution
How should it work?

## Alternatives Considered
Other approaches considered

## Additional Context
Any other relevant information
```

---

## Questions?

- Check [Documentation](../README.md)
- Ask in [Discussions](https://github.com/org/repo/discussions)
- Contact maintainers

---

Thank you for contributing! 🎉
