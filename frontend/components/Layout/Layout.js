// components/Layout.js
import React from 'react';
import PropTypes from 'prop-types';

const Layout = ({ title = '', intro = '', authorImage = null, children, primaryPages = [], locales = [] }) => {
  return (
    <div>
      {/* Just render children directly without any wrapping elements */}
      {children}
    </div>
  );
};

Layout.propTypes = {
  title: PropTypes.string,
  intro: PropTypes.string,
  authorImage: PropTypes.shape({
    url: PropTypes.string,
    alt: PropTypes.string,
    width: PropTypes.number,
    height: PropTypes.number,
  }),
  children: PropTypes.node,
  primaryPages: PropTypes.arrayOf(PropTypes.object),
  locales: PropTypes.arrayOf(PropTypes.object),
};

export default Layout;