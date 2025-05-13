**# Feature Implementation: Centralized Frontend Test Mocks**

**## Session Info**
Related PRs: N/A  
Epic: #[epic-number]  
Status: Completed

**## Context**
Implementation of frontend testing infrastructure as part of the CI/CD pipeline required streamlining the mock data approach. Tests were previously importing mock data directly from `__mocks__` directory, creating tight coupling and making tests harder to maintain. We've centralized all mock imports through `utils/testUtils.js` to create a single source of truth.

**## Requirements**
- Configure and optimize npm test:ci
- Resolve LanguageSwitcher component issues
- Set up comprehensive component testing
- Centralize mock data imports

**## Implementation Summary**
After exploring several approaches, we implemented a direct import strategy in `utils/testUtils.js` that:

1. Imports all mock data directly from their source files:
   ```javascript
   export { mockBaseImage, mockCarouselImages, mockImageText } from '../__mocks__/components/images/imageData';
   export { mockSidebarItems, mockEmptySidebarItems, mockNestedSidebarItems } from '../__mocks__/components/sidebar/sidebarData';
   export { defaultMockData } from '../__mocks__/globalMockData';
   export { mockSeoData } from '../__mocks__/seoMockData';
   export {
     mockLanguageData,
     mockLocales,
     mockCurrentLocale,
     mockCountryMapping,
     mockTranslations
   } from '../__mocks__/languageMockData';
   ```

2. Modified component tests to import from testUtils instead of directly from mock files:
   ```javascript
   // Before
   import { mockBaseImage } from '../../__mocks__/components/images/imageData';
   
   // After
   import { mockBaseImage } from '../../utils/testUtils';
   ```

3. Enhanced `getComponentProps()` function to automatically handle common prop types:
   ```javascript
   case 'image':
     mockProps.image = mockBaseImage;
     break;
   case 'images':
     mockProps.images = mockCarouselImages;
     break;
   case 'sidebarItems':
     mockProps.sidebarItems = mockSidebarItems;
     break;
   ```

**## Technical Notes**
We discovered that creating a centralized `__mocks__/index.js` file led to path resolution issues with Jest. The direct import approach in `testUtils.js` proved more reliable and maintainable.

Current workflow remains unchanged:
```yaml
name: CI Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v3
      - name: Frontend Tests
        working-directory: ./frontend
        run: npm run test:ci
```

**## Acceptance Criteria Results**
- ✅ All frontend tests pass in CI environment
- ✅ Components now use centralized mock imports
- ✅ Test maintenance simplified through centralized mock data
- ✅ GitHub Actions successfully runs test suite
- ✅ Failed tests block deployment as expected

**## Future Improvements**
1. Add more specialized mock handling to `getComponentProps()` for additional component types
2. Create test utilities to simplify snapshot testing
3. Consider implementing mock versioning for different test scenarios

**## Dependencies**
- Node.js
- Jest
- GitHub Actions
- Frontend test suite

**## Tags**
feature, ci-cd, frontend, testing, mocks, test-utils