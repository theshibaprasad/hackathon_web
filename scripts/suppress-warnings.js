// Suppress Node.js deprecation warnings
process.removeAllListeners('warning');

// Override console.warn to filter out punycode deprecation warnings
const originalWarn = console.warn;
console.warn = function(...args) {
  const message = args.join(' ');
  if (message.includes('punycode') && message.includes('deprecated')) {
    return;
  }
  originalWarn.apply(console, args);
};

// Override process.emit to filter warnings
const originalEmit = process.emit;
process.emit = function(name, data, ...args) {
  if (name === 'warning' && data && data.name === 'DeprecationWarning' && data.message.includes('punycode')) {
    return false;
  }
  return originalEmit.apply(process, arguments);
};

module.exports = {};

