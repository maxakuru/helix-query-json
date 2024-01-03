import path from 'path';
import { fileURLToPath } from 'url';
import * as esbuild from 'esbuild';

// eslint-disable-next-line no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dev = process.env.NODE_ENV === 'development';

const build = async () => {
  try {
    console.debug('[build.js] building');

    await esbuild.build({
      bundle: true,
      sourcemap: dev,
      minify: !dev,
      treeShaking: true,
      format: 'esm',
      define: {},
      platform: 'browser',
      target: 'esnext',
      external: ['__STATIC_CONTENT_MANIFEST'],
      mainFields: ['browser', 'module', 'main'],
      conditions: ['browser', 'worker'],
      entryPoints: [path.resolve(__dirname, 'src', 'index.js')],
      outdir: path.resolve(__dirname, 'dist'),
      plugins: [],
    });
  } catch (e) {
    console.error('[build.js] error: ', e);
    process.exitCode = 1;
  }
};

build();