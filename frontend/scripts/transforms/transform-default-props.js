// transform-default-props.js
module.exports = function(fileInfo, api) {
    const j = api.jscodeshift;
    const root = j(fileInfo.source);
    let hasModifications = false;
  
    // Find all function components with defaultProps
    root
      .find(j.AssignmentExpression)
      .filter(path => 
        path.node.left &&
        path.node.left.type === 'MemberExpression' &&
        path.node.left.property.name === 'defaultProps'
      )
      .forEach(path => {
        // Get component name
        const componentName = path.node.left.object.name;
        if (!componentName) return;
        
        // Find the component function declaration
        const componentDecl = root
          .find(j.VariableDeclarator)
          .filter(decl => 
            decl.node.id.name === componentName &&
            decl.node.init &&
            (decl.node.init.type === 'ArrowFunctionExpression' || 
             decl.node.init.type === 'FunctionExpression')
          );
  
        if (componentDecl.size() === 0) return;
  
        // Get the defaultProps
        const defaultProps = path.node.right.properties;
        if (!defaultProps || defaultProps.length === 0) return;
  
        // Process component declaration to add default parameters
        componentDecl.forEach(decl => {
          const func = decl.node.init;
          
          // Already has parameter destructuring
          if (func.params.length > 0 && func.params[0].type === 'ObjectPattern') {
            const paramProps = func.params[0].properties;
            
            // Add default values to existing destructured parameters
            defaultProps.forEach(defaultProp => {
              const propName = defaultProp.key.name;
              const existingProp = paramProps.find(p => p.key.name === propName);
              
              if (existingProp) {
                existingProp.value = {
                  type: 'AssignmentPattern',
                  left: existingProp.value || j.identifier(propName),
                  right: defaultProp.value
                };
              } else {
                paramProps.push(j.property(
                  'init',
                  j.identifier(propName),
                  j.assignmentPattern(
                    j.identifier(propName),
                    defaultProp.value
                  )
                ));
              }
            });
          } 
          // Needs parameter destructuring
          else {
            const newParams = [];
            const objPattern = j.objectPattern([]);
            
            defaultProps.forEach(defaultProp => {
              objPattern.properties.push(j.property(
                'init',
                j.identifier(defaultProp.key.name),
                j.assignmentPattern(
                  j.identifier(defaultProp.key.name),
                  defaultProp.value
                )
              ));
            });
            
            newParams.push(objPattern);
            func.params = newParams;
          }
        });
  
        // Remove the defaultProps assignment
        j(path).remove();
        hasModifications = true;
      });
  
    return hasModifications ? root.toSource() : fileInfo.source;
  };