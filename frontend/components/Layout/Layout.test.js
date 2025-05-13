import { render } from '@testing-library/react';
import Layout from './';
import { PageContextProvider } from '../../api/PageContext';
import { mockLanguageData } from '../../utils/testUtils';
import nextRouterMock from 'next-router-mock'; // Use global mock

describe('<Layout />', () => {
  beforeEach(() => {
    nextRouterMock.push('/');
  });

  it('Renders with minimal setup', () => {
    render(
      <PageContextProvider value={mockLanguageData}>
        <Layout primaryPages={[]} locales={mockLanguageData.available_locales} />
      </PageContextProvider>
    );
  });
});
