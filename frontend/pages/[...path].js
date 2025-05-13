// ./pages/[...path].js
import querystring from 'querystring';
import { getPage, getRedirect, getPrimaryPages, getSecondaryPages, getLocales, WagtailApiResponseError } from '../api/wagtail';
import { PageContextProvider } from '../api/PageContext';
import LazyContainers from '../containers/LazyContainers';
import Header from '../components/header';
import Layout from '../components/Layout';


const isProd = process.env.NODE_ENV === 'production';

export default function CatchAllPage({
    componentName,
    componentProps,
    primaryPages,
    locales
}) {
    const Component = LazyContainers[componentName];
   
    // Use the correct data structure
    const localeData = {
        available_locales: locales || [],
        current_locale: componentProps?.currentLocale || {
            language_code: "en",
            language_name: "English"
        },
        translations: componentProps?.translations || []
    };

    if (!Component) {
        return <h1>Component {componentName} not found</h1>;
    }

    return (
        <PageContextProvider value={localeData}>
            <Layout
                primaryPages={primaryPages}
                locales={locales}
            >
                {/* Pass a special prop to indicate this is rendered inside Layout */}
                <Component {...componentProps} inLayout={true} />
            </Layout>
        </PageContextProvider>
    );
}

// For SSR
export async function getServerSideProps({ req, params, res }) {
    //console.log('🚀 getServerSideProps running with path:', params?.path);
    let path = params?.path || [];
    // This needs to come BEFORE joining the path
    if (path[0] === 'password-reset') {
        if (path.length === 1) {
            // Simple password reset request page
            return { props: { componentName: 'PasswordResetPage', componentProps: {}, primaryPages: [], locales: [] } };
        } else if (path.length === 3 && path[1] && path[2]) {
            // Password reset confirmation page with uid and token
            return { 
                props: { 
                    componentName: 'PasswordResetConfirmPage', 
                    componentProps: { uid: path[1], token: path[2] },
                    primaryPages: [],
                    locales: []
                } 
            };
        }
    }

    if (path[0] === 'email-verification' && path.length === 2) {
        return { 
            props: { 
                componentName: 'EmailVerificationPage', 
                componentProps: { key: path[1] },
                primaryPages: [],
                locales: []
            } 
        };
    }

    if (path[0] === 'verification-sent') {
        return { 
            props: { 
                componentName: 'VerificationSentPage', 
                componentProps: {},
                primaryPages: [],
                locales: []
            } 
        };
    }
    path = path.join('/');

    const { host } = req.headers;
    let queryParams = new URL(req.url, `https://${host}`).search;
    if (queryParams.indexOf('?') === 0) {
        queryParams = queryParams.substr(1);
    }
    queryParams = querystring.parse(queryParams);

    // Initialize arrays for primary pages and locales
    let primaryPages = [];
    let locales = [];


    // Fetch primary pages first
    try {
        primaryPages = await getPrimaryPages();

        // Fetch secondary pages for each primary page
        for (const primaryPage of primaryPages) {
            if (primaryPage.url) {
                try {
                    const secondaryPages = await getSecondaryPages(primaryPage.url);
                    primaryPage.secondaryPages = secondaryPages;
                } catch (err) {
                    console.error(`Error fetching secondary pages for ${primaryPage.url}:`, err);
                }
            }
        }
    } catch (err) {
        console.error('Error fetching primary pages:', err);
    }

    // Fetch locales after primary pages are fetched
    try {
        locales = await getLocales();  // Fetch locales
    } catch (err) {
        console.error('Error fetching locales:', err);
    }

    // Try to serve the page
    try {
        const {
            json: { componentName, componentProps, redirect, customResponse },
            headers,
        } = await getPage(path, queryParams, {
            headers: {
                cookie: req.headers.cookie,
                host,
            },
        });

        //console.log('🔍 Current component detected:', componentName);

        // In ...path.js, modify the Dashboard component section:
        // In ...path.js - use the environment-aware function
        

        // Forward any cookie we encounter
        const cookies = headers.get('set-cookie');
        if (cookies) {
            res.setHeader('Set-Cookie', cookies);
        }

        // Serve custom response if available
        if (customResponse) {
            const { body, body64, contentType } = customResponse;
            res.setHeader('Content-Type', contentType);
            res.statusCode = 200;
            res.write(body64 ? Buffer.from(body64, 'base64') : body);
            res.end();
            return { props: {} };
        }

        // Handle redirection if necessary
        if (redirect) {
            const { destination, isPermanent } = redirect;
            return {
                redirect: {
                    destination: destination,
                    permanent: isPermanent,
                },
            };
        }

        // Pass both primaryPages and locales as props
        return { props: { componentName, componentProps, primaryPages, locales } };
    } catch (err) {
        if (!(err instanceof WagtailApiResponseError)) {
            console.error('Error fetching page:', err);
            throw err;
        }
        return { props: {} };
    }
}


// For SSG
/*
export async function getStaticProps({ params, preview, previewData }) {
params = params || {};
let path = params.path || [];
path = path.join("/");

const { json: pageData } = await getPage(path);
return { props: pageData }
}

export async function getStaticPaths() {
const { json: data } = await getAllPages();

let htmlUrls = data.items.map(x => x.relativeUrl);
htmlUrls = htmlUrls.filter(x => x);
htmlUrls = htmlUrls.map(x => x.split("/"));
htmlUrls = htmlUrls.map(x => x.filter(y => y))
htmlUrls = htmlUrls.filter(x => x.length)

const paths = htmlUrls.map(x => (
    { params: { path: x } }
));

return {
    paths: paths,
    fallback: false,
};
}
*/