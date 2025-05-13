import PropTypes from 'prop-types';
import s from './BaseButton.module.css';

const BaseButton = ({ children, onClick = () => {} }) => {
    return (
        <div className={s.Root}>
            <button onClick={onClick} className={s.Button}>
                {children}
            </button>
        </div>
    );
};

BaseButton.propTypes = {
    children: PropTypes.node.isRequired,  // Accepts any valid React node (text, elements, etc.)
    onClick: PropTypes.func,              // Optional onClick handler for the button
};

export default BaseButton;
