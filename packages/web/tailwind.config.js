const { join } = require('path');

module.exports = {
  content: [join(__dirname, '/**/*.{tsx,ts,html}')],
  theme: {
    extend: {},
  },
  plugins: [],
};
