// test-utils/test-wrapper.js
import { render } from '@testing-library/react';
import { PageContextProvider } from '../api/PageContext';
import { defaultMockData } from '../__mocks__/globalMockData';

// Mock router setup for Next.js
const mockRouter = {
    route: '/',
    pathname: '/',
    query: {},
    asPath: '/',
    push: jest.fn(),
    replace: jest.fn(),
    reload: jest.fn(),
    back: jest.fn(),
    prefetch: jest.fn(),
    events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn()
    },
    locale: 'en',
    locales: ['en', 'fr'],
    defaultLocale: 'en'
};

// Mock Next.js useRouter
jest.mock('next/router', () => ({
    useRouter: () => mockRouter
}));

// Global fetch mock
if (typeof global.fetch === 'undefined') {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            json: () => Promise.resolve({})
        })
    );
}

// Unified render function
export function renderWithContext(ui, {
    pageContextProps = {},
    ...renderOptions
} = {}) {
    const pageContext = { ...defaultMockData, ...pageContextProps };
    function Wrapper({ children }) {
        return (
            <PageContextProvider value={pageContext}>
                {children}
            </PageContextProvider>
        );
    }
    return render(ui, { wrapper: Wrapper, ...renderOptions });
}