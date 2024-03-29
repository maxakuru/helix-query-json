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

import { errorResponse } from './util.js';

const QUERY_SETTINGS = {
  'rum-pageviews': {
    params: {
      offset: 1,
      interval: 30,
      limit: 100,
    },
  },
  'rum-dashboard': {
    params: {
      offset: 1,
      interval: 30,
      limit: 100,
    },
  },
};

/**
 * @param {Request} request
 * @param {Record<string,string>} env
 */
export default async function handleRequest(request, env) {
  const { RUN_QUERY_ENDPOINT, DEFAULT_DOMAIN_KEY } = env;

  // expect: /query/<owner>/<repo>/<ref>/<queryname>
  const url = new URL(request.url);
  if (!url.pathname.startsWith('/query/')) {
    return errorResponse(404, 'not found', 'not found');
  }

  const parts = url.pathname.split('/');
  const [owner, repo, prodUrl, query, timezone] = parts.slice(2);

  // const configs = rest.slice(0, -1);
  // const config = {};
  // configs.forEach((c) => {
  //   const [key, value] = c.split('.');
  //   config[key] = value;
  // });

  if (!owner || !repo || !prodUrl || !query || !timezone) {
    return errorResponse(404, 'not found', 'not found');
  }

  const settings = QUERY_SETTINGS[query] || {};
  const qps = url.searchParams;
  if (!qps.has('domainkey') && DEFAULT_DOMAIN_KEY) {
    qps.set('domainkey', DEFAULT_DOMAIN_KEY);
  }
  if (!qps.has('url')) {
    qps.set('url', decodeURIComponent(prodUrl));
  }
  if (!qps.has('timezone')) {
    qps.set('timezone', timezone);
  }
  Object.entries(settings.params || {})
    .forEach(([key, value]) => {
      qps.set(key, value);
    });
  // Object.keys(config).forEach((key) => {
  //   qps.set(key, config[key]);
  // });

  const queryUrl = new URL(`${RUN_QUERY_ENDPOINT}/${query}?${qps.toString()}`);
  console.debug('queryUrl: ', queryUrl);
  const resp = await fetch(queryUrl);
  return resp;
}
