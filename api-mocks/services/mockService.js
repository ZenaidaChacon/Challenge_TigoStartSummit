const fs = require('fs');
const path = require('path');
const FILE = path.join(__dirname, '../data/mocks.json');

function readMocks() {
  try {
    const data = fs.readFileSync(FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

function writeMocks(mocks) {
  fs.writeFileSync(FILE, JSON.stringify(mocks, null, 2), 'utf8');
}

exports.getAllMocks = () => readMocks();

exports.addMock = (mock) => {
  const mocks = readMocks();
  mock.id = Date.now().toString();
  mocks.push(mock);
  writeMocks(mocks);
  return mock;
};

exports.updateMock = (id, newMock) => {
  const mocks = readMocks();
  const idx = mocks.findIndex(m => m.id === id);
  if (idx === -1) throw new Error('Mock no encontrado');
  newMock.id = id;
  mocks[idx] = newMock;
  writeMocks(mocks);
  return newMock;
};

exports.deleteMock = (id) => {
  const mocks = readMocks();
  const updated = mocks.filter(m => m.id !== id);
  if (updated.length === mocks.length) throw new Error('Mock no encontrado');
  writeMocks(updated);
};
