/* global module */

import React from 'react';
import CTA from './CTA';
import data from './CTA.data';

const CTAStory = {
    title: 'Components/CTA',
    component: CTA,
};
export default CTAStory;

export const CTAWithData = () => <CTA {...data} />;
export const CTAWithoutData = () => <CTA />;
