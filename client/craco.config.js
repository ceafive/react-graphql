const path = require("path");

const buildPath = (arg) => {
  const myPath = path.resolve(__dirname, `node_modules/${arg}`);
  return require(myPath);
};

module.exports = {
  style: {
    postcss: {
      plugins: [buildPath("tailwindcss"), buildPath("autoprefixer")],
    },
  },
};
