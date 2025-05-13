/* global module */

import React from 'react';
import header from './header';
import data from './header.data';

const headerStory = {
    title: 'Components/header',
    component: header,
};
export default headerStory;

export const headerWithData = () => <header {...data} />;
export const headerWithoutData = () => <header />;
