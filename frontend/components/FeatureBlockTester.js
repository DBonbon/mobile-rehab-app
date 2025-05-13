// components/FeatureBlockTester.js
import React from 'react';

const FeatureBlockTester = ({ streamField = [] }) => {
  // Extract just the feature_block blocks
  const featureBlocks = streamField.filter(block => 
    block && block.type === 'feature_block'
  );
  
  if (featureBlocks.length === 0) {
    return (
      <div style={{
        padding: '10px',
        margin: '10px 0',
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeeba',
        borderRadius: '4px'
      }}>
        <h3 style={{ margin: '0 0 10px' }}>FeatureBlock Tester</h3>
        <p>No feature_block blocks found in the stream field data.</p>
        <details>
          <summary>View all block types</summary>
          <ul>
            {streamField.map((block, index) => (
              <li key={index}>
                {block && block.type ? block.type : 'No type'} 
                {block && block.id ? ` (ID: ${block.id})` : ''}
              </li>
            ))}
          </ul>
        </details>
      </div>
    );
  }
  
  return (
    <div style={{
      padding: '10px',
      margin: '10px 0',
      backgroundColor: '#d4edda',
      border: '1px solid #c3e6cb',
      borderRadius: '4px'
    }}>
      <h3 style={{ margin: '0 0 10px' }}>FeatureBlock Tester</h3>
      <p>Found {featureBlocks.length} feature_block blocks:</p>
      
      {featureBlocks.map((block, index) => (
        <div key={index} style={{
          padding: '10px',
          margin: '10px 0',
          backgroundColor: 'white',
          border: '1px solid #ddd',
          borderRadius: '4px'
        }}>
          <h4 style={{ margin: '0 0 10px' }}>Feature Block #{index + 1}</h4>
          <p><strong>Block Type:</strong> {block.type}</p>
          <p><strong>Block ID:</strong> {block.id || 'None'}</p>
          
          <div>
            <strong>Value Type:</strong> {block.value ? typeof block.value : 'undefined'}
          </div>
          
          {block.value && typeof block.value === 'object' && (
            <div>
              <p><strong>Value Properties:</strong></p>
              <ul>
                {Object.keys(block.value).map(key => (
                  <li key={key}>
                    <strong>{key}:</strong> {
                      typeof block.value[key] === 'object' 
                        ? 'Object' 
                        : String(block.value[key]).substring(0, 50)
                    }
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <details>
            <summary>Raw Block Data</summary>
            <pre style={{ 
              overflow: 'auto', 
              maxHeight: '200px',
              backgroundColor: '#f5f5f5',
              padding: '10px',
              margin: '10px 0'
            }}>
              {JSON.stringify(block, null, 2)}
            </pre>
          </details>
        </div>
      ))}
    </div>
  );
};

export default FeatureBlockTester;