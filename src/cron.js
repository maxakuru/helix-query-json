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

const SITES = [
  'owner/repo/blog.adobe.com',
];

const QUERIES = [
  'rum-pageviews',
];

const error = (msg, resp) => {
  const err = new Error(msg);
  err.status = resp.status;
  return err;
};

/**
 * Publish query results
 *
 * @param {import('@cloudflare/workers-types').ScheduledEvent} event
 * @param {Record<string,string>} env
 */
export default async function handleScheduled(event, env) {
  const {
    STORE_QUERY_REPO: repo,
    STORE_QUERY_OWNER: owner,
    ADMIN_ENDPOINT,
  } = env;
  const [now] = new Date(event.scheduledTime).toISOString().split(':');

  const adminUrl = (route, path) => `${ADMIN_ENDPOINT}/${route}/${owner}/${repo}/main${path}`;

  return Promise.allSettled(
    SITES.map(
      (site) => QUERIES.map(
        async (query) => {
          const path = `/${site}/${query}/${now}.json`;
          let url = adminUrl('preview', path);
          let resp = await fetch(url, { method: 'POST' });
          console.debug('previewed: ', url, resp.status);

          if (resp.ok) {
            url = adminUrl('live', path);
            resp = await fetch(url, { method: 'POST' });
            console.debug('published: ', url, resp.status);

            if (!resp.ok) {
              throw error('failed to publish', resp);
            }
          } else {
            throw error('failed to publish', resp);
          }

          return resp;
        },
      ),
    ).flat(),
  );
}
