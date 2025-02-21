function setupProxy({ tls }) {
  const serverResources = ['/api', '/services', '/management', '/v3/api-docs', '/h2-console', '/auth', '/oauth2', '/login', '/health'];
  return [
    {
      context: serverResources,
      target: `http${tls ? 's' : ''}://localhost:8082`,
      secure: false,
      changeOrigin: tls,
    },
  ];
}

module.exports = setupProxy;
