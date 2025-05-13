// import PropTypes from 'prop-types';
// components/TestImage.js
import React from 'react';
import Image from 'next/image'; // Import next/image

const TestImage = () => {
    return (
        <div>
            <h1>Testing next/image</h1>
            <Image
                src="/wt/media/images/13940663135_b79e1f19b7_b.original.jpg" // Use a known working image URL
                alt="Test Image"
                width={1200}
                height={800}
                layout="responsive"
            />
        </div>
    );
};

TestImage.propTypes = {};

TestImage.defaultProps = {};

export default TestImage;
