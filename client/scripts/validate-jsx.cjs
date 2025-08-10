const fs = require('fs');
const path = require('path');

function validateJSX(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n');
    
    let openTags = [];
    let openFragments = 0;
    let openBraces = 0;
    let openParens = 0;
    
    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      
      // Check for opening tags
      if (line.includes('<div') && !line.includes('</div') && !line.includes('/>')) {
        openTags.push({ type: 'div', line: lineNumber });
      }
      if (line.includes('<>')) {
        openFragments++;
      }
      if (line.includes('</>')) {
        openFragments--;
      }
      if (line.includes('</div>')) {
        openTags.pop();
      }
      
      // Check for braces and parentheses
      for (let char of line) {
        if (char === '{') openBraces++;
        if (char === '}') openBraces--;
        if (char === '(') openParens++;
        if (char === ')') openParens--;
      }
    });
    
    let hasErrors = false;
    
    if (openTags.length > 0) {
      console.error('❌ Unclosed div tags at lines:', openTags.map(t => t.line));
      hasErrors = true;
    }
    
    if (openFragments !== 0) {
      console.error('❌ Mismatched JSX fragments:', openFragments > 0 ? 'too many opening' : 'too many closing');
      hasErrors = true;
    }
    
    if (openBraces !== 0) {
      console.error('❌ Mismatched braces:', openBraces > 0 ? 'too many opening' : 'too many closing');
      hasErrors = true;
    }
    
    if (openParens !== 0) {
      console.error('❌ Mismatched parentheses:', openParens > 0 ? 'too many opening' : 'too many closing');
      hasErrors = true;
    }
    
    if (!hasErrors) {
      console.log('✅ JSX structure looks good!');
    }
    
    return !hasErrors;
  } catch (error) {
    console.error('❌ Error reading file:', error.message);
    return false;
  }
}

// If run directly, validate the CommunityPage file
if (require.main === module) {
  const filePath = path.join(__dirname, '../src/pages/community/CommunityPage.tsx');
  validateJSX(filePath);
}

module.exports = validateJSX;
