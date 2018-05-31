import serve from 'rollup-plugin-serve';
import { plugins, baseConfig } from './rollup.helpers';

export default {
  ...baseConfig,
  plugins: [
    ...plugins,
	serve({
      open: true,
	  port: 8081,
	    contentBase: '.',
	}),
  ],
};
