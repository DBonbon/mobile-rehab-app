import i18next from 'i18next';
import en from './translations/en.json';
import fr from './translations/fr.json';

// Detect language from URL path
const getLanguageFromPath = () => {
    if (typeof window !== 'undefined') {
        const path = window.location.pathname;
        if (path.startsWith('/fr')) return 'fr';
        if (path.startsWith('/en')) return 'en';
    }
    return 'en'; // default language
};

i18next.init({
    lng: getLanguageFromPath(),
    fallbackLng: ['en'],
    resources: {
        en: { translation: en },
        fr: { translation: fr },
    },
});

export default i18next;