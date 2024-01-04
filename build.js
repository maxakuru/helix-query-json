/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

import path from 'path';
import { fileURLToPath } from 'url';
// eslint-disable-next-line import/no-extraneous-dependencies
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
