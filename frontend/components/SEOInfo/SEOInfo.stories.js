/* global module */

import React from 'react';
import SEOInfo from './SEOInfo';
import data from './SEOInfo.data';

const SEOInfoStory = {
    title: 'Components/SEOInfo',
    component: SEOInfo,
};
export default SEOInfoStory;

export const SEOInfoWithData = () => <SEOInfo {...data} />;
export const SEOInfoWithoutData = () => <SEOInfo />;
