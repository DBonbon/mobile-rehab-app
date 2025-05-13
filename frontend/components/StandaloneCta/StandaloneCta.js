import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link'; // Using Next.js Link

const StandaloneCta = ({ value }) => {
  if (!value || !value.cta) {
    console.warn('⚠️ No CTA value provided for StandaloneCta component');
    return null;
  }
  
  const { cta, description, button_style = 'primary' } = value;
  
  // Get button styling based on the style prop
  const getButtonStyle = (style) => {
    switch (style) {
      case 'primary':
        return 'bg-blue-600 hover:bg-blue-700 text-white';
      case 'secondary':
        return 'bg-gray-600 hover:bg-gray-700 text-white';
      case 'outline':
        return 'bg-transparent border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white';
      default:
        return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
  };
  
  const buttonClasses = `inline-flex items-center justify-center px-6 py-3 font-medium rounded-md transition-all duration-300 ${getButtonStyle(button_style)}`;
  
  // Component for the button content
  const ButtonContent = () => (
    <span className="flex items-center">
      {cta.text}
      <svg className="ml-2 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
      </svg>
    </span>
  );
  
  return (
    <div className="w-full py-10 px-4 md:px-8 text-center">
      <div className="max-w-4xl mx-auto">
        {description && (
          <p className="text-lg mb-6 text-gray-700">
            {description}
          </p>
        )}
        
        {cta.link && (
          <>
            {/* Render as internal link if it starts with '/' */}
            {cta.link.startsWith('/') || cta.link.startsWith('#') ? (
              <Link href={cta.link} className={buttonClasses}>
                <ButtonContent />
              </Link>
            ) : (
              /* Render as external link otherwise */
              <a 
                href={cta.link} 
                className={buttonClasses}
                target={cta.open_in_new_tab ? "_blank" : "_self"}
                rel={cta.open_in_new_tab ? "noopener noreferrer" : ""}
              >
                <ButtonContent />
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
};

StandaloneCta.propTypes = {
  value: PropTypes.shape({
    cta: PropTypes.shape({
      text: PropTypes.string.isRequired,
      link: PropTypes.string.isRequired,
      open_in_new_tab: PropTypes.bool
    }).isRequired,
    description: PropTypes.string,
    button_style: PropTypes.oneOf(['primary', 'secondary', 'outline'])
  })
};

export default StandaloneCta;