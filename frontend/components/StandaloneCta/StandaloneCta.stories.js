/* global module */

import React from 'react';
import StandaloneCta from './StandaloneCta';
import data from './StandaloneCta.data';

const StandaloneCtaStory = {
    title: 'Components/StandaloneCta',
    component: StandaloneCta,
};
export default StandaloneCtaStory;

export const StandaloneCtaWithData = () => <StandaloneCta {...data} />;
export const StandaloneCtaWithoutData = () => <StandaloneCta />;
