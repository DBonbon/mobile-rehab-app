/* global module */

import React from 'react';
import Modal from './Modal';
import data from './Modal.data';

const ModalStory = {
    title: 'Components/Modal',
    component: Modal,
};
export default ModalStory;

export const ModalWithData = () => <Modal {...data} />;
export const ModalWithoutData = () => <Modal />;
