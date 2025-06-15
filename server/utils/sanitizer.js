const xss = require('xss');
const MarkdownIt = require('markdown-it');
const md = new MarkdownIt({
  html: false,
  linkify: true,
  typographer: true,
  breaks: true
});

// Configure XSS whitelist
const xssOptions = {
  whiteList: {
    b: [],
    i: [],
    em: [],
    strong: [],
    a: ['href', 'title', 'target'],
    p: [],
    br: [],
    code: [],
    pre: [],
    ul: [],
    ol: [],
    li: [],
    blockquote: []
  },
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style', 'xml', 'iframe']
};

// Sanitize message content
exports.sanitizeMessage = (content) => {
  // First pass: XSS sanitization
  const sanitizedContent = xss(content, xssOptions);

  // Second pass: Markdown rendering
  const htmlContent = md.render(sanitizedContent);

  // Third pass: Final XSS check on rendered HTML
  return xss(htmlContent, xssOptions);
};

// Sanitize user input for database queries
exports.sanitizeQuery = (query) => {
  if (typeof query !== 'string') return query;
  
  // Remove MongoDB operators
  return query.replace(/\$[a-zA-Z]+/g, '');
};

// Sanitize file names
exports.sanitizeFileName = (fileName) => {
  if (typeof fileName !== 'string') return '';
  
  // Remove special characters and path traversal
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .substring(0, 255);
};

// Sanitize HTML attributes
exports.sanitizeHtmlAttr = (attr) => {
  if (typeof attr !== 'string') return '';
  
  // Remove potentially dangerous characters
  return attr
    .replace(/['"<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '');
};

// Sanitize markdown content
exports.sanitizeMarkdown = (content) => {
  if (typeof content !== 'string') return '';

  // Allow only basic markdown syntax
  return content
    .replace(/[^\w\s*_~`#@:;'",.!?-]/g, '')
    .replace(/#{6,}/g, '#####') // Limit heading level to 5
    .trim();
}; 