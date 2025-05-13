# Common Commands Reference

## Git Commands

### Daily Operations
```bash
# Branch Operations
git checkout -b feature/new-feature    # Create and switch to new branch
git checkout develop                   # Switch to develop branch
git branch -d feature/old-feature      # Delete local branch
git branch -D feature/force-delete     # Force delete local branch

# Pushing Changes
git push origin develop               # Push to develop branch
git push origin feature/new-feature   # Push new feature branch
git push -u origin feature/new-feature # Push and set upstream

# Pulling Changes
git pull origin develop              # Pull from develop
git pull --rebase origin develop     # Pull with rebase

# Stashing
git stash                           # Stash changes
git stash pop                       # Apply and remove last stash
git stash list                      # List all stashes
git stash apply stash@{0}          # Apply specific stash

# Viewing Status/History
git status                         # Check repository status
git log --oneline                  # Compact history view
git log --graph --oneline         # Visual branch history
```

### Git Flow Operations
```bash
# Initialize
git flow init                      # Set up git flow

# Feature Development
git flow feature start new-feature    # Start new feature
git flow feature finish new-feature   # Finish feature

# Release Management
git flow release start 1.0.0          # Start release
git flow release finish 1.0.0         # Finish release

# Hotfix
git flow hotfix start hotfix_branch   # Start hotfix
git flow hotfix finish hotfix_branch  # Finish hotfix
```

### Recovery Operations
```bash
# Undo Last Commit (keep changes)
git reset --soft HEAD~1

# Discard Local Changes
git checkout -- filename              # Discard changes in file
git reset --hard HEAD                 # Discard all local changes

# Fix Wrong Branch
git stash                            # Stash changes
git checkout correct-branch          # Switch to right branch
git stash pop                        # Apply changes

# Remove from Staging
git restore --staged filename        # Unstage file
```

### Configuration
```bash
# Set User Info
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Set Default Branch
git config --global init.defaultBranch main

# Aliases Setup
git config --global alias.co checkout
git config --global alias.br branch
git config --global alias.st status
```

### Project-Specific Workflows
```bash
# Standard Feature Development
1. git checkout develop
2. git pull origin develop
3. git checkout -b feature/name
4. [Make changes]
5. git add .
6. git commit -m "Description"
7. git push origin feature/name

# Quick Fix on Develop
1. git checkout develop
2. git pull origin develop
3. [Make changes]
4. git add .
5. git commit -m "Fix description"
6. git push origin develop

# Release Process
1. git flow release start 1.0.0
2. [Make release adjustments]
3. git flow release finish 1.0.0
4. git push origin develop
5. git push origin main
6. git push --tags
```

### Good Practice Notes
1. Always pull before starting new work
2. Use descriptive commit messages
3. Keep features small and focused
4. Regularly push to backup your work
5. Use branches for all new features
6. Never force push to shared branches

### Troubleshooting
If you encounter issues:
1. `git status` to check current state
2. `git log` to review history
3. `git remote -v` to verify remotes
4. `git branch -a` to see all branches

## Updating This Guide
- Add new commands as you use them
- Include project-specific workflows
- Document common issues and solutions
- Keep examples relevant to current practices