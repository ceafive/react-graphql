const path = require("path");

const buildPath = (arg) => {
  const myPath = path.resolve(__dirname, `node_modules/${arg}`);
  console.log({ myPath });

  return require(myPath);
};

module.exports = {
  style: {
    postcss: {
      plugins: [buildPath("tailwindcss"), buildPath("autoprefixer")],
    },
  },
};
