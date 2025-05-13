**# Feature Template**
**## Session Info**
Related PRs: N/A
Epic: #[epic-number]

**## Context**
GitHub Actions CI workflow for backend tests was failing due to deprecated actions and missing spatial database support.

**## Requirements**
- Fix deprecated GitHub Actions versions
- Update Python environment version
- Configure proper spatial database support for tests

**## Technical Notes**
We made the following changes to fix the backend CI testing:

1. Updated deprecated GitHub Actions versions:
   - Changed `actions/upload-artifact@v3` to `actions/upload-artifact@v4`
   - Updated `actions/checkout@v3` to `actions/checkout@v4`

2. Fixed an incorrect action reference:
   - Fixed first step where `actions/checkout@v4` was mistakenly replaced with `actions/upload-artifact@v4`

3. Updated Python version:
   - Changed from Python 3.9 to Python 3.12 to match local development environment

4. Configured PostGIS support for spatial database testing:
   - Replaced standard PostgreSQL image with `postgis/postgis:13-3.1` 
   - Added required spatial libraries: gdal-bin, libgdal-dev, python3-gdal, binutils, libproj-dev, and libgeos-dev
   - Installed Python GDAL package to match system version

**## Acceptance Criteria**
- Backend CI workflow completes successfully
- Test environment uses Python 3.12
- PostgreSQL includes PostGIS extensions
- Coverage reports are properly generated and uploaded

**## Dependencies**
- GitHub Actions
- PostGIS/PostgreSQL
- GDAL and spatial libraries

**## References**
- GitHub deprecated actions notification: https://github.blog/changelog/2024-04-16-deprecation-notice-v3-of-the-artifact-actions/
- PostGIS Docker images: https://registry.hub.docker.com/r/postgis/postgis/

**## Tags**
feature, ci, testing, github-actions, postgis