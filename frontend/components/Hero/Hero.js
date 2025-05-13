import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../Icon'; // Assuming you have an Icon component

const Hero = ({ value }) => {
  if (!value) {
    console.warn('⚠️ No value provided for Hero component');
    return null;
  }

  const { heading, sub_heading, intro, icon } = value;

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 to-indigo-800 text-white py-16 px-4 md:px-8 lg:px-16 rounded-lg shadow-xl">
      <div className="max-w-6xl mx-auto">
        {icon && (
          <div className="mb-6">
            <Icon icon={icon} className="h-16 w-16 text-white" />
          </div>
        )}
        
        {heading && (
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
            {heading}
          </h1>
        )}
        
        {sub_heading && (
          <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold mb-6">
            {sub_heading}
          </h2>
        )}
        
        {intro && (
          <div 
            className="text-lg md:text-xl max-w-3xl"
            dangerouslySetInnerHTML={{ __html: intro }}
          />
        )}
      </div>
    </div>
  );
};

Hero.propTypes = {
  value: PropTypes.shape({
    heading: PropTypes.string,
    sub_heading: PropTypes.string,
    intro: PropTypes.string,
    icon: PropTypes.object
  })
};

export default Hero;