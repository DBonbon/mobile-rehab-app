/* global module */

import React from 'react';
import Dashboard from './Dashboard';
import data from './Dashboard.data';

const DashboardStory = {
    title: 'Components/Dashboard',
    component: Dashboard,
};
export default DashboardStory;

export const DashboardWithData = () => <Dashboard {...data} />;
export const DashboardWithoutData = () => <Dashboard />;
