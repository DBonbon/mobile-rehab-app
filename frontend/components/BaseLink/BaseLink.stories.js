/* global module */

import React from 'react';
import BaseLink from './BaseLink';
import data from './BaseLink.data';

const BaseLinkStory = {
    title: 'Components/BaseLink',
    component: BaseLink,
};
export default BaseLinkStory;

export const BaseLinkWithData = () => <BaseLink {...data} />;
export const BaseLinkWithoutData = () => <BaseLink />;
