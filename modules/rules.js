const _rules = [

  {
    id: "trimTitle",
    description: 'Trim "|" and anything after it from the metadata title',
    getPattern: () => /(title:.*)(\|.*)/,
    run: function(content) {
      return content.replace(this.getPattern(), "$1");
    }
  },

  {
    id: "removeDeprecatedMetadata",
    description: "Remove deprecated metadata (values defined in config)",
    getPattern: config => {
      const { deprecated } = config.metadata;
      const suffix = ":.*\n";
      const expression = deprecated.join(`${suffix}|`) + suffix;
      const regex = new RegExp(expression, "g");
      return regex;
    },
    run: function(content, config) {
      return content.replace(this.getPattern(config), "");
    }
  },

  {
    id: "updateManagerAlias",
    description: "Update manager alias (values defined in config)",
    getPattern: config => {
      const { manager } = config.metadata.replacements;
      return new RegExp(`manager: ?${manager.old}`);
    },
    run: function(content, config) {
      const { manager } = config.metadata.replacements;
      return content.replace(
        this.getPattern(config),
        `manager: ${manager.new}`
      );
    }
  }
];

const get = ruleName => {
  let rules;

  const runAllRules = !ruleName || /all/.test(ruleName);

  if (runAllRules) {
    rules = _rules;
  } else {
    rules = _rules.filter(r => r.id === ruleName);
  }

  return rules;
};

module.exports = { get };