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

import handleRequest from './handler.js';
import handleScheduled from './cron.js';
import { errorResponse, noCacheResponseInit } from './util.js';

export default {
  async fetch(request, env) {
    let resp;

    try {
      resp = await handleRequest(request, env);
    } catch (e) {
      if (e.response) {
        resp = e.response;
      } else {
        console.error('[index] fatal error: ', e);
        resp = errorResponse(500, e.message, 'internal error');
      }
    }

    if (resp) {
      resp = new Response(
        resp.body,
        resp,
      );
    } else {
      resp = new Response(null, noCacheResponseInit(404));
    }

    return resp;
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(handleScheduled(event, env));
  },
};
