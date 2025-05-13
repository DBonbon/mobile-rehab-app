/* global module */

import React from 'react';
import BattlefieldView from './BattlefieldView';
import data from './BattlefieldView.data';

const BattlefieldViewStory = {
    title: 'Containers/BattlefieldView',
    component: BattlefieldView,
};
export default BattlefieldViewStory;

export const BattlefieldViewWithData = () => <BattlefieldView {...data} />;
export const BattlefieldViewWithoutData = () => <BattlefieldView />;
