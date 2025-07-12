exports.findMatch = (req, mocks) => {
  for (const mock of mocks) {
    const methodMatch = mock.method.toLowerCase() === req.method.toLowerCase();
    const pathMatch = mock.path === req.path;

    const queryMatch = !mock.query || Object.entries(mock.query).every(
      ([k, v]) => req.query[k] === v
    );
    const bodyMatch = !mock.body || Object.entries(mock.body).every(
      ([k, v]) => req.body[k] === v
    );
    const headerMatch = !mock.headers || Object.entries(mock.headers).every(
      ([k, v]) => req.headers[k.toLowerCase()] === v
    );

    if (methodMatch && pathMatch && queryMatch && bodyMatch && headerMatch) {
      return mock;
    }
  }

  return null;
};
