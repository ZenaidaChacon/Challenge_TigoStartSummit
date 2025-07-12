
module.exports = (template, variables) => {
  if (typeof template !== 'string') return template;

  return template.replace(/{{\s*([\w]+)\s*}}/g, (_, key) => {
    return variables[key] !== undefined ? variables[key] : '';
  });
};
