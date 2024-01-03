import handleRequest from './handler.js';
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
};