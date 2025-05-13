import React from 'react';
import PropTypes from 'prop-types';
import s from './SEOInfo.module.css';

const SEOInfo = ({ seo = {
    seo_html_title: '',
} }) => {
    return (
        <div className={s.SeoContainer}>
            <p>SEO Title: {seo.seo_html_title}</p>
        </div>
    );
};

SEOInfo.propTypes = {
    seo: PropTypes.shape({
        seo_html_title: PropTypes.string,
    }),
};

export default SEOInfo;
