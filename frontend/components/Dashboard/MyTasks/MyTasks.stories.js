/* global module */

import React from 'react';
import MyTasks from './MyTasks';
import data from './MyTasks.data';

const MyTasksStory = {
    title: 'Components/MyTasks',
    component: MyTasks,
};
export default MyTasksStory;

export const MyTasksWithData = () => <MyTasks {...data} />;
export const MyTasksWithoutData = () => <MyTasks />;
