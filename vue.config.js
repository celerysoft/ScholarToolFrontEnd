module.exports = {
  productionSourceMap: false,
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
