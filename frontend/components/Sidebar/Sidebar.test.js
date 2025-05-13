// components/Sidebar/Sidebar.test.js
import { render /* screen */ } from '@testing-library/react';
import Sidebar from './';
import { mockSidebarItems } from '../../utils/testUtils';

describe('<Sidebar />', () => {
        // Your existing tests
    
    it('Renders an empty Sidebar', () => {
        const { container } = render(<Sidebar />);
        // No assertions - just checking if it renders without errors
    });

    it('Renders Sidebar with data', () => {
        const { container } = render(<Sidebar items={mockSidebarItems} />);
        // No assertions - just checking if it renders without errors hjh
    });
});