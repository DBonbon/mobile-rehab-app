/* global module */

import React from 'react';
import Layout from './Layout';
import data from './Layout.data';

const LayoutStory = {
    title: 'Components/Layout',
    component: Layout,
};
export default LayoutStory;

export const LayoutWithData = () => <Layout {...data} />;
export const LayoutWithoutData = () => <Layout />;
