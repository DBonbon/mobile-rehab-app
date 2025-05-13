import os
import shutil
import argparse
from datetime import datetime
from pathlib import Path


class DocsSetup:
    def __init__(self, base_path="docs", parent_dir=None):
        # Get the current working directory
        cwd = Path.cwd()

        # If we're already in a 'docs' directory, don't add another one
        if cwd.name == 'docs':
            # If parent_dir specified, use it, otherwise use current directory
            self.base_path = Path(parent_dir or '.') / base_path
        else:
            # Original behavior
            if parent_dir:
                self.base_path = Path(parent_dir) / base_path
            else:
                self.base_path = Path(base_path)

        self.current_date = datetime.now()
        self.current_month = self.current_date.strftime("%Y-%m")

    # [Rest of the class methods remain the same]
    def check_existing_structure(self):
        """Check if directory exists and is not empty."""
        if self.base_path.exists():
            if any(self.base_path.iterdir()):
                return True
        return False

    def create_directory_structure(self):
        """Create the basic directory structure for documentation."""
        directories = [
            "debugging/journals",
            f"debugging/journals/{self.current_month}",
            "debugging/journals/templates",
            "debugging/known-issues",
            "todos/active",
            "todos/completed",
            "todos/backlog",
            "practices/templates"
        ]

        for dir_path in directories:
            full_path = self.base_path / dir_path
            if not full_path.exists():
                full_path.mkdir(parents=True)
                print(f"Created directory: {full_path}")
            else:
                print(f"Directory already exists: {full_path}")

    def create_template_files(self, overwrite=False):
        """Create template files with initial content."""
        templates = {
            "debugging/journals/templates/debug_session.md": """# Debug Session Template
## Session Info
Date: YYYY-MM-DD
Issue ID:
Related PRs:

## Context
[Brief description of the issue]

## Investigation Steps
1. Initial State
   - What we know
   - Initial hypothesis

2. Steps Taken
   - What was tried
   - Results observed
   - Conclusions drawn

3. Resolution
   - Final solution
   - Why it worked
   - Future considerations

## References
- Related debug sessions
- Useful resources
- Team discussions
""",
            "todos/active/todo_template.md": """# TODO Item Template
## Overview
Title: [Brief descriptive title]
Priority: [High/Medium/Low]
Status: [New/In Progress/Blocked/Complete]
Created: [Date]
Last Updated: [Date]

## Description
[Detailed description of what needs to be done]

## Requirements
- [ ] Requirement 1
- [ ] Requirement 2

## Dependencies
- Other tasks that must be completed first
- Required resources

## Notes
- Progress updates
- Challenges encountered
- Decisions made

## Related
- Links to related issues
- Reference documents
- Related debug sessions
""",
            "practices/debugging.md": """# Debugging Practices

## General Guidelines
1. Always start with a clear problem description
2. Document steps taken and results
3. Keep track of environment details
4. Save useful commands and configurations

## Tools and Resources
- List of common debugging tools
- Useful commands
- Environment setup guides

## Templates
- See templates directory for standard formats
- Use consistent naming conventions
- Update templates based on team feedback
""",
            "README.md": f"""# Project Documentation

Created: {self.current_date.strftime("%Y-%m-%d")}

## Structure
- debugging/: Debug sessions and known issues
- todos/: Task tracking and management
- practices/: Development standards and practices

## Usage
1. Use templates for new documents
2. Follow naming conventions
3. Keep documentation updated
4. Link related documents

## Templates
Find standard templates in respective directories:
- Debug session template: debugging/journals/templates/
- TODO template: todos/active/
"""
        }

        for file_path, content in templates.items():
            full_path = self.base_path / file_path
            if not full_path.exists() or overwrite:
                full_path.parent.mkdir(parents=True, exist_ok=True)
                full_path.write_text(content)
                print(f"Created file: {full_path}")
            else:
                print(f"File already exists (skipping): {full_path}")

    def setup(self, force=False):
        """Run the complete setup process."""
        print(f"\nPreparing documentation structure at: {self.base_path.absolute()}")

        if self.check_existing_structure() and not force:
            print("\nWARNING: Target directory already exists and contains files!")
            response = input("Do you want to proceed? Existing files won't be overwritten [y/N]: ")
            if response.lower() != 'y':
                print("Setup aborted.")
                return

        print("\nCreating directory structure...")
        self.create_directory_structure()
        self.create_template_files(overwrite=force)

        print("\nSetup completed!")
        print("\nNext steps:")
        print("1. Review the created/existing templates")
        print("2. Customize templates as needed")
        print("3. Start using the structure for your documentation")


def main():
    parser = argparse.ArgumentParser(description='Setup documentation structure')
    parser.add_argument('--path', default='docs',
                        help='Base path for docs directory (default: docs)')
    parser.add_argument('--parent',
                        help='Parent directory (optional)')
    parser.add_argument('--force', action='store_true',
                        help='Force creation and overwrite existing files')

    args = parser.parse_args()

    setup = DocsSetup(args.path, args.parent)
    setup.setup(force=args.force)


if __name__ == "__main__":
    main()
