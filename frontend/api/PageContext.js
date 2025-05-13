// contexts/PageContext.js
import { createContext, useContext } from 'react';

export const PageContext = createContext({
    available_locales: [],
    current_locale: null,
    translations: []
});

export function PageContextProvider({ children, value }) {
    return (
        <PageContext.Provider value={value}>
            {children}
        </PageContext.Provider>
    );
}

export function usePageContext() {
    const context = useContext(PageContext);
    if (!context) {
        throw new Error('usePageContext must be used within PageContextProvider');
    }
    return context;
};