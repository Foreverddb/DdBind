export const HTML_START_TAG_REG: RegExp = /^<([a-z][^\t\r\n\f />]*)/i
export const HTML_END_TAG_REG: RegExp = /^<\/([a-z][^\t\r\n\f />]*)/i
export const HTML_RAWTEXT_TAG_REG: RegExp = /style|xmp|iframe|noembed|noframes|noscript/
export const HTML_TAG_PROP_REG: RegExp = /^[^\t\r\n\f />][^\t\r\n\f/>=]*/
export const HTML_TAG_PROP_VALUE_WITHOUT_QUOTE: RegExp = /^[^\t\r\n\f >]+/
export const BLANK_CHAR_REG: RegExp = /^[\t\r\n\f ]+/
export const HTML_REFERENCE_HEAD_REG: RegExp = /&(?:#x?)?/i
export const ALPHABET_OR_NUMBER_REG: RegExp = /[0-9a-z]/i
export const HTML_REFERENCE_HEX_REG: RegExp = /^&#x([0-9a-f]+);?/i
export const HTML_REFERENCE_NUMBER_REG: RegExp = /^&#([0-9]+);?/