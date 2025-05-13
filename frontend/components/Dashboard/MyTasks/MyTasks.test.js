import { render, /* screen */ } from '@testing-library/react';
import MyTasks from '.';
// import data from './MyTasks.data';

describe('<MyTasks />', () => {
    it('Renders an empty MyTasks', () => {
        render(<MyTasks />);
    });

    // it('Renders MyTasks with data', () => {
    //     const { container } = render(<MyTasks {...data} />);
    //     expect(container).toMatchSnapshot();
    // });
});
