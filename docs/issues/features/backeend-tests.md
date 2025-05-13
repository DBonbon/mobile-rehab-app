# Feature Template

## Session Info
Related PRs: N/A
Epic: #[epic-number]

## Context
to set test env to test.py run test with :

docker-compose exec python pytest main/tests/ --ds=teki.settings.test


## Requirements
[Specific requirements]

## Technical Notes
[Technical details/considerations]

## Acceptance Criteria
[List of acceptance criteria]

## Dependencies
[Dependencies]

## References
[References]

## Tags
feature, [other-tags]



Recap of Our Conversation:

Initial Challenge:
- You were experiencing issues with Django/Wagtail test settings in a Docker environment
- The default settings were using `local.py` instead of `test.py` during test runs

Key Discoveries:
1. Settings Resolution Problem:
   - Default Django settings were defaulting to `local.py`
   - Standard Django/Pytest mechanisms weren't automatically switching settings

Breakthrough Solution:
- Discovered that using `--ds=teki.settings.test` flag with pytest explicitly sets the correct settings module
- Command: `docker-compose exec python pytest main/tests/ --ds=teki.settings.test`

Significant Achievements:
- Successfully ran all 29 tests
- Identified the precise method to switch between development and test settings
- Avoided complex configuration changes
- Maintained existing project structure

Primary Lesson:
Sometimes the solution is simpler than anticipated. Instead of creating complex workarounds, a direct flag can resolve settings-related challenges in Django/Pytest testing.

Would you like me to proceed with an analysis of the test coverage logs?


test coverage:

