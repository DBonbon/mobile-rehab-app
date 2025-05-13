// ./api/wagtail.js
//api/wagtail.js
import querystring from 'querystring';
import {
    keysToCamelFromSnake,
    keysToSnakeFromCamel,
} from '../utils/caseconverters';

const API_URL = process.env.WAGTAIL_API_URL;
const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_WAGTAIL_API_URL;

/**
 * Checks if a path is an authentication route
 * @param {string} path - The path to check
 * @returns {boolean} - Whether the path is an auth route
 */

function createTimeoutController(milliseconds = 15000) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), milliseconds);
    
    return {
      signal: controller.signal,
      clearTimeout: () => clearTimeout(timeoutId)
    };
  }
  
function isAuthRoute(path) {
    const authRoutes = ['login', 'register', 'profile'];
    return authRoutes.includes(path);
}

// Modified getPage function with auth routes support
export async function getPage(path, params, options) {
    console.log("[getPage] path:", path); 
    params = params || {};
    
    // Special handling for auth routes
    if (isAuthRoute(path)) {
        return await getRequest(`${API_URL}/v1/auth_page/${path}/`, {}, options);
    }

    // Standard page handling
    params = {
        htmlPath: path,
        ...params,
    };

    return await getRequest(`${API_URL}/v1/page_by_path/`, params, options);
}

export async function getPasswordProtectedPage(
    restrictionId,
    pageId,
    params,
    options
) {
    params = params || {};
    return await postRequest(
        `${NEXT_PUBLIC_API_URL}/v1/password_protected_page/${restrictionId}/${pageId}/`,
        params,
        options
    );
}

export async function getAllPages() {
    return await getRequest(`${API_URL}/v1/page_relative_urls/`);
}

export async function getPagePreview(contentType, token, params, options) {
    params = params || {};
    params = {
        contentType,
        token,
        ...params,
    };

    return await getRequest(`${API_URL}/v1/page_preview/`, params, options);
}

export async function getPrimaryPages() {
    const homepageUrl = `${API_URL}/v1/page_by_path/`;
    const homepageRes = await getRequest(homepageUrl, { htmlPath: '/' }, { cache: 'force-cache' });

    return homepageRes.json.componentProps.children || [];
}


export async function getSecondaryPages(primaryPageUrl) {
    // Fetch secondary pages for a given primary page
    const secondaryPagesUrl = `${API_URL}/v1/page_by_path/`;
    const secondaryPagesRes = await getRequest(secondaryPagesUrl, { htmlPath: primaryPageUrl });

    // Correctly access children
    return secondaryPagesRes.json.componentProps.children || [];
}

// function to fetch locales:
export async function getLocales() {
    const url = `${API_URL}/v1/locales/`;
    const res = await getRequest(url, {}, { cache: 'force-cache' });
    return res.json;
}


export async function getPublicViewData(slug, params, options) {
    return await getRequest(
        `${NEXT_PUBLIC_API_URL}/v1/external_view_data/${slug}/`,
        params,
        options
    );
}

export async function getViewData(slug, params, options) {
    return await getRequest(
        `${API_URL}/v1/external_view_data/${slug}/`,
        params,
        options
    );
}

export async function getRedirect(path, params, options) {
    params = params || {};
    params = {
        htmlPath: path,
        ...params,
    };

    return await getRequest(`${API_URL}/v1/redirect_by_path/`, params, options);
}

export async function getRequest(url, params, options) {
    const qs = querystring.stringify(params);
    const fullUrl = qs ? `${url}?${qs}` : url;
    console.log("[getRequest] Fetching:", fullUrl);  
    params = params || {};
    params = keysToSnakeFromCamel(params);
  
    let headers = options?.headers || {};
    headers = {
      'Content-Type': 'application/json',
      ...headers,
    };
    
    const queryString = querystring.stringify(params);
    const urlWithQuery = queryString ? `${url}?${queryString}` : url;
  
    let fetchOptions = { headers };
  
    if (options?.cache) {
      fetchOptions = {
        ...fetchOptions,
        cache: options.cache,
      };
    }
  
    if (options?.revalidate) {
      fetchOptions = {
        ...fetchOptions,
        next: {
          revalidate: options.revalidate,
        },
      };
    }
    
    // Add timeout with AbortController - use a shorter timeout (15 seconds)
    // to ensure we don't reach Vercel's 60-second limit
    const timeout = createTimeoutController(15000);
    
    try {
      const res = await fetch(urlWithQuery, {
        ...fetchOptions,
        signal: timeout.signal
      });
      
      timeout.clearTimeout();
  
      if (res.status < 200 || res.status >= 300) {
        const error = new WagtailApiResponseError(res, url, params);
        error.response = res;
        throw error;
      }
  
      const json = await res.json();
      return {
        headers: res.headers,
        json: keysToCamelFromSnake(json),
      };
    } catch (error) {
      timeout.clearTimeout();
      if (error.name === 'AbortError') {
        console.error(`Request timeout after 15 seconds: ${urlWithQuery}`);
        throw new Error(`Request timeout after 15 seconds: ${urlWithQuery}`);
      }
      throw error;
    }
  }

  export async function postRequest(url, params, options) {
    params = params || {};
    params = keysToSnakeFromCamel(params);
  
    let headers = options?.headers || {};
    headers = {
      'Content-Type': 'application/json',
      ...headers,
    };
    
    // Add timeout with AbortController
    const timeout = createTimeoutController(15000);
    
    try {
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(params),
        headers,
        signal: timeout.signal
      });
      
      timeout.clearTimeout();
  
      if (res.status < 200 || res.status >= 300) {
        const error = new WagtailApiResponseError(res, url, params);
        error.response = res;
        throw error;
      }
  
      const json = await res.json();
      return {
        headers: res.headers,
        json: keysToCamelFromSnake(json),
      };
    } catch (error) {
      timeout.clearTimeout();
      if (error.name === 'AbortError') {
        console.error(`POST request timeout after 15 seconds: ${url}`);
        throw new Error(`POST request timeout after 15 seconds: ${url}`);
      }
      throw error;
    }
  }

export class WagtailApiResponseError extends Error {
    constructor(res, url, params) {
        super(
            `${res.statusText}. Url: ${url}. Params: ${JSON.stringify(params)}`
        );
        this.name = 'WagtailApiResponseError';
    }
}