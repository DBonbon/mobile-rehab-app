/* global module */

import React from 'react';
import TestImage from './TestImage';
import data from './TestImage.data';

const TestImageStory = {
    title: 'Components/TestImage',
    component: TestImage,
};
export default TestImageStory;

export const TestImageWithData = () => <TestImage {...data} />;
export const TestImageWithoutData = () => <TestImage />;
