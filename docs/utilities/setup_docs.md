# setup_docs.py


This script will create the complete documentation structure we discussed. Here's how to use it:

1. Save it as `setup_docs.py`

2. Run it from the command line:
```bash
python setup_docs.py
```

The script:
- Creates all necessary directories
- Generates template files with starter content
- Uses current date for organization
- Provides feedback on what it's creating
- Is reusable across projects

Key features:
- Customizable base path (defaults to "docs")
- Creates dated folders for debugging journals
- Generates all template files with proper markdown formatting
- Provides a clear structure for documentation

base_path="docs" creates a directory relative to wherever you run the script from
If you run it from /your/project/, it will create /your/project/docs/
If you run it from /home/user/, it will create /home/user/docs/

If you're in the root directory, ex; docs and want to run:

    python3 docs/utilities/setup_docs.py --path debug

If you're in  docs/utilities run:

to create the structure in docs/debug, you would use:

    python setup_docs.py --path debug --parent ..
