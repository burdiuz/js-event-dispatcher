import serve from 'rollup-plugin-serve';
import livereload from 'rollup-plugin-livereload';

import { plugins, umdConfig, DESTINATION_FOLDER } from './rollup.helpers';

export default {
  ...umdConfig,
  plugins: [
    ...plugins,
    serve({
      open: true,
      host: 'localhost',
      port: 8881,
      contentBase: ['dist', 'example'],
    }),
    livereload({ watch: [DESTINATION_FOLDER, 'example'] }),
  ],
  watch: {
    include: 'source/**',
    chokidar: true,
    clearScreen: false,
  },
};
