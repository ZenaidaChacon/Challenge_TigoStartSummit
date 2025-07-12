const service = require('../services/mockService');
const matcher = require('../utils/matcher');
const validateMock = require('../utils/validateMock');
const renderTemplate = require('../utils/templateEngine');

exports.createMock = (req, res, next) => {
  try {
    validateMock(req.body);
    const saved = service.addMock(req.body);
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
};

exports.getMocks = (req, res) => {
  res.json(service.getAllMocks());
};

exports.updateMock = (req, res, next) => {
  try {
    validateMock(req.body);
    const updated = service.updateMock(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

exports.deleteMock = (req, res, next) => {
  try {
    service.deleteMock(req.params.id);
    res.json({ message: 'Mock eliminado' });
  } catch (err) {
    next(err);
  }
};

exports.executeMock = (req, res) => {
  const mocks = service.getAllMocks();
  const matched = matcher.findMatch(req, mocks);

  if (!matched) return res.status(404).json({ error: 'No se encontró mock para esta solicitud' });

  const allParams = {
    ...req.query,
    ...req.body,
    ...req.headers
  };

  let response = matched.response;

  if (matched.conditions) {
    for (const cond of matched.conditions) {
      if (allParams[cond.param] === cond.value) {
        response = cond.response;
        break;
      }
    }
  }

  const rendered = renderTemplate(response, allParams);
  res.set('Content-Type', matched.contentType || 'application/json');
  res.status(matched.status || 200).send(rendered);
};
