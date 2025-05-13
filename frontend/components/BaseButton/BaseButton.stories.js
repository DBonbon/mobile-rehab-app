/* global module */

import React from 'react';
import BaseButton from './BaseButton';
import data from './BaseButton.data';

const BaseButtonStory = {
    title: 'Components/BaseButton',
    component: BaseButton,
};
export default BaseButtonStory;

export const BaseButtonWithData = () => <BaseButton {...data} />;
export const BaseButtonWithoutData = () => <BaseButton />;
