//BaseCard.js
import React from 'react';
import PropTypes from 'prop-types';
import styles from './BaseCard.module.css';
//import BaseImage from '../BaseImage';  // Import BaseImage
import Image from 'next/image';
import Link from 'next/link';

const Card = ({ children }) => {
    return <div className="card">{children}</div>;
};

const CardHeader = ({ children }) => {
    return <div className="card-header">{children}</div>;
};

const CardBody = ({ children }) => {
    return <div className="card-body">{children}</div>;
};

const BaseCard = ({ title, subtitle, smallText, image, description, footerContent, className = '' }) => {
    return (
        <div className={`card ${className}`}>
            {/* Card Header */}
            <div className="card-header">
                <p>subtitle</p>
                <small>smallText</small>
                <h4>title</h4>
            </div>

            {/* Card Body */}
            <div className="card-body">
                <Image
                    src="http://localhost:8081/wt/media/images/watermelon.width-1200.jpg"
                    alt="Card background"
                    className=""
                    width={270}
                    height={150}
                />
            </div>

            {/* Card Footer */}
            <div className="card-footer">
                <Link
                    href='https://www.google.com'
                    className="px-4 py-3 text-black hover:text-blue-600">
                    Read More →
                    </Link>
                <p>footerContent</p>
            </div>
        </div>
    );
}

BaseCard.propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,  // Subtitle prop
    smallText: PropTypes.string, // Small text prop
    image: PropTypes.object.isRequired, // Image object passed to BaseImage
    description: PropTypes.string,
    footerContent: PropTypes.node,
    className: PropTypes.string,
};

export default BaseCard;
