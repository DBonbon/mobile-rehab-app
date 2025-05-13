// __mocks__/components/Sidebar/SidebarData.js
export const mockSidebarItems = [
    {
        name: 'Games',
        slug: 'games',
        type: 'category'
    },
    {
        name: 'Software',
        slug: 'software',
        type: 'category'
    },
    {
        name: 'Hardware',
        slug: 'hardware',
        type: 'category'
    }
];

export const mockEmptySidebarItems = [];

export const mockNestedSidebarItems = [
    {
        name: 'Products',
        slug: 'products',
        type: 'page',
        children: [
            {
                name: 'New Arrivals',
                slug: 'new-arrivals',
                type: 'product'
            },
            {
                name: 'Bestsellers',
                slug: 'bestsellers',
                type: 'product'
            }
        ]
    }
];