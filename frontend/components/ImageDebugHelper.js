// components/ImageDebugHelper.js
import React from 'react';

const ImageDebugHelper = ({ imageData }) => {
    // Convert to string for display, handling both string and object types
    const displayData = typeof imageData === 'string' 
        ? imageData 
        : JSON.stringify(imageData, null, 2);
    
    return (
        <div style={{ 
            margin: '20px 0', 
            padding: '15px', 
            backgroundColor: '#f5f5f5', 
            border: '1px solid #ddd',
            borderRadius: '4px',
            overflow: 'auto'
        }}>
            <h3 style={{ marginTop: 0 }}>Image Debug Info</h3>
            <p><strong>Type:</strong> {typeof imageData}</p>
            
            {typeof imageData === 'object' && imageData !== null && (
                <div>
                    <p><strong>Has URL:</strong> {Boolean(imageData.url || imageData.full_url).toString()}</p>
                    {(imageData.url || imageData.full_url) && (
                        <div>
                            <p><strong>Image URL:</strong> {imageData.full_url || imageData.url}</p>
                            <p>Testing direct image link:</p>
                            <img 
                                src={`${process.env.NEXT_PUBLIC_API_URL || ''}${imageData.full_url || imageData.url}`} 
                                alt="Test" 
                                style={{ maxWidth: '300px', border: '1px solid #ccc' }}
                            />
                        </div>
                    )}
                </div>
            )}
            
            <details>
                <summary>Raw image data</summary>
                <pre>{displayData}</pre>
            </details>
        </div>
    );
};

export default ImageDebugHelper;