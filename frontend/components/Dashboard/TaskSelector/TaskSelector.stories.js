/* global module */

import React from 'react';
import TaskSelector from './TaskSelector';
import data from './TaskSelector.data';

const TaskSelectorStory = {
    title: 'Components/TaskSelector',
    component: TaskSelector,
};
export default TaskSelectorStory;

export const TaskSelectorWithData = () => <TaskSelector {...data} />;
export const TaskSelectorWithoutData = () => <TaskSelector />;
