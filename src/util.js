function headersInit(contentType, headers = {}) {
  return {
    'access-control-allow-origin': '*',
    ...(contentType ? { 'content-type': contentType } : {}),
    ...headers,
  };
}

export const noCacheResponseInit = (status, contentType) => {
  return {
    status,
    headers: headersInit(contentType, {
      'cache-control': 'max-age=0, must-revalidate, no-cache, no-store',
    }),
  };
};

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