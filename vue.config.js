module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "~@/base.scss";
        `,
      },
    },
  },
};
