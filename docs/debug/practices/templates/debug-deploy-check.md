# Debug Session Template

## Session Info
Related PRs: N/A

## Context
[Your debug context here]

## Investigation Steps
1. Initial State
   - What we know: [Details]
   - Initial hypothesis: [Details]
to check if a venv is active run this:

   env | grep VIRTUAL_ENV

this will print something like:

(venv) deploy@localhost:~$ env | grep VIRTUAL_ENV
VIRTUAL_ENV=/mnt/persist/www/savima-stage/shared/venv
VIRTUAL_ENV_PROMPT=(venv)


Test venv with python:
ex:
   /mnt/persist/www/savima-stage/shared/venv/bin/pip list

   /mnt/persist/www/savima-stage/shared/venv/bin/python /path/to/your/script.py

   /mnt/persist/www/savima-stage/shared/venv/bin/python -c "print('Hello World')"

2. Steps Taken
   - What was tried: [Details]
   - Results observed: [Details]
   - Conclusions drawn: [Details]

## References
[Your references here]

## Dependencies
[Your dependencies here]

## Tags
[your-tags-here]