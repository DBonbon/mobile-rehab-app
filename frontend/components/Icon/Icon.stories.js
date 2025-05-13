/* global module */

import React from 'react';
import Icon from './Icon';
import data from './Icon.data';

const IconStory = {
    title: 'Components/Icon',
    component: Icon,
};
export default IconStory;

export const IconWithData = () => <Icon {...data} />;
export const IconWithoutData = () => <Icon />;
