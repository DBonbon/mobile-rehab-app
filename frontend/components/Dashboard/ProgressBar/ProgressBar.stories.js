/* global module */

import React from 'react';
import ProgressBar from './ProgressBar';
import data from './ProgressBar.data';

const ProgressBarStory = {
    title: 'Components/ProgressBar',
    component: ProgressBar,
};
export default ProgressBarStory;

export const ProgressBarWithData = () => <ProgressBar {...data} />;
export const ProgressBarWithoutData = () => <ProgressBar />;
