/* global module */

import React from 'react';
import BaseImage from './BaseImage';
import data from './BaseImage.data';

const BaseImageStory = {
    title: 'Components/BaseImage',
    component: BaseImage,
};
export default BaseImageStory;

export const BaseImageWithData = () => <BaseImage {...data} />;
export const BaseImageWithoutData = () => <BaseImage />;
