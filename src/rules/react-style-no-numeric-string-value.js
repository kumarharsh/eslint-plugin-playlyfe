// Rule to enforce https://github.com/facebook/react/issues/1357
const CSSProperty = {
  isInList: {
    alignContent: true,
    alignItems: true,
    alignSelf: true,
    all: true,
    animation: true,
    animationDelay: true,
    animationDirection: true,
    animationDuration: true,
    animationFillMode: true,
    animationIterationCount: true,
    animationName: true,
    animationPlayState: true,
    animationTimingFunction: true,
    backfaceVisibility: true,
    background: true,
    backgroundAttachment: true,
    backgroundBlendMode: true,
    backgroundClip: true,
    backgroundColor: true,
    backgroundImage: true,
    backgroundOrigin: true,
    backgroundPosition: true,
    backgroundRepeat: true,
    backgroundSize: true,
    border: true,
    borderBottom: true,
    borderBottomColor: true,
    borderBottomLeftRadius: true,
    borderBottomRightRadius: true,
    borderBottomStyle: true,
    borderBottomWidth: true,
    borderCollapse: true,
    borderColor: true,
    borderImage: true,
    borderImageOutset: true,
    borderImageRepeat: true,
    borderImageSlice: true,
    borderImageSource: true,
    borderImageWidth: true,
    borderLeft: true,
    borderLeftColor: true,
    borderLeftStyle: true,
    borderLeftWidth: true,
    borderRadius: true,
    borderRight: true,
    borderRightColor: true,
    borderRightStyle: true,
    borderRightWidth: true,
    borderSpacing: true,
    borderStyle: true,
    borderTop: true,
    borderTopColor: true,
    borderTopLeftRadius: true,
    borderTopRightRadius: true,
    borderTopStyle: true,
    borderTopWidth: true,
    borderWidth: true,
    bottom: true,
    boxShadow: true,
    boxSizing: true,
    captionSide: true,
    clear: true,
    clip: true,
    color: true,
    columnCount: true,
    columnFill: true,
    columnGap: true,
    columnRule: true,
    columnRuleColor: true,
    columnRuleStyle: true,
    columnRuleWidth: true,
    columnSpan: true,
    columnWidth: true,
    columns: true,
    content: true,
    counterIncrement: true,
    counterReset: true,
    cursor: true,
    direction: true,
    display: true,
    emptyCells: true,
    filter: true,
    flex: true,
    flexBasis: true,
    flexDirection: true,
    flexFlow: true,
    flexGrow: true,
    flexShrink: true,
    flexWrap: true,
    float: true,
    font: true,
    fontFace: true,
    fontFamily: true,
    fontSize: true,
    fontSizeAdjust: true,
    fontStretch: true,
    fontStyle: true,
    fontVariant: true,
    fontWeight: true,
    hangingPunctuation: true,
    height: true,
    justifyContent: true,
    keyframes: true,
    left: true,
    letterSpacing: true,
    lineHeight: true,
    listStyle: true,
    listStyleImage: true,
    listStylePosition: true,
    listStyleType: true,
    margin: true,
    marginBottom: true,
    marginLeft: true,
    marginRight: true,
    marginTop: true,
    maxHeight: true,
    maxWidth: true,
    media: true,
    minHeight: true,
    minWidth: true,
    navDown: true,
    navIndex: true,
    navLeft: true,
    navRight: true,
    navUp: true,
    opacity: true,
    order: true,
    outline: true,
    outlineColor: true,
    outlineOffset: true,
    outlineStyle: true,
    outlineWidth: true,
    overflow: true,
    overflowX: true,
    overflowY: true,
    padding: true,
    paddingBottom: true,
    paddingLeft: true,
    paddingRight: true,
    paddingTop: true,
    pageBreakAfter: true,
    pageBreakBefore: true,
    pageBreakInside: true,
    perspective: true,
    perspectiveOrigin: true,
    position: true,
    quotes: true,
    resize: true,
    right: true,
    tabSize: true,
    tableLayout: true,
    textAlign: true,
    textAlignLast: true,
    textDecoration: true,
    textDecorationColor: true,
    textDecorationLine: true,
    textDecorationStyle: true,
    textIndent: true,
    textJustify: true,
    textOverflow: true,
    textShadow: true,
    textTransform: true,
    top: true,
    transform: true,
    transformOrigin: true,
    transformStyle: true,
    transition: true,
    transitionDelay: true,
    transitionDuration: true,
    transitionProperty: true,
    transitionTimingFunction: true,
    unicodeBidi: true,
    verticalAlign: true,
    visibility: true,
    whiteSpace: true,
    width: true,
    wordBreak: true,
    wordSpacing: true,
    wordWrap: true,
    zIndex: true
  },

  // Note: copied from react/CSSProperty
  isUnitlessNumber: {
    animationIterationCount: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridRow: true,
    gridColumn: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,

    // SVG-related properties
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true,
  },
}

function errorMessage({property, rawValue, fixedRawValue}) {
  return `use ${fixedRawValue} (not ${rawValue}). '${property}' value = ${rawValue} is numeric string value which react(v15) will treat as a unitless number.`;
}

function toRaw(value) {
  if (typeof value === 'number') { return `${value}`; }
  if (typeof value === 'string') { return `'${value}'`; }
  return value;
}


module.exports = (context) => {
  //--------------------------------------------------------------------------
  // Public
  //--------------------------------------------------------------------------
  return {
    Property(node) {
      if (node.value.type !== 'Literal') { return; }
      const name = node.key.name;
      const value = node.value.value;

      if (!CSSProperty.isInList[name] || CSSProperty.isUnitlessNumber[name]) { return; }

      const isEmpty = value == null || typeof value === 'boolean' || value === '';
      if (isEmpty) { return; }

      const isNonNumeric = isNaN(value);
      if (isNonNumeric || value === 0) { return; }

      if (typeof value !== 'string') { return; }

      const numericValue = parseInt(value);
      let fixedRawValue = toRaw(numericValue === 0 ? 0 : `${numericValue}px`);

      // numeric string value
      context.report({
        message: errorMessage({property: name, rawValue: node.value.raw, fixedRawValue }),
        node: node.value,
        fix(fixer) {
          return fixer.replaceText(node.value, fixedRawValue);
        },
      });
    },
  };
};

module.exports.meta = {
  fixable: "code",
};

module.exports.errorMessage = errorMessage;
