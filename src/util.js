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

function headersInit(contentType, headers = {}) {
  return {
    'access-control-allow-origin': '*',
    ...(contentType ? { 'content-type': contentType } : {}),
    ...headers,
  };
}

export const noCacheResponseInit = (status, contentType) => ({
  status,
  headers: headersInit(contentType, {
    'cache-control': 'max-age=0, must-revalidate, no-cache, no-store',
  }),
});

export const errorResponse = (
  status,
  xError,
  message,
) => {
  const init = noCacheResponseInit(status, message ? 'application/json' : undefined);
  return new Response(message ? JSON.stringify({ message }) : null, {
    ...init,
    headers: {
      ...init.headers,
      'x-error': xError,
    },
  });
};
