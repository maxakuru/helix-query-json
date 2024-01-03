import { errorResponse } from "./util.js";

/**
 * @param {Request} request 
 * @param {Record<string,string>} env 
 */
export default async function handleRequest(request, env) {
  const { RUN_QUERY_ENDPOINT, DEFAULT_DOMAIN_KEY } = env;

  // expect: /query/<owner>/<repo>/<ref>/<queryname>
  const url = new URL(request.url);
  if(!url.pathname.startsWith('/query/')) {
    return errorResponse(404, 'not found', 'not found');
  }

  const parts = url.pathname.split('/');
  const [owner, repo, ref, query, ...rest] = parts.slice(2);
  if(rest.length || !owner || !repo || !ref || !query) {
    return errorResponse(404, 'not found', 'not found');
  }

  const qps = url.searchParams;
  if(!qps.has('domainkey') && DEFAULT_DOMAIN_KEY) {
    qps.set('domainkey', DEFAULT_DOMAIN_KEY);
  }

  const queryUrl = new URL(`${RUN_QUERY_ENDPOINT}/${query}?${qps.toString()}`);
  console.debug('queryUrl: ', queryUrl);
  const resp = await fetch(queryUrl);
  return resp;
}