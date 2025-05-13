export const defaultSeoData = {
    seoHtmlTitle: 'Test Page Title',
    seoMetaDescription: 'Test meta description',
    seoOgTitle: 'Test OG Title',
    seoOgDescription: 'Test OG Description',
    seoOgUrl: 'https://example.com/test',
    seoOgImage: 'https://example.com/test.jpg',
    seoOgType: 'website',
    seoTwitterTitle: 'Test Twitter Title',
    seoTwitterDescription: 'Test Twitter Description',
    seoTwitterUrl: 'https://example.com/test',
    seoTwitterImage: 'https://example.com/test.jpg',
    seoMetaRobots: {
      index: true,
      follow: true,
      value: 'index, follow'
    },
    canonicalLink: 'https://example.com/canonical'
  };
  
  export const aboutPageSeoData = {
    ...defaultSeoData,
    seoHtmlTitle: 'About Page | Test Site',
    // Override any specific SEO values for About page
  };
  
  // Add more page-specific SEO data as needed