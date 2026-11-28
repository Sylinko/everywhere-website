const feedbackBodyLimit = 64 * 1024;

export async function readFeedbackRequest(request: Request): Promise<Request | Response> {
  const tooLarge = () => new Response('Feedback is too large', { status: 413 });
  if (Number(request.headers.get('Content-Length')) > feedbackBodyLimit) {
    await request.body?.cancel();
    return tooLarge();
  }
  if (!request.body) return request;

  const reader = request.body.getReader();
  const bytes = new Uint8Array(feedbackBodyLimit);
  let size = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      if (size + value.byteLength > feedbackBodyLimit) {
        await reader.cancel();
        return tooLarge();
      }
      bytes.set(value, size);
      size += value.byteLength;
    }
  } finally {
    reader.releaseLock();
  }
  const body = bytes.subarray(0, size);
  if ('cf' in request) return new Request(request, { body });
  // Vite's dev Request is not branded as a native Node Fetch Request.
  return new Request(request.url, {
    method: request.method, headers: request.headers, signal: request.signal, redirect: request.redirect, body,
  });
}
