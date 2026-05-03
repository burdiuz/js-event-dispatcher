import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

import { plugins, cjsConfig, DESTINATION_FOLDER } from './rollup.helpers.js';

export default {
  ...cjsConfig,
  plugins: [
    ...plugins,
    serve({
      open: true,
      host: 'localhost',
      port: 8881,
      contentBase: [DESTINATION_FOLDER, 'example'],
    }),
    livereload({ watch: [DESTINATION_FOLDER, 'example'] }),
  ],
  watch: {
    include: 'src/**',
    chokidar: true,
    clearScreen: false,
  },
};
