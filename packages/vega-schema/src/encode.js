import {
  allOf, anyOf, oneOf, ref,
  array, def, object, pattern, required, type,
  booleanType, nullType, numberType, stringType, signalRef,
  numberValue
} from './util';

export const fontWeightEnum = [
  null, 'normal', 'bold', 'lighter', 'bolder',
  '100', '200', '300', '400', '500', '600', '700', '800', '900',
  100, 200, 300, 400, 500, 600, 700, 800, 900
];

export const alignEnum = ['left', 'right', 'center'];
export const baselineEnum = ['top', 'middle', 'bottom', 'alphabetic'];
export const anchorEnum = ['start', 'middle', 'end'];
export const areaOrientEnum = ['horizontal', 'vertical'];

export function valueSchema(type, nullable) {
  type = Array.isArray(type) ? {enum: type} : {type: type};

  var modType = type.type === 'number' ? 'number' : 'string',
      valueType = nullable ? oneOf(type, nullType) : type;

  var valueRef = allOf(
    ref(modType + 'Modifiers'),
    anyOf(
      oneOf(
        signalRef,
        object({_value_: valueType}, undefined),
        object({_field_: fieldRef}, undefined),
        object({_range_: oneOf(numberType, booleanType)}, undefined)
      ),
      required('scale', 'value'),
      required('scale', 'band'),
      required('offset')
    )
  );

  return oneOf(
    array(allOf(ruleRef, valueRef)),
    valueRef
  );
}

const ruleRef = def('rule');
const rule = object({
  test: stringType
}, undefined);

const fieldRef = ref('field');
const field = oneOf(
  stringType,
  signalRef,
  object({_datum_: fieldRef}),
  object({_group_: fieldRef, level: numberType}),
  object({_parent_: fieldRef, level: numberType})
);

const scaleRef = ref('scale');
const scale = fieldRef;

const stringModifiers = object({
  scale: scaleRef
}, undefined);

const numberModifiers = object({
  exponent: numberValue,
  mult: numberValue,
  offset: numberValue,
  round: type('boolean', {default: false}),
  scale: scaleRef,
  band: oneOf(numberType, booleanType),
  extra: booleanType
}, undefined);

const arrayValueRef = ref('arrayValue');
const booleanValueRef = ref('booleanValue');
const colorValueRef = ref('colorValue');
const numberValueRef = ref('numberValue');
const stringValueRef = ref('stringValue');

const colorRGB = object({
  _r_: numberValueRef,
  _g_: numberValueRef,
  _b_: numberValueRef
}, undefined);

const colorHSL = object({
  _h_: numberValueRef,
  _s_: numberValueRef,
  _l_: numberValueRef
}, undefined);

const colorLAB = object({
  _l_: numberValueRef,
  _a_: numberValueRef,
  _b_: numberValueRef
}, undefined);

const colorHCL = object({
  _h_: numberValueRef,
  _c_: numberValueRef,
  _l_: numberValueRef
}, undefined);

const colorValue = oneOf(
  ref('nullableStringValue'),
  object({_gradient_: scaleRef}),
  object({
    _color_: oneOf(
      ref('colorRGB'),
      ref('colorHSL'),
      ref('colorLAB'),
      ref('colorHCL')
    )
  })
);

const encodeEntryRef = def('encodeEntry');
const encodeEntry = object({
  // Common Properties
  x: numberValueRef,
  x2: numberValueRef,
  xc: numberValueRef,
  width: numberValueRef,
  y: numberValueRef,
  y2: numberValueRef,
  yc: numberValueRef,
  height: numberValueRef,
  opacity: numberValueRef,
  fill: colorValueRef,
  fillOpacity: numberValueRef,
  stroke: colorValueRef,
  strokeWidth: numberValueRef,
  strokeOpacity: numberValueRef,
  strokeDash: arrayValueRef,
  strokeDashOffset: numberValueRef,
  cursor: stringValueRef,

  // Group-mark properties
  clip: booleanValueRef,

  // Symbol-mark properties
  size: numberValueRef,
  shape: stringValueRef,

  // Path-mark properties
  path: stringValueRef,

  // Arc-mark properties
  innerRadius: numberValueRef,
  outerRadius: numberValueRef,
  startAngle: numberValueRef,
  endAngle: numberValueRef,

  // Area- and line-mark properties
  interpolate: stringValueRef,
  tension: numberValueRef,
  orient: ref('orientValue'),

  // Image-mark properties
  url: stringValueRef,
  align: ref('alignValue'),
  baseline: ref('baselineValue'),

  // Text-mark properties
  text: stringValueRef,
  dir: stringValueRef,
  ellipsis: stringValueRef,
  limit: numberValueRef,
  dx: numberValueRef,
  dy: numberValueRef,
  radius:numberValueRef,
  theta: numberValueRef,
  angle: numberValueRef,
  font: stringValueRef,
  fontSize: numberValueRef,
  fontWeight: ref('fontWeightValue'),
  fontStyle: stringValueRef
}, true);

const encode = pattern({
  '^.+$': encodeEntryRef
});

export default {
  refs: {
    field,
    scale,
    stringModifiers,
    numberModifiers,
    value: valueSchema({}, 'value'),
    numberValue: valueSchema('number'),
    stringValue: valueSchema('string'),
    booleanValue: valueSchema('boolean'),
    arrayValue: valueSchema('array'),
    nullableStringValue: valueSchema('string', true),
    fontWeightValue: valueSchema(fontWeightEnum),
    anchorValue: valueSchema(anchorEnum),
    alignValue: valueSchema(alignEnum),
    baselineValue: valueSchema(baselineEnum),
    orientValue: valueSchema(areaOrientEnum),
    colorRGB,
    colorHSL,
    colorLAB,
    colorHCL,
    colorValue
  },
  defs: {
    rule,
    encodeEntry,
    encode
  }
};
