/* global module */

import React from 'react';
import BaseCard from './BaseCard';
import data from './BaseCard.data';

const BaseCardStory = {
    title: 'Components/BaseCard',
    component: BaseCard,
};
export default BaseCardStory;

export const BaseCardWithData = () => <BaseCard {...data} />;
export const BaseCardWithoutData = () => <BaseCard />;
