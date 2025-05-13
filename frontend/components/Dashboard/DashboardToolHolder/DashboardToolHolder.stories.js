/* global module */

import React from 'react';
import DashboardToolHolder from './DashboardToolHolder';
import data from './DashboardToolHolder.data';

const DashboardToolHolderStory = {
    title: 'Components/DashboardToolHolder',
    component: DashboardToolHolder,
};
export default DashboardToolHolderStory;

export const DashboardToolHolderWithData = () => <DashboardToolHolder {...data} />;
export const DashboardToolHolderWithoutData = () => <DashboardToolHolder />;
