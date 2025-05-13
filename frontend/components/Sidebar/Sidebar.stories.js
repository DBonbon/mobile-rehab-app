/* global module */

import React from 'react';
import Sidebar from './Sidebar';
import data from './Sidebar.data';

const SidebarStory = {
    title: 'Components/Sidebar',
    component: Sidebar,
};
export default SidebarStory;

export const SidebarWithData = () => <Sidebar {...data} />;
export const SidebarWithoutData = () => <Sidebar />;
