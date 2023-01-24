/*!
 * ddb's mvvm-learning-framework 
 * ddbind framework as a temporary name 
 * for Baidu's courses
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.DdBind = {}));
})(this, (function (exports) { 'use strict';

    var warn;
    var error;
    {
        warn = function (msg, source) {
            console.warn("[DdBind-warn]: at ".concat(source, " \n ").concat(msg));
        };
        error = function (msg, source) {
            console.error("[DdBind-error]: at ".concat(source, " \n ").concat(msg));
        };
    }

    var HTML_START_TAG_REG = /^<([a-z][^\t\r\n\f />]*)/i;
    var HTML_END_TAG_REG = /^<\/([a-z][^\t\r\n\f />]*)/i;
    var HTML_RAWTEXT_TAG_REG = /style|xmp|iframe|noembed|noframes|noscript/;
    var HTML_TAG_PROP_REG = /^[^\t\r\n\f />][^\t\r\n\f/>=]*/;
    var HTML_TAG_PROP_VALUE_WITHOUT_QUOTE = /^[^\t\r\n\f >]+/;
    var BLANK_CHAR_REG = /^[\t\r\n\f ]+/;
    var HTML_REFERENCE_HEAD_REG = /&(?:#x?)?/i;
    var ALPHABET_OR_NUMBER_REG = /[0-9a-z]/i;
    var HTML_REFERENCE_HEX_REG = /^&#x([0-9a-f]+);?/i;
    var HTML_REFERENCE_NUMBER_REG = /^&#([0-9]+);?/;

    var selfClosingTags = [
        'meta',
        'base',
        'br',
        'hr',
        'img',
        'input',
        'col',
        'frame',
        'link',
        'area',
        'param',
        'embed',
        'keygen',
        'source'
    ];
    var decodeMapKeyMaxLen = 31;
    var CCR_REPLACEMENTS = {
        0x80: 0x20ac,
        0x82: 0x201a,
        0x83: 0x0192,
        0x84: 0x201e,
        0x85: 0x2026,
        0x86: 0x2020,
        0x87: 0x2021,
        0x88: 0x02c6,
        0x89: 0x2030,
        0x8a: 0x0160,
        0x8b: 0x2039,
        0x8c: 0x0152,
        0x8e: 0x017d,
        0x91: 0x2018,
        0x92: 0x2019,
        0x93: 0x201c,
        0x94: 0x201d,
        0x95: 0x2022,
        0x96: 0x2013,
        0x97: 0x2014,
        0x98: 0x02dc,
        0x99: 0x2122,
        0x9a: 0x0161,
        0x9b: 0x203a,
        0x9c: 0x0153,
        0x9e: 0x017e,
        0x9f: 0x0178
    };
    var decodeMap = {
        'aacute': '\xE1',
        'Aacute': '\xC1',
        'abreve': '\u0103',
        'Abreve': '\u0102',
        'ac': '\u223E',
        'acd': '\u223F',
        'acE': '\u223E\u0333',
        'acirc': '\xE2',
        'Acirc': '\xC2',
        'acute': '\xB4',
        'acy': '\u0430',
        'Acy': '\u0410',
        'aelig': '\xE6',
        'AElig': '\xC6',
        'af': '\u2061',
        'afr': '\uD835\uDD1E',
        'Afr': '\uD835\uDD04',
        'agrave': '\xE0',
        'Agrave': '\xC0',
        'alefsym': '\u2135',
        'aleph': '\u2135',
        'alpha': '\u03B1',
        'Alpha': '\u0391',
        'amacr': '\u0101',
        'Amacr': '\u0100',
        'amalg': '\u2A3F',
        'amp': '&',
        'AMP': '&',
        'and': '\u2227',
        'And': '\u2A53',
        'andand': '\u2A55',
        'andd': '\u2A5C',
        'andslope': '\u2A58',
        'andv': '\u2A5A',
        'ang': '\u2220',
        'ange': '\u29A4',
        'angle': '\u2220',
        'angmsd': '\u2221',
        'angmsdaa': '\u29A8',
        'angmsdab': '\u29A9',
        'angmsdac': '\u29AA',
        'angmsdad': '\u29AB',
        'angmsdae': '\u29AC',
        'angmsdaf': '\u29AD',
        'angmsdag': '\u29AE',
        'angmsdah': '\u29AF',
        'angrt': '\u221F',
        'angrtvb': '\u22BE',
        'angrtvbd': '\u299D',
        'angsph': '\u2222',
        'angst': '\xC5',
        'angzarr': '\u237C',
        'aogon': '\u0105',
        'Aogon': '\u0104',
        'aopf': '\uD835\uDD52',
        'Aopf': '\uD835\uDD38',
        'ap': '\u2248',
        'apacir': '\u2A6F',
        'ape': '\u224A',
        'apE': '\u2A70',
        'apid': '\u224B',
        'apos': '\'',
        'ApplyFunction': '\u2061',
        'approx': '\u2248',
        'approxeq': '\u224A',
        'aring': '\xE5',
        'Aring': '\xC5',
        'ascr': '\uD835\uDCB6',
        'Ascr': '\uD835\uDC9C',
        'Assign': '\u2254',
        'ast': '*',
        'asymp': '\u2248',
        'asympeq': '\u224D',
        'atilde': '\xE3',
        'Atilde': '\xC3',
        'auml': '\xE4',
        'Auml': '\xC4',
        'awconint': '\u2233',
        'awint': '\u2A11',
        'backcong': '\u224C',
        'backepsilon': '\u03F6',
        'backprime': '\u2035',
        'backsim': '\u223D',
        'backsimeq': '\u22CD',
        'Backslash': '\u2216',
        'Barv': '\u2AE7',
        'barvee': '\u22BD',
        'barwed': '\u2305',
        'Barwed': '\u2306',
        'barwedge': '\u2305',
        'bbrk': '\u23B5',
        'bbrktbrk': '\u23B6',
        'bcong': '\u224C',
        'bcy': '\u0431',
        'Bcy': '\u0411',
        'bdquo': '\u201E',
        'becaus': '\u2235',
        'because': '\u2235',
        'Because': '\u2235',
        'bemptyv': '\u29B0',
        'bepsi': '\u03F6',
        'bernou': '\u212C',
        'Bernoullis': '\u212C',
        'beta': '\u03B2',
        'Beta': '\u0392',
        'beth': '\u2136',
        'between': '\u226C',
        'bfr': '\uD835\uDD1F',
        'Bfr': '\uD835\uDD05',
        'bigcap': '\u22C2',
        'bigcirc': '\u25EF',
        'bigcup': '\u22C3',
        'bigodot': '\u2A00',
        'bigoplus': '\u2A01',
        'bigotimes': '\u2A02',
        'bigsqcup': '\u2A06',
        'bigstar': '\u2605',
        'bigtriangledown': '\u25BD',
        'bigtriangleup': '\u25B3',
        'biguplus': '\u2A04',
        'bigvee': '\u22C1',
        'bigwedge': '\u22C0',
        'bkarow': '\u290D',
        'blacklozenge': '\u29EB',
        'blacksquare': '\u25AA',
        'blacktriangle': '\u25B4',
        'blacktriangledown': '\u25BE',
        'blacktriangleleft': '\u25C2',
        'blacktriangleright': '\u25B8',
        'blank': '\u2423',
        'blk12': '\u2592',
        'blk14': '\u2591',
        'blk34': '\u2593',
        'block': '\u2588',
        'bne': '=\u20E5',
        'bnequiv': '\u2261\u20E5',
        'bnot': '\u2310',
        'bNot': '\u2AED',
        'bopf': '\uD835\uDD53',
        'Bopf': '\uD835\uDD39',
        'bot': '\u22A5',
        'bottom': '\u22A5',
        'bowtie': '\u22C8',
        'boxbox': '\u29C9',
        'boxdl': '\u2510',
        'boxdL': '\u2555',
        'boxDl': '\u2556',
        'boxDL': '\u2557',
        'boxdr': '\u250C',
        'boxdR': '\u2552',
        'boxDr': '\u2553',
        'boxDR': '\u2554',
        'boxh': '\u2500',
        'boxH': '\u2550',
        'boxhd': '\u252C',
        'boxhD': '\u2565',
        'boxHd': '\u2564',
        'boxHD': '\u2566',
        'boxhu': '\u2534',
        'boxhU': '\u2568',
        'boxHu': '\u2567',
        'boxHU': '\u2569',
        'boxminus': '\u229F',
        'boxplus': '\u229E',
        'boxtimes': '\u22A0',
        'boxul': '\u2518',
        'boxuL': '\u255B',
        'boxUl': '\u255C',
        'boxUL': '\u255D',
        'boxur': '\u2514',
        'boxuR': '\u2558',
        'boxUr': '\u2559',
        'boxUR': '\u255A',
        'boxv': '\u2502',
        'boxV': '\u2551',
        'boxvh': '\u253C',
        'boxvH': '\u256A',
        'boxVh': '\u256B',
        'boxVH': '\u256C',
        'boxvl': '\u2524',
        'boxvL': '\u2561',
        'boxVl': '\u2562',
        'boxVL': '\u2563',
        'boxvr': '\u251C',
        'boxvR': '\u255E',
        'boxVr': '\u255F',
        'boxVR': '\u2560',
        'bprime': '\u2035',
        'breve': '\u02D8',
        'Breve': '\u02D8',
        'brvbar': '\xA6',
        'bscr': '\uD835\uDCB7',
        'Bscr': '\u212C',
        'bsemi': '\u204F',
        'bsim': '\u223D',
        'bsime': '\u22CD',
        'bsol': '\\',
        'bsolb': '\u29C5',
        'bsolhsub': '\u27C8',
        'bull': '\u2022',
        'bullet': '\u2022',
        'bump': '\u224E',
        'bumpe': '\u224F',
        'bumpE': '\u2AAE',
        'bumpeq': '\u224F',
        'Bumpeq': '\u224E',
        'cacute': '\u0107',
        'Cacute': '\u0106',
        'cap': '\u2229',
        'Cap': '\u22D2',
        'capand': '\u2A44',
        'capbrcup': '\u2A49',
        'capcap': '\u2A4B',
        'capcup': '\u2A47',
        'capdot': '\u2A40',
        'CapitalDifferentialD': '\u2145',
        'caps': '\u2229\uFE00',
        'caret': '\u2041',
        'caron': '\u02C7',
        'Cayleys': '\u212D',
        'ccaps': '\u2A4D',
        'ccaron': '\u010D',
        'Ccaron': '\u010C',
        'ccedil': '\xE7',
        'Ccedil': '\xC7',
        'ccirc': '\u0109',
        'Ccirc': '\u0108',
        'Cconint': '\u2230',
        'ccups': '\u2A4C',
        'ccupssm': '\u2A50',
        'cdot': '\u010B',
        'Cdot': '\u010A',
        'cedil': '\xB8',
        'Cedilla': '\xB8',
        'cemptyv': '\u29B2',
        'cent': '\xA2',
        'centerdot': '\xB7',
        'CenterDot': '\xB7',
        'cfr': '\uD835\uDD20',
        'Cfr': '\u212D',
        'chcy': '\u0447',
        'CHcy': '\u0427',
        'check': '\u2713',
        'checkmark': '\u2713',
        'chi': '\u03C7',
        'Chi': '\u03A7',
        'cir': '\u25CB',
        'circ': '\u02C6',
        'circeq': '\u2257',
        'circlearrowleft': '\u21BA',
        'circlearrowright': '\u21BB',
        'circledast': '\u229B',
        'circledcirc': '\u229A',
        'circleddash': '\u229D',
        'CircleDot': '\u2299',
        'circledR': '\xAE',
        'circledS': '\u24C8',
        'CircleMinus': '\u2296',
        'CirclePlus': '\u2295',
        'CircleTimes': '\u2297',
        'cire': '\u2257',
        'cirE': '\u29C3',
        'cirfnint': '\u2A10',
        'cirmid': '\u2AEF',
        'cirscir': '\u29C2',
        'ClockwiseContourIntegral': '\u2232',
        'CloseCurlyDoubleQuote': '\u201D',
        'CloseCurlyQuote': '\u2019',
        'clubs': '\u2663',
        'clubsuit': '\u2663',
        'colon': ':',
        'Colon': '\u2237',
        'colone': '\u2254',
        'Colone': '\u2A74',
        'coloneq': '\u2254',
        'comma': ',',
        'commat': '@',
        'comp': '\u2201',
        'compfn': '\u2218',
        'complement': '\u2201',
        'complexes': '\u2102',
        'cong': '\u2245',
        'congdot': '\u2A6D',
        'Congruent': '\u2261',
        'conint': '\u222E',
        'Conint': '\u222F',
        'ContourIntegral': '\u222E',
        'copf': '\uD835\uDD54',
        'Copf': '\u2102',
        'coprod': '\u2210',
        'Coproduct': '\u2210',
        'copy': '\xA9',
        'COPY': '\xA9',
        'copysr': '\u2117',
        'CounterClockwiseContourIntegral': '\u2233',
        'crarr': '\u21B5',
        'cross': '\u2717',
        'Cross': '\u2A2F',
        'cscr': '\uD835\uDCB8',
        'Cscr': '\uD835\uDC9E',
        'csub': '\u2ACF',
        'csube': '\u2AD1',
        'csup': '\u2AD0',
        'csupe': '\u2AD2',
        'ctdot': '\u22EF',
        'cudarrl': '\u2938',
        'cudarrr': '\u2935',
        'cuepr': '\u22DE',
        'cuesc': '\u22DF',
        'cularr': '\u21B6',
        'cularrp': '\u293D',
        'cup': '\u222A',
        'Cup': '\u22D3',
        'cupbrcap': '\u2A48',
        'cupcap': '\u2A46',
        'CupCap': '\u224D',
        'cupcup': '\u2A4A',
        'cupdot': '\u228D',
        'cupor': '\u2A45',
        'cups': '\u222A\uFE00',
        'curarr': '\u21B7',
        'curarrm': '\u293C',
        'curlyeqprec': '\u22DE',
        'curlyeqsucc': '\u22DF',
        'curlyvee': '\u22CE',
        'curlywedge': '\u22CF',
        'curren': '\xA4',
        'curvearrowleft': '\u21B6',
        'curvearrowright': '\u21B7',
        'cuvee': '\u22CE',
        'cuwed': '\u22CF',
        'cwconint': '\u2232',
        'cwint': '\u2231',
        'cylcty': '\u232D',
        'dagger': '\u2020',
        'Dagger': '\u2021',
        'daleth': '\u2138',
        'darr': '\u2193',
        'dArr': '\u21D3',
        'Darr': '\u21A1',
        'dash': '\u2010',
        'dashv': '\u22A3',
        'Dashv': '\u2AE4',
        'dbkarow': '\u290F',
        'dblac': '\u02DD',
        'dcaron': '\u010F',
        'Dcaron': '\u010E',
        'dcy': '\u0434',
        'Dcy': '\u0414',
        'dd': '\u2146',
        'DD': '\u2145',
        'ddagger': '\u2021',
        'ddarr': '\u21CA',
        'DDotrahd': '\u2911',
        'ddotseq': '\u2A77',
        'deg': '\xB0',
        'Del': '\u2207',
        'delta': '\u03B4',
        'Delta': '\u0394',
        'demptyv': '\u29B1',
        'dfisht': '\u297F',
        'dfr': '\uD835\uDD21',
        'Dfr': '\uD835\uDD07',
        'dHar': '\u2965',
        'dharl': '\u21C3',
        'dharr': '\u21C2',
        'DiacriticalAcute': '\xB4',
        'DiacriticalDot': '\u02D9',
        'DiacriticalDoubleAcute': '\u02DD',
        'DiacriticalGrave': '`',
        'DiacriticalTilde': '\u02DC',
        'diam': '\u22C4',
        'diamond': '\u22C4',
        'Diamond': '\u22C4',
        'diamondsuit': '\u2666',
        'diams': '\u2666',
        'die': '\xA8',
        'DifferentialD': '\u2146',
        'digamma': '\u03DD',
        'disin': '\u22F2',
        'div': '\xF7',
        'divide': '\xF7',
        'divideontimes': '\u22C7',
        'divonx': '\u22C7',
        'djcy': '\u0452',
        'DJcy': '\u0402',
        'dlcorn': '\u231E',
        'dlcrop': '\u230D',
        'dollar': '$',
        'dopf': '\uD835\uDD55',
        'Dopf': '\uD835\uDD3B',
        'dot': '\u02D9',
        'Dot': '\xA8',
        'DotDot': '\u20DC',
        'doteq': '\u2250',
        'doteqdot': '\u2251',
        'DotEqual': '\u2250',
        'dotminus': '\u2238',
        'dotplus': '\u2214',
        'dotsquare': '\u22A1',
        'doublebarwedge': '\u2306',
        'DoubleContourIntegral': '\u222F',
        'DoubleDot': '\xA8',
        'DoubleDownArrow': '\u21D3',
        'DoubleLeftArrow': '\u21D0',
        'DoubleLeftRightArrow': '\u21D4',
        'DoubleLeftTee': '\u2AE4',
        'DoubleLongLeftArrow': '\u27F8',
        'DoubleLongLeftRightArrow': '\u27FA',
        'DoubleLongRightArrow': '\u27F9',
        'DoubleRightArrow': '\u21D2',
        'DoubleRightTee': '\u22A8',
        'DoubleUpArrow': '\u21D1',
        'DoubleUpDownArrow': '\u21D5',
        'DoubleVerticalBar': '\u2225',
        'downarrow': '\u2193',
        'Downarrow': '\u21D3',
        'DownArrow': '\u2193',
        'DownArrowBar': '\u2913',
        'DownArrowUpArrow': '\u21F5',
        'DownBreve': '\u0311',
        'downdownarrows': '\u21CA',
        'downharpoonleft': '\u21C3',
        'downharpoonright': '\u21C2',
        'DownLeftRightVector': '\u2950',
        'DownLeftTeeVector': '\u295E',
        'DownLeftVector': '\u21BD',
        'DownLeftVectorBar': '\u2956',
        'DownRightTeeVector': '\u295F',
        'DownRightVector': '\u21C1',
        'DownRightVectorBar': '\u2957',
        'DownTee': '\u22A4',
        'DownTeeArrow': '\u21A7',
        'drbkarow': '\u2910',
        'drcorn': '\u231F',
        'drcrop': '\u230C',
        'dscr': '\uD835\uDCB9',
        'Dscr': '\uD835\uDC9F',
        'dscy': '\u0455',
        'DScy': '\u0405',
        'dsol': '\u29F6',
        'dstrok': '\u0111',
        'Dstrok': '\u0110',
        'dtdot': '\u22F1',
        'dtri': '\u25BF',
        'dtrif': '\u25BE',
        'duarr': '\u21F5',
        'duhar': '\u296F',
        'dwangle': '\u29A6',
        'dzcy': '\u045F',
        'DZcy': '\u040F',
        'dzigrarr': '\u27FF',
        'eacute': '\xE9',
        'Eacute': '\xC9',
        'easter': '\u2A6E',
        'ecaron': '\u011B',
        'Ecaron': '\u011A',
        'ecir': '\u2256',
        'ecirc': '\xEA',
        'Ecirc': '\xCA',
        'ecolon': '\u2255',
        'ecy': '\u044D',
        'Ecy': '\u042D',
        'eDDot': '\u2A77',
        'edot': '\u0117',
        'eDot': '\u2251',
        'Edot': '\u0116',
        'ee': '\u2147',
        'efDot': '\u2252',
        'efr': '\uD835\uDD22',
        'Efr': '\uD835\uDD08',
        'eg': '\u2A9A',
        'egrave': '\xE8',
        'Egrave': '\xC8',
        'egs': '\u2A96',
        'egsdot': '\u2A98',
        'el': '\u2A99',
        'Element': '\u2208',
        'elinters': '\u23E7',
        'ell': '\u2113',
        'els': '\u2A95',
        'elsdot': '\u2A97',
        'emacr': '\u0113',
        'Emacr': '\u0112',
        'empty': '\u2205',
        'emptyset': '\u2205',
        'EmptySmallSquare': '\u25FB',
        'emptyv': '\u2205',
        'EmptyVerySmallSquare': '\u25AB',
        'emsp': '\u2003',
        'emsp13': '\u2004',
        'emsp14': '\u2005',
        'eng': '\u014B',
        'ENG': '\u014A',
        'ensp': '\u2002',
        'eogon': '\u0119',
        'Eogon': '\u0118',
        'eopf': '\uD835\uDD56',
        'Eopf': '\uD835\uDD3C',
        'epar': '\u22D5',
        'eparsl': '\u29E3',
        'eplus': '\u2A71',
        'epsi': '\u03B5',
        'epsilon': '\u03B5',
        'Epsilon': '\u0395',
        'epsiv': '\u03F5',
        'eqcirc': '\u2256',
        'eqcolon': '\u2255',
        'eqsim': '\u2242',
        'eqslantgtr': '\u2A96',
        'eqslantless': '\u2A95',
        'Equal': '\u2A75',
        'equals': '=',
        'EqualTilde': '\u2242',
        'equest': '\u225F',
        'Equilibrium': '\u21CC',
        'equiv': '\u2261',
        'equivDD': '\u2A78',
        'eqvparsl': '\u29E5',
        'erarr': '\u2971',
        'erDot': '\u2253',
        'escr': '\u212F',
        'Escr': '\u2130',
        'esdot': '\u2250',
        'esim': '\u2242',
        'Esim': '\u2A73',
        'eta': '\u03B7',
        'Eta': '\u0397',
        'eth': '\xF0',
        'ETH': '\xD0',
        'euml': '\xEB',
        'Euml': '\xCB',
        'euro': '\u20AC',
        'excl': '!',
        'exist': '\u2203',
        'Exists': '\u2203',
        'expectation': '\u2130',
        'exponentiale': '\u2147',
        'ExponentialE': '\u2147',
        'fallingdotseq': '\u2252',
        'fcy': '\u0444',
        'Fcy': '\u0424',
        'female': '\u2640',
        'ffilig': '\uFB03',
        'fflig': '\uFB00',
        'ffllig': '\uFB04',
        'ffr': '\uD835\uDD23',
        'Ffr': '\uD835\uDD09',
        'filig': '\uFB01',
        'FilledSmallSquare': '\u25FC',
        'FilledVerySmallSquare': '\u25AA',
        'fjlig': 'fj',
        'flat': '\u266D',
        'fllig': '\uFB02',
        'fltns': '\u25B1',
        'fnof': '\u0192',
        'fopf': '\uD835\uDD57',
        'Fopf': '\uD835\uDD3D',
        'forall': '\u2200',
        'ForAll': '\u2200',
        'fork': '\u22D4',
        'forkv': '\u2AD9',
        'Fouriertrf': '\u2131',
        'fpartint': '\u2A0D',
        'frac12': '\xBD',
        'frac13': '\u2153',
        'frac14': '\xBC',
        'frac15': '\u2155',
        'frac16': '\u2159',
        'frac18': '\u215B',
        'frac23': '\u2154',
        'frac25': '\u2156',
        'frac34': '\xBE',
        'frac35': '\u2157',
        'frac38': '\u215C',
        'frac45': '\u2158',
        'frac56': '\u215A',
        'frac58': '\u215D',
        'frac78': '\u215E',
        'frasl': '\u2044',
        'frown': '\u2322',
        'fscr': '\uD835\uDCBB',
        'Fscr': '\u2131',
        'gacute': '\u01F5',
        'gamma': '\u03B3',
        'Gamma': '\u0393',
        'gammad': '\u03DD',
        'Gammad': '\u03DC',
        'gap': '\u2A86',
        'gbreve': '\u011F',
        'Gbreve': '\u011E',
        'Gcedil': '\u0122',
        'gcirc': '\u011D',
        'Gcirc': '\u011C',
        'gcy': '\u0433',
        'Gcy': '\u0413',
        'gdot': '\u0121',
        'Gdot': '\u0120',
        'ge': '\u2265',
        'gE': '\u2267',
        'gel': '\u22DB',
        'gEl': '\u2A8C',
        'geq': '\u2265',
        'geqq': '\u2267',
        'geqslant': '\u2A7E',
        'ges': '\u2A7E',
        'gescc': '\u2AA9',
        'gesdot': '\u2A80',
        'gesdoto': '\u2A82',
        'gesdotol': '\u2A84',
        'gesl': '\u22DB\uFE00',
        'gesles': '\u2A94',
        'gfr': '\uD835\uDD24',
        'Gfr': '\uD835\uDD0A',
        'gg': '\u226B',
        'Gg': '\u22D9',
        'ggg': '\u22D9',
        'gimel': '\u2137',
        'gjcy': '\u0453',
        'GJcy': '\u0403',
        'gl': '\u2277',
        'gla': '\u2AA5',
        'glE': '\u2A92',
        'glj': '\u2AA4',
        'gnap': '\u2A8A',
        'gnapprox': '\u2A8A',
        'gne': '\u2A88',
        'gnE': '\u2269',
        'gneq': '\u2A88',
        'gneqq': '\u2269',
        'gnsim': '\u22E7',
        'gopf': '\uD835\uDD58',
        'Gopf': '\uD835\uDD3E',
        'grave': '`',
        'GreaterEqual': '\u2265',
        'GreaterEqualLess': '\u22DB',
        'GreaterFullEqual': '\u2267',
        'GreaterGreater': '\u2AA2',
        'GreaterLess': '\u2277',
        'GreaterSlantEqual': '\u2A7E',
        'GreaterTilde': '\u2273',
        'gscr': '\u210A',
        'Gscr': '\uD835\uDCA2',
        'gsim': '\u2273',
        'gsime': '\u2A8E',
        'gsiml': '\u2A90',
        'gt': '>',
        'Gt': '\u226B',
        'GT': '>',
        'gtcc': '\u2AA7',
        'gtcir': '\u2A7A',
        'gtdot': '\u22D7',
        'gtlPar': '\u2995',
        'gtquest': '\u2A7C',
        'gtrapprox': '\u2A86',
        'gtrarr': '\u2978',
        'gtrdot': '\u22D7',
        'gtreqless': '\u22DB',
        'gtreqqless': '\u2A8C',
        'gtrless': '\u2277',
        'gtrsim': '\u2273',
        'gvertneqq': '\u2269\uFE00',
        'gvnE': '\u2269\uFE00',
        'Hacek': '\u02C7',
        'hairsp': '\u200A',
        'half': '\xBD',
        'hamilt': '\u210B',
        'hardcy': '\u044A',
        'HARDcy': '\u042A',
        'harr': '\u2194',
        'hArr': '\u21D4',
        'harrcir': '\u2948',
        'harrw': '\u21AD',
        'Hat': '^',
        'hbar': '\u210F',
        'hcirc': '\u0125',
        'Hcirc': '\u0124',
        'hearts': '\u2665',
        'heartsuit': '\u2665',
        'hellip': '\u2026',
        'hercon': '\u22B9',
        'hfr': '\uD835\uDD25',
        'Hfr': '\u210C',
        'HilbertSpace': '\u210B',
        'hksearow': '\u2925',
        'hkswarow': '\u2926',
        'hoarr': '\u21FF',
        'homtht': '\u223B',
        'hookleftarrow': '\u21A9',
        'hookrightarrow': '\u21AA',
        'hopf': '\uD835\uDD59',
        'Hopf': '\u210D',
        'horbar': '\u2015',
        'HorizontalLine': '\u2500',
        'hscr': '\uD835\uDCBD',
        'Hscr': '\u210B',
        'hslash': '\u210F',
        'hstrok': '\u0127',
        'Hstrok': '\u0126',
        'HumpDownHump': '\u224E',
        'HumpEqual': '\u224F',
        'hybull': '\u2043',
        'hyphen': '\u2010',
        'iacute': '\xED',
        'Iacute': '\xCD',
        'ic': '\u2063',
        'icirc': '\xEE',
        'Icirc': '\xCE',
        'icy': '\u0438',
        'Icy': '\u0418',
        'Idot': '\u0130',
        'iecy': '\u0435',
        'IEcy': '\u0415',
        'iexcl': '\xA1',
        'iff': '\u21D4',
        'ifr': '\uD835\uDD26',
        'Ifr': '\u2111',
        'igrave': '\xEC',
        'Igrave': '\xCC',
        'ii': '\u2148',
        'iiiint': '\u2A0C',
        'iiint': '\u222D',
        'iinfin': '\u29DC',
        'iiota': '\u2129',
        'ijlig': '\u0133',
        'IJlig': '\u0132',
        'Im': '\u2111',
        'imacr': '\u012B',
        'Imacr': '\u012A',
        'image': '\u2111',
        'ImaginaryI': '\u2148',
        'imagline': '\u2110',
        'imagpart': '\u2111',
        'imath': '\u0131',
        'imof': '\u22B7',
        'imped': '\u01B5',
        'Implies': '\u21D2',
        'in': '\u2208',
        'incare': '\u2105',
        'infin': '\u221E',
        'infintie': '\u29DD',
        'inodot': '\u0131',
        'int': '\u222B',
        'Int': '\u222C',
        'intcal': '\u22BA',
        'integers': '\u2124',
        'Integral': '\u222B',
        'intercal': '\u22BA',
        'Intersection': '\u22C2',
        'intlarhk': '\u2A17',
        'intprod': '\u2A3C',
        'InvisibleComma': '\u2063',
        'InvisibleTimes': '\u2062',
        'iocy': '\u0451',
        'IOcy': '\u0401',
        'iogon': '\u012F',
        'Iogon': '\u012E',
        'iopf': '\uD835\uDD5A',
        'Iopf': '\uD835\uDD40',
        'iota': '\u03B9',
        'Iota': '\u0399',
        'iprod': '\u2A3C',
        'iquest': '\xBF',
        'iscr': '\uD835\uDCBE',
        'Iscr': '\u2110',
        'isin': '\u2208',
        'isindot': '\u22F5',
        'isinE': '\u22F9',
        'isins': '\u22F4',
        'isinsv': '\u22F3',
        'isinv': '\u2208',
        'it': '\u2062',
        'itilde': '\u0129',
        'Itilde': '\u0128',
        'iukcy': '\u0456',
        'Iukcy': '\u0406',
        'iuml': '\xEF',
        'Iuml': '\xCF',
        'jcirc': '\u0135',
        'Jcirc': '\u0134',
        'jcy': '\u0439',
        'Jcy': '\u0419',
        'jfr': '\uD835\uDD27',
        'Jfr': '\uD835\uDD0D',
        'jmath': '\u0237',
        'jopf': '\uD835\uDD5B',
        'Jopf': '\uD835\uDD41',
        'jscr': '\uD835\uDCBF',
        'Jscr': '\uD835\uDCA5',
        'jsercy': '\u0458',
        'Jsercy': '\u0408',
        'jukcy': '\u0454',
        'Jukcy': '\u0404',
        'kappa': '\u03BA',
        'Kappa': '\u039A',
        'kappav': '\u03F0',
        'kcedil': '\u0137',
        'Kcedil': '\u0136',
        'kcy': '\u043A',
        'Kcy': '\u041A',
        'kfr': '\uD835\uDD28',
        'Kfr': '\uD835\uDD0E',
        'kgreen': '\u0138',
        'khcy': '\u0445',
        'KHcy': '\u0425',
        'kjcy': '\u045C',
        'KJcy': '\u040C',
        'kopf': '\uD835\uDD5C',
        'Kopf': '\uD835\uDD42',
        'kscr': '\uD835\uDCC0',
        'Kscr': '\uD835\uDCA6',
        'lAarr': '\u21DA',
        'lacute': '\u013A',
        'Lacute': '\u0139',
        'laemptyv': '\u29B4',
        'lagran': '\u2112',
        'lambda': '\u03BB',
        'Lambda': '\u039B',
        'lang': '\u27E8',
        'Lang': '\u27EA',
        'langd': '\u2991',
        'langle': '\u27E8',
        'lap': '\u2A85',
        'Laplacetrf': '\u2112',
        'laquo': '\xAB',
        'larr': '\u2190',
        'lArr': '\u21D0',
        'Larr': '\u219E',
        'larrb': '\u21E4',
        'larrbfs': '\u291F',
        'larrfs': '\u291D',
        'larrhk': '\u21A9',
        'larrlp': '\u21AB',
        'larrpl': '\u2939',
        'larrsim': '\u2973',
        'larrtl': '\u21A2',
        'lat': '\u2AAB',
        'latail': '\u2919',
        'lAtail': '\u291B',
        'late': '\u2AAD',
        'lates': '\u2AAD\uFE00',
        'lbarr': '\u290C',
        'lBarr': '\u290E',
        'lbbrk': '\u2772',
        'lbrace': '{',
        'lbrack': '[',
        'lbrke': '\u298B',
        'lbrksld': '\u298F',
        'lbrkslu': '\u298D',
        'lcaron': '\u013E',
        'Lcaron': '\u013D',
        'lcedil': '\u013C',
        'Lcedil': '\u013B',
        'lceil': '\u2308',
        'lcub': '{',
        'lcy': '\u043B',
        'Lcy': '\u041B',
        'ldca': '\u2936',
        'ldquo': '\u201C',
        'ldquor': '\u201E',
        'ldrdhar': '\u2967',
        'ldrushar': '\u294B',
        'ldsh': '\u21B2',
        'le': '\u2264',
        'lE': '\u2266',
        'LeftAngleBracket': '\u27E8',
        'leftarrow': '\u2190',
        'Leftarrow': '\u21D0',
        'LeftArrow': '\u2190',
        'LeftArrowBar': '\u21E4',
        'LeftArrowRightArrow': '\u21C6',
        'leftarrowtail': '\u21A2',
        'LeftCeiling': '\u2308',
        'LeftDoubleBracket': '\u27E6',
        'LeftDownTeeVector': '\u2961',
        'LeftDownVector': '\u21C3',
        'LeftDownVectorBar': '\u2959',
        'LeftFloor': '\u230A',
        'leftharpoondown': '\u21BD',
        'leftharpoonup': '\u21BC',
        'leftleftarrows': '\u21C7',
        'leftrightarrow': '\u2194',
        'Leftrightarrow': '\u21D4',
        'LeftRightArrow': '\u2194',
        'leftrightarrows': '\u21C6',
        'leftrightharpoons': '\u21CB',
        'leftrightsquigarrow': '\u21AD',
        'LeftRightVector': '\u294E',
        'LeftTee': '\u22A3',
        'LeftTeeArrow': '\u21A4',
        'LeftTeeVector': '\u295A',
        'leftthreetimes': '\u22CB',
        'LeftTriangle': '\u22B2',
        'LeftTriangleBar': '\u29CF',
        'LeftTriangleEqual': '\u22B4',
        'LeftUpDownVector': '\u2951',
        'LeftUpTeeVector': '\u2960',
        'LeftUpVector': '\u21BF',
        'LeftUpVectorBar': '\u2958',
        'LeftVector': '\u21BC',
        'LeftVectorBar': '\u2952',
        'leg': '\u22DA',
        'lEg': '\u2A8B',
        'leq': '\u2264',
        'leqq': '\u2266',
        'leqslant': '\u2A7D',
        'les': '\u2A7D',
        'lescc': '\u2AA8',
        'lesdot': '\u2A7F',
        'lesdoto': '\u2A81',
        'lesdotor': '\u2A83',
        'lesg': '\u22DA\uFE00',
        'lesges': '\u2A93',
        'lessapprox': '\u2A85',
        'lessdot': '\u22D6',
        'lesseqgtr': '\u22DA',
        'lesseqqgtr': '\u2A8B',
        'LessEqualGreater': '\u22DA',
        'LessFullEqual': '\u2266',
        'LessGreater': '\u2276',
        'lessgtr': '\u2276',
        'LessLess': '\u2AA1',
        'lesssim': '\u2272',
        'LessSlantEqual': '\u2A7D',
        'LessTilde': '\u2272',
        'lfisht': '\u297C',
        'lfloor': '\u230A',
        'lfr': '\uD835\uDD29',
        'Lfr': '\uD835\uDD0F',
        'lg': '\u2276',
        'lgE': '\u2A91',
        'lHar': '\u2962',
        'lhard': '\u21BD',
        'lharu': '\u21BC',
        'lharul': '\u296A',
        'lhblk': '\u2584',
        'ljcy': '\u0459',
        'LJcy': '\u0409',
        'll': '\u226A',
        'Ll': '\u22D8',
        'llarr': '\u21C7',
        'llcorner': '\u231E',
        'Lleftarrow': '\u21DA',
        'llhard': '\u296B',
        'lltri': '\u25FA',
        'lmidot': '\u0140',
        'Lmidot': '\u013F',
        'lmoust': '\u23B0',
        'lmoustache': '\u23B0',
        'lnap': '\u2A89',
        'lnapprox': '\u2A89',
        'lne': '\u2A87',
        'lnE': '\u2268',
        'lneq': '\u2A87',
        'lneqq': '\u2268',
        'lnsim': '\u22E6',
        'loang': '\u27EC',
        'loarr': '\u21FD',
        'lobrk': '\u27E6',
        'longleftarrow': '\u27F5',
        'Longleftarrow': '\u27F8',
        'LongLeftArrow': '\u27F5',
        'longleftrightarrow': '\u27F7',
        'Longleftrightarrow': '\u27FA',
        'LongLeftRightArrow': '\u27F7',
        'longmapsto': '\u27FC',
        'longrightarrow': '\u27F6',
        'Longrightarrow': '\u27F9',
        'LongRightArrow': '\u27F6',
        'looparrowleft': '\u21AB',
        'looparrowright': '\u21AC',
        'lopar': '\u2985',
        'lopf': '\uD835\uDD5D',
        'Lopf': '\uD835\uDD43',
        'loplus': '\u2A2D',
        'lotimes': '\u2A34',
        'lowast': '\u2217',
        'lowbar': '_',
        'LowerLeftArrow': '\u2199',
        'LowerRightArrow': '\u2198',
        'loz': '\u25CA',
        'lozenge': '\u25CA',
        'lozf': '\u29EB',
        'lpar': '(',
        'lparlt': '\u2993',
        'lrarr': '\u21C6',
        'lrcorner': '\u231F',
        'lrhar': '\u21CB',
        'lrhard': '\u296D',
        'lrm': '\u200E',
        'lrtri': '\u22BF',
        'lsaquo': '\u2039',
        'lscr': '\uD835\uDCC1',
        'Lscr': '\u2112',
        'lsh': '\u21B0',
        'Lsh': '\u21B0',
        'lsim': '\u2272',
        'lsime': '\u2A8D',
        'lsimg': '\u2A8F',
        'lsqb': '[',
        'lsquo': '\u2018',
        'lsquor': '\u201A',
        'lstrok': '\u0142',
        'Lstrok': '\u0141',
        'lt': '<',
        'Lt': '\u226A',
        'LT': '<',
        'ltcc': '\u2AA6',
        'ltcir': '\u2A79',
        'ltdot': '\u22D6',
        'lthree': '\u22CB',
        'ltimes': '\u22C9',
        'ltlarr': '\u2976',
        'ltquest': '\u2A7B',
        'ltri': '\u25C3',
        'ltrie': '\u22B4',
        'ltrif': '\u25C2',
        'ltrPar': '\u2996',
        'lurdshar': '\u294A',
        'luruhar': '\u2966',
        'lvertneqq': '\u2268\uFE00',
        'lvnE': '\u2268\uFE00',
        'macr': '\xAF',
        'male': '\u2642',
        'malt': '\u2720',
        'maltese': '\u2720',
        'map': '\u21A6',
        'Map': '\u2905',
        'mapsto': '\u21A6',
        'mapstodown': '\u21A7',
        'mapstoleft': '\u21A4',
        'mapstoup': '\u21A5',
        'marker': '\u25AE',
        'mcomma': '\u2A29',
        'mcy': '\u043C',
        'Mcy': '\u041C',
        'mdash': '\u2014',
        'mDDot': '\u223A',
        'measuredangle': '\u2221',
        'MediumSpace': '\u205F',
        'Mellintrf': '\u2133',
        'mfr': '\uD835\uDD2A',
        'Mfr': '\uD835\uDD10',
        'mho': '\u2127',
        'micro': '\xB5',
        'mid': '\u2223',
        'midast': '*',
        'midcir': '\u2AF0',
        'middot': '\xB7',
        'minus': '\u2212',
        'minusb': '\u229F',
        'minusd': '\u2238',
        'minusdu': '\u2A2A',
        'MinusPlus': '\u2213',
        'mlcp': '\u2ADB',
        'mldr': '\u2026',
        'mnplus': '\u2213',
        'models': '\u22A7',
        'mopf': '\uD835\uDD5E',
        'Mopf': '\uD835\uDD44',
        'mp': '\u2213',
        'mscr': '\uD835\uDCC2',
        'Mscr': '\u2133',
        'mstpos': '\u223E',
        'mu': '\u03BC',
        'Mu': '\u039C',
        'multimap': '\u22B8',
        'mumap': '\u22B8',
        'nabla': '\u2207',
        'nacute': '\u0144',
        'Nacute': '\u0143',
        'nang': '\u2220\u20D2',
        'nap': '\u2249',
        'napE': '\u2A70\u0338',
        'napid': '\u224B\u0338',
        'napos': '\u0149',
        'napprox': '\u2249',
        'natur': '\u266E',
        'natural': '\u266E',
        'naturals': '\u2115',
        'nbsp': '\xA0',
        'nbump': '\u224E\u0338',
        'nbumpe': '\u224F\u0338',
        'ncap': '\u2A43',
        'ncaron': '\u0148',
        'Ncaron': '\u0147',
        'ncedil': '\u0146',
        'Ncedil': '\u0145',
        'ncong': '\u2247',
        'ncongdot': '\u2A6D\u0338',
        'ncup': '\u2A42',
        'ncy': '\u043D',
        'Ncy': '\u041D',
        'ndash': '\u2013',
        'ne': '\u2260',
        'nearhk': '\u2924',
        'nearr': '\u2197',
        'neArr': '\u21D7',
        'nearrow': '\u2197',
        'nedot': '\u2250\u0338',
        'NegativeMediumSpace': '\u200B',
        'NegativeThickSpace': '\u200B',
        'NegativeThinSpace': '\u200B',
        'NegativeVeryThinSpace': '\u200B',
        'nequiv': '\u2262',
        'nesear': '\u2928',
        'nesim': '\u2242\u0338',
        'NestedGreaterGreater': '\u226B',
        'NestedLessLess': '\u226A',
        'NewLine': '\n',
        'nexist': '\u2204',
        'nexists': '\u2204',
        'nfr': '\uD835\uDD2B',
        'Nfr': '\uD835\uDD11',
        'nge': '\u2271',
        'ngE': '\u2267\u0338',
        'ngeq': '\u2271',
        'ngeqq': '\u2267\u0338',
        'ngeqslant': '\u2A7E\u0338',
        'nges': '\u2A7E\u0338',
        'nGg': '\u22D9\u0338',
        'ngsim': '\u2275',
        'ngt': '\u226F',
        'nGt': '\u226B\u20D2',
        'ngtr': '\u226F',
        'nGtv': '\u226B\u0338',
        'nharr': '\u21AE',
        'nhArr': '\u21CE',
        'nhpar': '\u2AF2',
        'ni': '\u220B',
        'nis': '\u22FC',
        'nisd': '\u22FA',
        'niv': '\u220B',
        'njcy': '\u045A',
        'NJcy': '\u040A',
        'nlarr': '\u219A',
        'nlArr': '\u21CD',
        'nldr': '\u2025',
        'nle': '\u2270',
        'nlE': '\u2266\u0338',
        'nleftarrow': '\u219A',
        'nLeftarrow': '\u21CD',
        'nleftrightarrow': '\u21AE',
        'nLeftrightarrow': '\u21CE',
        'nleq': '\u2270',
        'nleqq': '\u2266\u0338',
        'nleqslant': '\u2A7D\u0338',
        'nles': '\u2A7D\u0338',
        'nless': '\u226E',
        'nLl': '\u22D8\u0338',
        'nlsim': '\u2274',
        'nlt': '\u226E',
        'nLt': '\u226A\u20D2',
        'nltri': '\u22EA',
        'nltrie': '\u22EC',
        'nLtv': '\u226A\u0338',
        'nmid': '\u2224',
        'NoBreak': '\u2060',
        'NonBreakingSpace': '\xA0',
        'nopf': '\uD835\uDD5F',
        'Nopf': '\u2115',
        'not': '\xAC',
        'Not': '\u2AEC',
        'NotCongruent': '\u2262',
        'NotCupCap': '\u226D',
        'NotDoubleVerticalBar': '\u2226',
        'NotElement': '\u2209',
        'NotEqual': '\u2260',
        'NotEqualTilde': '\u2242\u0338',
        'NotExists': '\u2204',
        'NotGreater': '\u226F',
        'NotGreaterEqual': '\u2271',
        'NotGreaterFullEqual': '\u2267\u0338',
        'NotGreaterGreater': '\u226B\u0338',
        'NotGreaterLess': '\u2279',
        'NotGreaterSlantEqual': '\u2A7E\u0338',
        'NotGreaterTilde': '\u2275',
        'NotHumpDownHump': '\u224E\u0338',
        'NotHumpEqual': '\u224F\u0338',
        'notin': '\u2209',
        'notindot': '\u22F5\u0338',
        'notinE': '\u22F9\u0338',
        'notinva': '\u2209',
        'notinvb': '\u22F7',
        'notinvc': '\u22F6',
        'NotLeftTriangle': '\u22EA',
        'NotLeftTriangleBar': '\u29CF\u0338',
        'NotLeftTriangleEqual': '\u22EC',
        'NotLess': '\u226E',
        'NotLessEqual': '\u2270',
        'NotLessGreater': '\u2278',
        'NotLessLess': '\u226A\u0338',
        'NotLessSlantEqual': '\u2A7D\u0338',
        'NotLessTilde': '\u2274',
        'NotNestedGreaterGreater': '\u2AA2\u0338',
        'NotNestedLessLess': '\u2AA1\u0338',
        'notni': '\u220C',
        'notniva': '\u220C',
        'notnivb': '\u22FE',
        'notnivc': '\u22FD',
        'NotPrecedes': '\u2280',
        'NotPrecedesEqual': '\u2AAF\u0338',
        'NotPrecedesSlantEqual': '\u22E0',
        'NotReverseElement': '\u220C',
        'NotRightTriangle': '\u22EB',
        'NotRightTriangleBar': '\u29D0\u0338',
        'NotRightTriangleEqual': '\u22ED',
        'NotSquareSubset': '\u228F\u0338',
        'NotSquareSubsetEqual': '\u22E2',
        'NotSquareSuperset': '\u2290\u0338',
        'NotSquareSupersetEqual': '\u22E3',
        'NotSubset': '\u2282\u20D2',
        'NotSubsetEqual': '\u2288',
        'NotSucceeds': '\u2281',
        'NotSucceedsEqual': '\u2AB0\u0338',
        'NotSucceedsSlantEqual': '\u22E1',
        'NotSucceedsTilde': '\u227F\u0338',
        'NotSuperset': '\u2283\u20D2',
        'NotSupersetEqual': '\u2289',
        'NotTilde': '\u2241',
        'NotTildeEqual': '\u2244',
        'NotTildeFullEqual': '\u2247',
        'NotTildeTilde': '\u2249',
        'NotVerticalBar': '\u2224',
        'npar': '\u2226',
        'nparallel': '\u2226',
        'nparsl': '\u2AFD\u20E5',
        'npart': '\u2202\u0338',
        'npolint': '\u2A14',
        'npr': '\u2280',
        'nprcue': '\u22E0',
        'npre': '\u2AAF\u0338',
        'nprec': '\u2280',
        'npreceq': '\u2AAF\u0338',
        'nrarr': '\u219B',
        'nrArr': '\u21CF',
        'nrarrc': '\u2933\u0338',
        'nrarrw': '\u219D\u0338',
        'nrightarrow': '\u219B',
        'nRightarrow': '\u21CF',
        'nrtri': '\u22EB',
        'nrtrie': '\u22ED',
        'nsc': '\u2281',
        'nsccue': '\u22E1',
        'nsce': '\u2AB0\u0338',
        'nscr': '\uD835\uDCC3',
        'Nscr': '\uD835\uDCA9',
        'nshortmid': '\u2224',
        'nshortparallel': '\u2226',
        'nsim': '\u2241',
        'nsime': '\u2244',
        'nsimeq': '\u2244',
        'nsmid': '\u2224',
        'nspar': '\u2226',
        'nsqsube': '\u22E2',
        'nsqsupe': '\u22E3',
        'nsub': '\u2284',
        'nsube': '\u2288',
        'nsubE': '\u2AC5\u0338',
        'nsubset': '\u2282\u20D2',
        'nsubseteq': '\u2288',
        'nsubseteqq': '\u2AC5\u0338',
        'nsucc': '\u2281',
        'nsucceq': '\u2AB0\u0338',
        'nsup': '\u2285',
        'nsupe': '\u2289',
        'nsupE': '\u2AC6\u0338',
        'nsupset': '\u2283\u20D2',
        'nsupseteq': '\u2289',
        'nsupseteqq': '\u2AC6\u0338',
        'ntgl': '\u2279',
        'ntilde': '\xF1',
        'Ntilde': '\xD1',
        'ntlg': '\u2278',
        'ntriangleleft': '\u22EA',
        'ntrianglelefteq': '\u22EC',
        'ntriangleright': '\u22EB',
        'ntrianglerighteq': '\u22ED',
        'nu': '\u03BD',
        'Nu': '\u039D',
        'num': '#',
        'numero': '\u2116',
        'numsp': '\u2007',
        'nvap': '\u224D\u20D2',
        'nvdash': '\u22AC',
        'nvDash': '\u22AD',
        'nVdash': '\u22AE',
        'nVDash': '\u22AF',
        'nvge': '\u2265\u20D2',
        'nvgt': '>\u20D2',
        'nvHarr': '\u2904',
        'nvinfin': '\u29DE',
        'nvlArr': '\u2902',
        'nvle': '\u2264\u20D2',
        'nvlt': '<\u20D2',
        'nvltrie': '\u22B4\u20D2',
        'nvrArr': '\u2903',
        'nvrtrie': '\u22B5\u20D2',
        'nvsim': '\u223C\u20D2',
        'nwarhk': '\u2923',
        'nwarr': '\u2196',
        'nwArr': '\u21D6',
        'nwarrow': '\u2196',
        'nwnear': '\u2927',
        'oacute': '\xF3',
        'Oacute': '\xD3',
        'oast': '\u229B',
        'ocir': '\u229A',
        'ocirc': '\xF4',
        'Ocirc': '\xD4',
        'ocy': '\u043E',
        'Ocy': '\u041E',
        'odash': '\u229D',
        'odblac': '\u0151',
        'Odblac': '\u0150',
        'odiv': '\u2A38',
        'odot': '\u2299',
        'odsold': '\u29BC',
        'oelig': '\u0153',
        'OElig': '\u0152',
        'ofcir': '\u29BF',
        'ofr': '\uD835\uDD2C',
        'Ofr': '\uD835\uDD12',
        'ogon': '\u02DB',
        'ograve': '\xF2',
        'Ograve': '\xD2',
        'ogt': '\u29C1',
        'ohbar': '\u29B5',
        'ohm': '\u03A9',
        'oint': '\u222E',
        'olarr': '\u21BA',
        'olcir': '\u29BE',
        'olcross': '\u29BB',
        'oline': '\u203E',
        'olt': '\u29C0',
        'omacr': '\u014D',
        'Omacr': '\u014C',
        'omega': '\u03C9',
        'Omega': '\u03A9',
        'omicron': '\u03BF',
        'Omicron': '\u039F',
        'omid': '\u29B6',
        'ominus': '\u2296',
        'oopf': '\uD835\uDD60',
        'Oopf': '\uD835\uDD46',
        'opar': '\u29B7',
        'OpenCurlyDoubleQuote': '\u201C',
        'OpenCurlyQuote': '\u2018',
        'operp': '\u29B9',
        'oplus': '\u2295',
        'or': '\u2228',
        'Or': '\u2A54',
        'orarr': '\u21BB',
        'ord': '\u2A5D',
        'order': '\u2134',
        'orderof': '\u2134',
        'ordf': '\xAA',
        'ordm': '\xBA',
        'origof': '\u22B6',
        'oror': '\u2A56',
        'orslope': '\u2A57',
        'orv': '\u2A5B',
        'oS': '\u24C8',
        'oscr': '\u2134',
        'Oscr': '\uD835\uDCAA',
        'oslash': '\xF8',
        'Oslash': '\xD8',
        'osol': '\u2298',
        'otilde': '\xF5',
        'Otilde': '\xD5',
        'otimes': '\u2297',
        'Otimes': '\u2A37',
        'otimesas': '\u2A36',
        'ouml': '\xF6',
        'Ouml': '\xD6',
        'ovbar': '\u233D',
        'OverBar': '\u203E',
        'OverBrace': '\u23DE',
        'OverBracket': '\u23B4',
        'OverParenthesis': '\u23DC',
        'par': '\u2225',
        'para': '\xB6',
        'parallel': '\u2225',
        'parsim': '\u2AF3',
        'parsl': '\u2AFD',
        'part': '\u2202',
        'PartialD': '\u2202',
        'pcy': '\u043F',
        'Pcy': '\u041F',
        'percnt': '%',
        'period': '.',
        'permil': '\u2030',
        'perp': '\u22A5',
        'pertenk': '\u2031',
        'pfr': '\uD835\uDD2D',
        'Pfr': '\uD835\uDD13',
        'phi': '\u03C6',
        'Phi': '\u03A6',
        'phiv': '\u03D5',
        'phmmat': '\u2133',
        'phone': '\u260E',
        'pi': '\u03C0',
        'Pi': '\u03A0',
        'pitchfork': '\u22D4',
        'piv': '\u03D6',
        'planck': '\u210F',
        'planckh': '\u210E',
        'plankv': '\u210F',
        'plus': '+',
        'plusacir': '\u2A23',
        'plusb': '\u229E',
        'pluscir': '\u2A22',
        'plusdo': '\u2214',
        'plusdu': '\u2A25',
        'pluse': '\u2A72',
        'PlusMinus': '\xB1',
        'plusmn': '\xB1',
        'plussim': '\u2A26',
        'plustwo': '\u2A27',
        'pm': '\xB1',
        'Poincareplane': '\u210C',
        'pointint': '\u2A15',
        'popf': '\uD835\uDD61',
        'Popf': '\u2119',
        'pound': '\xA3',
        'pr': '\u227A',
        'Pr': '\u2ABB',
        'prap': '\u2AB7',
        'prcue': '\u227C',
        'pre': '\u2AAF',
        'prE': '\u2AB3',
        'prec': '\u227A',
        'precapprox': '\u2AB7',
        'preccurlyeq': '\u227C',
        'Precedes': '\u227A',
        'PrecedesEqual': '\u2AAF',
        'PrecedesSlantEqual': '\u227C',
        'PrecedesTilde': '\u227E',
        'preceq': '\u2AAF',
        'precnapprox': '\u2AB9',
        'precneqq': '\u2AB5',
        'precnsim': '\u22E8',
        'precsim': '\u227E',
        'prime': '\u2032',
        'Prime': '\u2033',
        'primes': '\u2119',
        'prnap': '\u2AB9',
        'prnE': '\u2AB5',
        'prnsim': '\u22E8',
        'prod': '\u220F',
        'Product': '\u220F',
        'profalar': '\u232E',
        'profline': '\u2312',
        'profsurf': '\u2313',
        'prop': '\u221D',
        'Proportion': '\u2237',
        'Proportional': '\u221D',
        'propto': '\u221D',
        'prsim': '\u227E',
        'prurel': '\u22B0',
        'pscr': '\uD835\uDCC5',
        'Pscr': '\uD835\uDCAB',
        'psi': '\u03C8',
        'Psi': '\u03A8',
        'puncsp': '\u2008',
        'qfr': '\uD835\uDD2E',
        'Qfr': '\uD835\uDD14',
        'qint': '\u2A0C',
        'qopf': '\uD835\uDD62',
        'Qopf': '\u211A',
        'qprime': '\u2057',
        'qscr': '\uD835\uDCC6',
        'Qscr': '\uD835\uDCAC',
        'quaternions': '\u210D',
        'quatint': '\u2A16',
        'quest': '?',
        'questeq': '\u225F',
        'quot': '"',
        'QUOT': '"',
        'rAarr': '\u21DB',
        'race': '\u223D\u0331',
        'racute': '\u0155',
        'Racute': '\u0154',
        'radic': '\u221A',
        'raemptyv': '\u29B3',
        'rang': '\u27E9',
        'Rang': '\u27EB',
        'rangd': '\u2992',
        'range': '\u29A5',
        'rangle': '\u27E9',
        'raquo': '\xBB',
        'rarr': '\u2192',
        'rArr': '\u21D2',
        'Rarr': '\u21A0',
        'rarrap': '\u2975',
        'rarrb': '\u21E5',
        'rarrbfs': '\u2920',
        'rarrc': '\u2933',
        'rarrfs': '\u291E',
        'rarrhk': '\u21AA',
        'rarrlp': '\u21AC',
        'rarrpl': '\u2945',
        'rarrsim': '\u2974',
        'rarrtl': '\u21A3',
        'Rarrtl': '\u2916',
        'rarrw': '\u219D',
        'ratail': '\u291A',
        'rAtail': '\u291C',
        'ratio': '\u2236',
        'rationals': '\u211A',
        'rbarr': '\u290D',
        'rBarr': '\u290F',
        'RBarr': '\u2910',
        'rbbrk': '\u2773',
        'rbrace': '}',
        'rbrack': ']',
        'rbrke': '\u298C',
        'rbrksld': '\u298E',
        'rbrkslu': '\u2990',
        'rcaron': '\u0159',
        'Rcaron': '\u0158',
        'rcedil': '\u0157',
        'Rcedil': '\u0156',
        'rceil': '\u2309',
        'rcub': '}',
        'rcy': '\u0440',
        'Rcy': '\u0420',
        'rdca': '\u2937',
        'rdldhar': '\u2969',
        'rdquo': '\u201D',
        'rdquor': '\u201D',
        'rdsh': '\u21B3',
        'Re': '\u211C',
        'real': '\u211C',
        'realine': '\u211B',
        'realpart': '\u211C',
        'reals': '\u211D',
        'rect': '\u25AD',
        'reg': '\xAE',
        'REG': '\xAE',
        'ReverseElement': '\u220B',
        'ReverseEquilibrium': '\u21CB',
        'ReverseUpEquilibrium': '\u296F',
        'rfisht': '\u297D',
        'rfloor': '\u230B',
        'rfr': '\uD835\uDD2F',
        'Rfr': '\u211C',
        'rHar': '\u2964',
        'rhard': '\u21C1',
        'rharu': '\u21C0',
        'rharul': '\u296C',
        'rho': '\u03C1',
        'Rho': '\u03A1',
        'rhov': '\u03F1',
        'RightAngleBracket': '\u27E9',
        'rightarrow': '\u2192',
        'Rightarrow': '\u21D2',
        'RightArrow': '\u2192',
        'RightArrowBar': '\u21E5',
        'RightArrowLeftArrow': '\u21C4',
        'rightarrowtail': '\u21A3',
        'RightCeiling': '\u2309',
        'RightDoubleBracket': '\u27E7',
        'RightDownTeeVector': '\u295D',
        'RightDownVector': '\u21C2',
        'RightDownVectorBar': '\u2955',
        'RightFloor': '\u230B',
        'rightharpoondown': '\u21C1',
        'rightharpoonup': '\u21C0',
        'rightleftarrows': '\u21C4',
        'rightleftharpoons': '\u21CC',
        'rightrightarrows': '\u21C9',
        'rightsquigarrow': '\u219D',
        'RightTee': '\u22A2',
        'RightTeeArrow': '\u21A6',
        'RightTeeVector': '\u295B',
        'rightthreetimes': '\u22CC',
        'RightTriangle': '\u22B3',
        'RightTriangleBar': '\u29D0',
        'RightTriangleEqual': '\u22B5',
        'RightUpDownVector': '\u294F',
        'RightUpTeeVector': '\u295C',
        'RightUpVector': '\u21BE',
        'RightUpVectorBar': '\u2954',
        'RightVector': '\u21C0',
        'RightVectorBar': '\u2953',
        'ring': '\u02DA',
        'risingdotseq': '\u2253',
        'rlarr': '\u21C4',
        'rlhar': '\u21CC',
        'rlm': '\u200F',
        'rmoust': '\u23B1',
        'rmoustache': '\u23B1',
        'rnmid': '\u2AEE',
        'roang': '\u27ED',
        'roarr': '\u21FE',
        'robrk': '\u27E7',
        'ropar': '\u2986',
        'ropf': '\uD835\uDD63',
        'Ropf': '\u211D',
        'roplus': '\u2A2E',
        'rotimes': '\u2A35',
        'RoundImplies': '\u2970',
        'rpar': ')',
        'rpargt': '\u2994',
        'rppolint': '\u2A12',
        'rrarr': '\u21C9',
        'Rrightarrow': '\u21DB',
        'rsaquo': '\u203A',
        'rscr': '\uD835\uDCC7',
        'Rscr': '\u211B',
        'rsh': '\u21B1',
        'Rsh': '\u21B1',
        'rsqb': ']',
        'rsquo': '\u2019',
        'rsquor': '\u2019',
        'rthree': '\u22CC',
        'rtimes': '\u22CA',
        'rtri': '\u25B9',
        'rtrie': '\u22B5',
        'rtrif': '\u25B8',
        'rtriltri': '\u29CE',
        'RuleDelayed': '\u29F4',
        'ruluhar': '\u2968',
        'rx': '\u211E',
        'sacute': '\u015B',
        'Sacute': '\u015A',
        'sbquo': '\u201A',
        'sc': '\u227B',
        'Sc': '\u2ABC',
        'scap': '\u2AB8',
        'scaron': '\u0161',
        'Scaron': '\u0160',
        'sccue': '\u227D',
        'sce': '\u2AB0',
        'scE': '\u2AB4',
        'scedil': '\u015F',
        'Scedil': '\u015E',
        'scirc': '\u015D',
        'Scirc': '\u015C',
        'scnap': '\u2ABA',
        'scnE': '\u2AB6',
        'scnsim': '\u22E9',
        'scpolint': '\u2A13',
        'scsim': '\u227F',
        'scy': '\u0441',
        'Scy': '\u0421',
        'sdot': '\u22C5',
        'sdotb': '\u22A1',
        'sdote': '\u2A66',
        'searhk': '\u2925',
        'searr': '\u2198',
        'seArr': '\u21D8',
        'searrow': '\u2198',
        'sect': '\xA7',
        'semi': ';',
        'seswar': '\u2929',
        'setminus': '\u2216',
        'setmn': '\u2216',
        'sext': '\u2736',
        'sfr': '\uD835\uDD30',
        'Sfr': '\uD835\uDD16',
        'sfrown': '\u2322',
        'sharp': '\u266F',
        'shchcy': '\u0449',
        'SHCHcy': '\u0429',
        'shcy': '\u0448',
        'SHcy': '\u0428',
        'ShortDownArrow': '\u2193',
        'ShortLeftArrow': '\u2190',
        'shortmid': '\u2223',
        'shortparallel': '\u2225',
        'ShortRightArrow': '\u2192',
        'ShortUpArrow': '\u2191',
        'shy': '\xAD',
        'sigma': '\u03C3',
        'Sigma': '\u03A3',
        'sigmaf': '\u03C2',
        'sigmav': '\u03C2',
        'sim': '\u223C',
        'simdot': '\u2A6A',
        'sime': '\u2243',
        'simeq': '\u2243',
        'simg': '\u2A9E',
        'simgE': '\u2AA0',
        'siml': '\u2A9D',
        'simlE': '\u2A9F',
        'simne': '\u2246',
        'simplus': '\u2A24',
        'simrarr': '\u2972',
        'slarr': '\u2190',
        'SmallCircle': '\u2218',
        'smallsetminus': '\u2216',
        'smashp': '\u2A33',
        'smeparsl': '\u29E4',
        'smid': '\u2223',
        'smile': '\u2323',
        'smt': '\u2AAA',
        'smte': '\u2AAC',
        'smtes': '\u2AAC\uFE00',
        'softcy': '\u044C',
        'SOFTcy': '\u042C',
        'sol': '/',
        'solb': '\u29C4',
        'solbar': '\u233F',
        'sopf': '\uD835\uDD64',
        'Sopf': '\uD835\uDD4A',
        'spades': '\u2660',
        'spadesuit': '\u2660',
        'spar': '\u2225',
        'sqcap': '\u2293',
        'sqcaps': '\u2293\uFE00',
        'sqcup': '\u2294',
        'sqcups': '\u2294\uFE00',
        'Sqrt': '\u221A',
        'sqsub': '\u228F',
        'sqsube': '\u2291',
        'sqsubset': '\u228F',
        'sqsubseteq': '\u2291',
        'sqsup': '\u2290',
        'sqsupe': '\u2292',
        'sqsupset': '\u2290',
        'sqsupseteq': '\u2292',
        'squ': '\u25A1',
        'square': '\u25A1',
        'Square': '\u25A1',
        'SquareIntersection': '\u2293',
        'SquareSubset': '\u228F',
        'SquareSubsetEqual': '\u2291',
        'SquareSuperset': '\u2290',
        'SquareSupersetEqual': '\u2292',
        'SquareUnion': '\u2294',
        'squarf': '\u25AA',
        'squf': '\u25AA',
        'srarr': '\u2192',
        'sscr': '\uD835\uDCC8',
        'Sscr': '\uD835\uDCAE',
        'ssetmn': '\u2216',
        'ssmile': '\u2323',
        'sstarf': '\u22C6',
        'star': '\u2606',
        'Star': '\u22C6',
        'starf': '\u2605',
        'straightepsilon': '\u03F5',
        'straightphi': '\u03D5',
        'strns': '\xAF',
        'sub': '\u2282',
        'Sub': '\u22D0',
        'subdot': '\u2ABD',
        'sube': '\u2286',
        'subE': '\u2AC5',
        'subedot': '\u2AC3',
        'submult': '\u2AC1',
        'subne': '\u228A',
        'subnE': '\u2ACB',
        'subplus': '\u2ABF',
        'subrarr': '\u2979',
        'subset': '\u2282',
        'Subset': '\u22D0',
        'subseteq': '\u2286',
        'subseteqq': '\u2AC5',
        'SubsetEqual': '\u2286',
        'subsetneq': '\u228A',
        'subsetneqq': '\u2ACB',
        'subsim': '\u2AC7',
        'subsub': '\u2AD5',
        'subsup': '\u2AD3',
        'succ': '\u227B',
        'succapprox': '\u2AB8',
        'succcurlyeq': '\u227D',
        'Succeeds': '\u227B',
        'SucceedsEqual': '\u2AB0',
        'SucceedsSlantEqual': '\u227D',
        'SucceedsTilde': '\u227F',
        'succeq': '\u2AB0',
        'succnapprox': '\u2ABA',
        'succneqq': '\u2AB6',
        'succnsim': '\u22E9',
        'succsim': '\u227F',
        'SuchThat': '\u220B',
        'sum': '\u2211',
        'Sum': '\u2211',
        'sung': '\u266A',
        'sup': '\u2283',
        'Sup': '\u22D1',
        'sup1': '\xB9',
        'sup2': '\xB2',
        'sup3': '\xB3',
        'supdot': '\u2ABE',
        'supdsub': '\u2AD8',
        'supe': '\u2287',
        'supE': '\u2AC6',
        'supedot': '\u2AC4',
        'Superset': '\u2283',
        'SupersetEqual': '\u2287',
        'suphsol': '\u27C9',
        'suphsub': '\u2AD7',
        'suplarr': '\u297B',
        'supmult': '\u2AC2',
        'supne': '\u228B',
        'supnE': '\u2ACC',
        'supplus': '\u2AC0',
        'supset': '\u2283',
        'Supset': '\u22D1',
        'supseteq': '\u2287',
        'supseteqq': '\u2AC6',
        'supsetneq': '\u228B',
        'supsetneqq': '\u2ACC',
        'supsim': '\u2AC8',
        'supsub': '\u2AD4',
        'supsup': '\u2AD6',
        'swarhk': '\u2926',
        'swarr': '\u2199',
        'swArr': '\u21D9',
        'swarrow': '\u2199',
        'swnwar': '\u292A',
        'szlig': '\xDF',
        'Tab': '\t',
        'target': '\u2316',
        'tau': '\u03C4',
        'Tau': '\u03A4',
        'tbrk': '\u23B4',
        'tcaron': '\u0165',
        'Tcaron': '\u0164',
        'tcedil': '\u0163',
        'Tcedil': '\u0162',
        'tcy': '\u0442',
        'Tcy': '\u0422',
        'tdot': '\u20DB',
        'telrec': '\u2315',
        'tfr': '\uD835\uDD31',
        'Tfr': '\uD835\uDD17',
        'there4': '\u2234',
        'therefore': '\u2234',
        'Therefore': '\u2234',
        'theta': '\u03B8',
        'Theta': '\u0398',
        'thetasym': '\u03D1',
        'thetav': '\u03D1',
        'thickapprox': '\u2248',
        'thicksim': '\u223C',
        'ThickSpace': '\u205F\u200A',
        'thinsp': '\u2009',
        'ThinSpace': '\u2009',
        'thkap': '\u2248',
        'thksim': '\u223C',
        'thorn': '\xFE',
        'THORN': '\xDE',
        'tilde': '\u02DC',
        'Tilde': '\u223C',
        'TildeEqual': '\u2243',
        'TildeFullEqual': '\u2245',
        'TildeTilde': '\u2248',
        'times': '\xD7',
        'timesb': '\u22A0',
        'timesbar': '\u2A31',
        'timesd': '\u2A30',
        'tint': '\u222D',
        'toea': '\u2928',
        'top': '\u22A4',
        'topbot': '\u2336',
        'topcir': '\u2AF1',
        'topf': '\uD835\uDD65',
        'Topf': '\uD835\uDD4B',
        'topfork': '\u2ADA',
        'tosa': '\u2929',
        'tprime': '\u2034',
        'trade': '\u2122',
        'TRADE': '\u2122',
        'triangle': '\u25B5',
        'triangledown': '\u25BF',
        'triangleleft': '\u25C3',
        'trianglelefteq': '\u22B4',
        'triangleq': '\u225C',
        'triangleright': '\u25B9',
        'trianglerighteq': '\u22B5',
        'tridot': '\u25EC',
        'trie': '\u225C',
        'triminus': '\u2A3A',
        'TripleDot': '\u20DB',
        'triplus': '\u2A39',
        'trisb': '\u29CD',
        'tritime': '\u2A3B',
        'trpezium': '\u23E2',
        'tscr': '\uD835\uDCC9',
        'Tscr': '\uD835\uDCAF',
        'tscy': '\u0446',
        'TScy': '\u0426',
        'tshcy': '\u045B',
        'TSHcy': '\u040B',
        'tstrok': '\u0167',
        'Tstrok': '\u0166',
        'twixt': '\u226C',
        'twoheadleftarrow': '\u219E',
        'twoheadrightarrow': '\u21A0',
        'uacute': '\xFA',
        'Uacute': '\xDA',
        'uarr': '\u2191',
        'uArr': '\u21D1',
        'Uarr': '\u219F',
        'Uarrocir': '\u2949',
        'ubrcy': '\u045E',
        'Ubrcy': '\u040E',
        'ubreve': '\u016D',
        'Ubreve': '\u016C',
        'ucirc': '\xFB',
        'Ucirc': '\xDB',
        'ucy': '\u0443',
        'Ucy': '\u0423',
        'udarr': '\u21C5',
        'udblac': '\u0171',
        'Udblac': '\u0170',
        'udhar': '\u296E',
        'ufisht': '\u297E',
        'ufr': '\uD835\uDD32',
        'Ufr': '\uD835\uDD18',
        'ugrave': '\xF9',
        'Ugrave': '\xD9',
        'uHar': '\u2963',
        'uharl': '\u21BF',
        'uharr': '\u21BE',
        'uhblk': '\u2580',
        'ulcorn': '\u231C',
        'ulcorner': '\u231C',
        'ulcrop': '\u230F',
        'ultri': '\u25F8',
        'umacr': '\u016B',
        'Umacr': '\u016A',
        'uml': '\xA8',
        'UnderBar': '_',
        'UnderBrace': '\u23DF',
        'UnderBracket': '\u23B5',
        'UnderParenthesis': '\u23DD',
        'Union': '\u22C3',
        'UnionPlus': '\u228E',
        'uogon': '\u0173',
        'Uogon': '\u0172',
        'uopf': '\uD835\uDD66',
        'Uopf': '\uD835\uDD4C',
        'uparrow': '\u2191',
        'Uparrow': '\u21D1',
        'UpArrow': '\u2191',
        'UpArrowBar': '\u2912',
        'UpArrowDownArrow': '\u21C5',
        'updownarrow': '\u2195',
        'Updownarrow': '\u21D5',
        'UpDownArrow': '\u2195',
        'UpEquilibrium': '\u296E',
        'upharpoonleft': '\u21BF',
        'upharpoonright': '\u21BE',
        'uplus': '\u228E',
        'UpperLeftArrow': '\u2196',
        'UpperRightArrow': '\u2197',
        'upsi': '\u03C5',
        'Upsi': '\u03D2',
        'upsih': '\u03D2',
        'upsilon': '\u03C5',
        'Upsilon': '\u03A5',
        'UpTee': '\u22A5',
        'UpTeeArrow': '\u21A5',
        'upuparrows': '\u21C8',
        'urcorn': '\u231D',
        'urcorner': '\u231D',
        'urcrop': '\u230E',
        'uring': '\u016F',
        'Uring': '\u016E',
        'urtri': '\u25F9',
        'uscr': '\uD835\uDCCA',
        'Uscr': '\uD835\uDCB0',
        'utdot': '\u22F0',
        'utilde': '\u0169',
        'Utilde': '\u0168',
        'utri': '\u25B5',
        'utrif': '\u25B4',
        'uuarr': '\u21C8',
        'uuml': '\xFC',
        'Uuml': '\xDC',
        'uwangle': '\u29A7',
        'vangrt': '\u299C',
        'varepsilon': '\u03F5',
        'varkappa': '\u03F0',
        'varnothing': '\u2205',
        'varphi': '\u03D5',
        'varpi': '\u03D6',
        'varpropto': '\u221D',
        'varr': '\u2195',
        'vArr': '\u21D5',
        'varrho': '\u03F1',
        'varsigma': '\u03C2',
        'varsubsetneq': '\u228A\uFE00',
        'varsubsetneqq': '\u2ACB\uFE00',
        'varsupsetneq': '\u228B\uFE00',
        'varsupsetneqq': '\u2ACC\uFE00',
        'vartheta': '\u03D1',
        'vartriangleleft': '\u22B2',
        'vartriangleright': '\u22B3',
        'vBar': '\u2AE8',
        'Vbar': '\u2AEB',
        'vBarv': '\u2AE9',
        'vcy': '\u0432',
        'Vcy': '\u0412',
        'vdash': '\u22A2',
        'vDash': '\u22A8',
        'Vdash': '\u22A9',
        'VDash': '\u22AB',
        'Vdashl': '\u2AE6',
        'vee': '\u2228',
        'Vee': '\u22C1',
        'veebar': '\u22BB',
        'veeeq': '\u225A',
        'vellip': '\u22EE',
        'verbar': '|',
        'Verbar': '\u2016',
        'vert': '|',
        'Vert': '\u2016',
        'VerticalBar': '\u2223',
        'VerticalLine': '|',
        'VerticalSeparator': '\u2758',
        'VerticalTilde': '\u2240',
        'VeryThinSpace': '\u200A',
        'vfr': '\uD835\uDD33',
        'Vfr': '\uD835\uDD19',
        'vltri': '\u22B2',
        'vnsub': '\u2282\u20D2',
        'vnsup': '\u2283\u20D2',
        'vopf': '\uD835\uDD67',
        'Vopf': '\uD835\uDD4D',
        'vprop': '\u221D',
        'vrtri': '\u22B3',
        'vscr': '\uD835\uDCCB',
        'Vscr': '\uD835\uDCB1',
        'vsubne': '\u228A\uFE00',
        'vsubnE': '\u2ACB\uFE00',
        'vsupne': '\u228B\uFE00',
        'vsupnE': '\u2ACC\uFE00',
        'Vvdash': '\u22AA',
        'vzigzag': '\u299A',
        'wcirc': '\u0175',
        'Wcirc': '\u0174',
        'wedbar': '\u2A5F',
        'wedge': '\u2227',
        'Wedge': '\u22C0',
        'wedgeq': '\u2259',
        'weierp': '\u2118',
        'wfr': '\uD835\uDD34',
        'Wfr': '\uD835\uDD1A',
        'wopf': '\uD835\uDD68',
        'Wopf': '\uD835\uDD4E',
        'wp': '\u2118',
        'wr': '\u2240',
        'wreath': '\u2240',
        'wscr': '\uD835\uDCCC',
        'Wscr': '\uD835\uDCB2',
        'xcap': '\u22C2',
        'xcirc': '\u25EF',
        'xcup': '\u22C3',
        'xdtri': '\u25BD',
        'xfr': '\uD835\uDD35',
        'Xfr': '\uD835\uDD1B',
        'xharr': '\u27F7',
        'xhArr': '\u27FA',
        'xi': '\u03BE',
        'Xi': '\u039E',
        'xlarr': '\u27F5',
        'xlArr': '\u27F8',
        'xmap': '\u27FC',
        'xnis': '\u22FB',
        'xodot': '\u2A00',
        'xopf': '\uD835\uDD69',
        'Xopf': '\uD835\uDD4F',
        'xoplus': '\u2A01',
        'xotime': '\u2A02',
        'xrarr': '\u27F6',
        'xrArr': '\u27F9',
        'xscr': '\uD835\uDCCD',
        'Xscr': '\uD835\uDCB3',
        'xsqcup': '\u2A06',
        'xuplus': '\u2A04',
        'xutri': '\u25B3',
        'xvee': '\u22C1',
        'xwedge': '\u22C0',
        'yacute': '\xFD',
        'Yacute': '\xDD',
        'yacy': '\u044F',
        'YAcy': '\u042F',
        'ycirc': '\u0177',
        'Ycirc': '\u0176',
        'ycy': '\u044B',
        'Ycy': '\u042B',
        'yen': '\xA5',
        'yfr': '\uD835\uDD36',
        'Yfr': '\uD835\uDD1C',
        'yicy': '\u0457',
        'YIcy': '\u0407',
        'yopf': '\uD835\uDD6A',
        'Yopf': '\uD835\uDD50',
        'yscr': '\uD835\uDCCE',
        'Yscr': '\uD835\uDCB4',
        'yucy': '\u044E',
        'YUcy': '\u042E',
        'yuml': '\xFF',
        'Yuml': '\u0178',
        'zacute': '\u017A',
        'Zacute': '\u0179',
        'zcaron': '\u017E',
        'Zcaron': '\u017D',
        'zcy': '\u0437',
        'Zcy': '\u0417',
        'zdot': '\u017C',
        'Zdot': '\u017B',
        'zeetrf': '\u2128',
        'ZeroWidthSpace': '\u200B',
        'zeta': '\u03B6',
        'Zeta': '\u0396',
        'zfr': '\uD835\uDD37',
        'Zfr': '\u2128',
        'zhcy': '\u0436',
        'ZHcy': '\u0416',
        'zigrarr': '\u21DD',
        'zopf': '\uD835\uDD6B',
        'Zopf': '\u2124',
        'zscr': '\uD835\uDCCF',
        'Zscr': '\uD835\uDCB5',
        'zwj': '\u200D',
        'zwnj': '\u200C'
    };

    /**
     * 对任意JsAST节点进行生成代码操作
     * @param node
     * @param context
     */
    function genNode(node, context) {
        switch (node.type) {
            case "FunctionDeclaration":
                genFunctionDeclaration(node, context);
                break;
            case "ReturnStatement":
                genReturnStatement(node, context);
                break;
            case "CallExpression":
                genCallExpression(node, context);
                break;
            case "StringLiteral":
                genStringLiteral(node, context);
                break;
            case "ArrayExpression":
                genArrayExpression(node, context);
                break;
            case "ExpressionLiteral":
                genExpressionLiteral(node, context);
                break;
            case "KeyValuePair":
                genKeyValuePair(node, context);
                break;
            case "ObjectExpression":
                genObjectExpression(node, context);
                break;
        }
    }
    /**
     * 生成函数型代码
     * @param node 目标节点
     * @param context 上下文对象
     */
    function genFunctionDeclaration(node, context) {
        // 从 context 对象中取出工具函数
        var push = context.push, indent = context.indent, deIndent = context.deIndent;
        push("with(this) ");
        push("{");
        indent();
        // 函数体
        node.body.forEach(function (n) { return genNode(n, context); });
        deIndent();
        push("}");
    }
    /**
     * 生成返回值代码
     * @param node 目标节点
     * @param context 上下文对象
     */
    function genReturnStatement(node, context) {
        var push = context.push;
        push("return ");
        genNode(node.return, context);
    }
    /**
     * 生成函数调用表达式代码
     * @param node 目标节点
     * @param context 上下文对象
     */
    function genCallExpression(node, context) {
        var push = context.push;
        var callee = node.callee, args = node.arguments;
        push("".concat(callee.name, "("));
        genNodeList(args, context);
        push(")");
    }
    /**
     * 生成参数列表
     * @param nodes 节点数组
     * @param context 上下文对象
     */
    function genNodeList(nodes, context) {
        var push = context.push;
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            genNode(node, context);
            if (i < nodes.length - 1) {
                push(', ');
            }
        }
    }
    /**
     * 生成字符串代码
     * @param node 目标节点
     * @param context 上下文对象
     */
    function genStringLiteral(node, context) {
        var push = context.push;
        // 去除换行符以免影响代码运行
        node.value = node.value
            .replaceAll(/\n/g, ' ')
            // 转义单引号以防止引号冲突
            .replaceAll(/'/g, "\\'");
        // 对于字符串字面量，只需要追加与 node.value 对应的字符串即可
        push("'".concat(node.value, "'"));
    }
    /**
     * 生成数组表达式代码
     * @param node 目标数组节点
     * @param context 上下文对象
     */
    function genArrayExpression(node, context) {
        var push = context.push, indent = context.indent, deIndent = context.deIndent;
        push('[');
        indent();
        genNodeList(node.elements, context);
        deIndent();
        push(']');
    }
    /**
     * 生成js表达式代码
     * @param node 目标节点
     * @param context 上下文对象
     */
    function genExpressionLiteral(node, context) {
        var push = context.push;
        push("(".concat(node.value, ")"));
    }
    /**
     * 生成键值对表达式代码
     * @param node 目标节点
     * @param context 上下文对象
     */
    function genKeyValuePair(node, context) {
        var push = context.push;
        genNode(node.first, context);
        push(': ');
        genNode(node.last, context);
    }
    /**
     * 生成对象表达式代码
     * @param node 目标节点
     * @param context 上下文对象
     */
    function genObjectExpression(node, context) {
        var push = context.push, indent = context.indent, deIndent = context.deIndent;
        push('{');
        indent();
        genNodeList(node.elements, context);
        deIndent();
        push('}');
    }

    function genGuard(condition) {
        return "if (".concat(condition, ") return; ");
    }
    var codeGuards = {
        'd-model': genGuard('$event.target.composing')
    };

    /**
     * 根据jsAST生成渲染函数代码
     * @param jsAST 目标jsAST
     */
    function generate(jsAST) {
        var context = {
            code: '',
            currentIndent: 0,
            push: function (code) {
                context.code += code;
            },
            newLine: function () {
                // 生产环境下无需进行格式化与美化代码操作
                {
                    context.code += '\n' + '  '.repeat(context.currentIndent);
                }
            },
            indent: function () {
                {
                    context.currentIndent++;
                    context.newLine();
                }
            },
            deIndent: function () {
                {
                    context.currentIndent--;
                    context.newLine();
                }
            }
        };
        genNode(jsAST, context);
        return context.code;
    }

    /**
     * directive的处理函数列表
     */
    var directiveHandler = {
        modelHandler: function (directive, context) {
            var createKeyValueObjectNode = context.createKeyValueObjectNode;
            // model指令即通过input事件双向绑定ref变量
            context.events.push(createKeyValueObjectNode('input', "($event) => { ".concat(codeGuards[directive.name], " (").concat(directive.exp.content, ") = $event.target.value }"), 'Expression'));
            context.attrs.push(createKeyValueObjectNode('value', "(".concat(directive.exp.content, ")"), 'Expression'));
        },
        showHandler: function (directive, context) {
            var createKeyValueObjectNode = context.createKeyValueObjectNode;
            // show指令即简单通过style来标识是否展示此节点
            context.attrs.push(createKeyValueObjectNode('_show_', "".concat(directive.exp.content), 'Expression'));
        },
        ifHandler: function (directive, context) {
            var createKeyValueObjectNode = context.createKeyValueObjectNode;
            // if指令通过在vnode上做标记来决定是否渲染此节点
            context.attrs.push(createKeyValueObjectNode('_if_', directive.exp.content, 'Expression'));
        },
        htmlHandler: function (directive, context) {
            var createKeyValueObjectNode = context.createKeyValueObjectNode;
            context.attrs.push(createKeyValueObjectNode('innerHTML', directive.exp.content, 'StringLiteral'));
        }
    };

    /**
     * 针对directives指令部分转换代码表达式
     * @param directives 指令节点
     * @param context 上下文对象
     */
    function transformDirectiveExpression(directives, context) {
        // 过滤节点数组
        directives.filter(function (x) { return x.type === 'Directive'; }).forEach(function (directive) {
            genDirectiveExpression(directive, context);
        });
    }
    /**
     * 根据指令内容生成JsAST
     * @param directive 目标指令节点
     * @param context 上下文对象
     */
    function genDirectiveExpression(directive, context) {
        // 除去开头的d-
        var directiveName = directive.name.slice(2, directive.name.length);
        // 处理handler并进行转换操作
        directiveHandler[directiveName + 'Handler'](directive, context);
    }

    /**
     * 解析指令属性并返回解析结果作为目标节点对象
     * @param propName 属性名
     * @param propValue 属性值
     */
    function parseDirectives(propName, propValue) {
        var prop;
        if (propName.startsWith('@') || propName.startsWith('d-on:') || propName.startsWith('on')) {
            // 处理绑定事件
            prop = {
                type: 'Event',
                // 事件名
                name: propName.startsWith('@')
                    ? propName.slice(1, propName.length)
                    : (propName.startsWith('d-on:')
                        ? propName.slice(5, propName.length)
                        : propName.slice(2, propName.length)),
                exp: {
                    type: 'Expression',
                    content: propValue
                }
            };
        }
        else if (propName.startsWith(':') || propName.startsWith('d-bind:')) {
            var attrName = propName.startsWith(':')
                ? propName.slice(1, propName.length)
                : propName.slice(7, propName.length);
            // 处理绑定属性
            prop = {
                type: 'ReactiveProp',
                name: attrName,
                exp: {
                    type: 'Expression',
                    content: propValue
                }
            };
            // style和class动态属性不应覆盖而应叠加
            if (attrName === 'style' || attrName === 'class') {
                prop.name = "_".concat(attrName, "_");
            }
        }
        else if (propName.startsWith('d-')) {
            // 处理其他指令
            prop = {
                type: 'Directive',
                name: propName,
                exp: {
                    type: 'Expression',
                    content: propValue
                }
            };
        }
        else {
            // 普通的HTML attr
            prop = {
                type: 'Attribute',
                name: propName,
                value: propValue
            };
        }
        return prop;
    }

    /**
     * 解析HTML中的引用字符
     * @param rawText 需要解码的文本
     * @param asAttr 是否用于解码属性值
     */
    function decodeHTMLText(rawText, asAttr) {
        if (asAttr === void 0) { asAttr = false; }
        var offset = 0;
        // 存放解码后的文本结果
        var decodedText = '';
        var endIndex = rawText.length;
        // advance 消费指定长度的文本
        function advance(length) {
            offset += length;
            rawText = rawText.slice(length);
        }
        while (offset < endIndex) {
            // 校验字符引用方式
            // &为命名字符引用
            // &#为十进制数字字符引用
            // &#x为十六进制数字字符引用
            var head = HTML_REFERENCE_HEAD_REG.exec(rawText);
            // 无匹配则说明无需解码
            if (!head) {
                var remaining = endIndex - offset;
                decodedText += rawText.slice(0, remaining);
                advance(remaining);
                break;
            }
            decodedText += rawText.slice(0, head.index);
            advance(head.index); // 消费&前的内容
            if (head[0] === '&') {
                var name_1 = '';
                var value = undefined;
                if (ALPHABET_OR_NUMBER_REG.test(rawText[1])) {
                    // 依次从最长到最短查表寻找匹配的引用字符名称
                    for (var length_1 = decodeMapKeyMaxLen; !value && length_1 > 0; --length_1) {
                        name_1 = rawText.slice(1, 1 + length_1);
                        value = decodeMap[name_1];
                    }
                    if (value) {
                        var semi = (rawText[1 + name_1.length] || '') === ';';
                        // 如果解码的文本作为属性值，最后一个匹配的字符不是分号，
                        // 并且最后一个匹配字符的下一个字符是等于号(=)、ASCII 字母或数字，
                        // 将字符 & 和实体名称 name 作为普通文本
                        if (asAttr &&
                            !semi &&
                            /[=a-z0-9]/i.test(rawText[1 + name_1.length] || '')) {
                            decodedText += '&' + name_1;
                            advance(1 + name_1.length);
                        }
                        else {
                            decodedText += value;
                            advance(semi ? 2 + name_1.length : 1 + name_1.length); // 由于查找键时未包含分号，若末尾有分号需同时消费掉
                        }
                    }
                    else { // 解码失败，无对应值
                        decodedText += '&' + name_1;
                        advance(1 + name_1.length);
                    }
                }
                else {
                    decodedText += '&';
                    advance(1);
                }
            }
            else {
                // 根据引用头判断数字的引用进制
                var isHex = head[0] === '&#x';
                var pattern = isHex ? HTML_REFERENCE_HEX_REG : HTML_REFERENCE_NUMBER_REG;
                var body = pattern.exec(rawText); // 匹配得到unicode码值
                if (body) {
                    // 根据进制将转为改为数字
                    var codePoint = parseInt(body[1], isHex ? 16 : 10);
                    // 检查unicode值合法性并进行替换
                    if (codePoint === 0) {
                        codePoint = 0xfffd;
                    }
                    else if (codePoint > 0x10ffff) {
                        codePoint = 0xfffd;
                    }
                    else if (codePoint > 0xd800 && codePoint < 0xdfff) {
                        codePoint = 0xfffd;
                    }
                    else if ((codePoint > 0xfdd0 && codePoint <= 0xfdef) || (codePoint & 0xfffe) === 0xfffe) ;
                    else if ((codePoint >= 0x01 && codePoint <= 0x08) ||
                        codePoint === 0x0b ||
                        (codePoint >= 0x0d && codePoint <= 0x1f) ||
                        (codePoint >= 0x7f && codePoint <= 0x9f)) {
                        codePoint = CCR_REPLACEMENTS[codePoint] || codePoint;
                    }
                    // 解码
                    var char = String.fromCodePoint(codePoint);
                    decodedText += char;
                    advance(body[0].length);
                }
                else { // 无匹配则直接当作文本处理
                    decodedText += head[0];
                    advance(head[0].length);
                }
            }
        }
        return decodedText;
    }

    /**
     * 解析某节点的子节点
     * @param context 上下文对象
     * @param parenStack 父节点栈
     */
    function parseChildren(context, parenStack) {
        var nodes = [];
        while (!isEnd(context, parenStack)) {
            var node = void 0;
            if (context.mode === 0 /* ParserModes.DATA */ || context.mode === 1 /* ParserModes.RCDATA */) {
                // 仅DATA模式支持解析标签节点
                if (context.mode === 0 /* ParserModes.DATA */ && context.source[0] === '<') {
                    if (context.source[1] === '!') {
                        if (context.source.startsWith('<!--')) { // 注释标签开头
                            node = parseComment(context);
                        }
                        else if (context.source.startsWith('<![CDATA[')) { // CDATA标签
                            error("the parser is not supporting CDATA mode.", null);
                            // node = parseCDATA(context, parenStack)
                        }
                    }
                    else if (context.source[1] === '/') { // 结束标签
                        error('invalid end tag in HTML.', context.source);
                        continue;
                    }
                    else if (/[a-z]/i.test(context.source[1])) {
                        node = parseElement(context, parenStack);
                    }
                }
                else if (context.source.startsWith('{{')) { // 解析文本插值
                    // 插值解析
                    node = parseInterpolation(context);
                }
            }
            // 若node不存在则说明处于非DATA模式，一律当作text处理
            if (!node) {
                node = parseText(context);
            }
            nodes.push(node);
        }
        return nodes;
    }
    /**
     * 校验是否解析到了文本末尾
     * @param context 上下文对象
     * @param parenStack 父节点栈
     */
    function isEnd(context, parenStack) {
        if (!context.source || context.source === '')
            return true;
        // 当存在最靠近栈顶的父节点与当前处理的结束标签一致时说明应停止当前状态机
        for (var i = parenStack.length - 1; i >= 0; i--) {
            var parent_1 = parenStack[i];
            if (parent_1 && context.source.startsWith("</".concat(parent_1.tag))) {
                return true;
            }
        }
        return false;
    }
    /**
     * 解析HTML标签的属性
     * @param context 上下文对象
     */
    function parseAttributes(context) {
        var advanceBy = context.advanceBy, advanceSpaces = context.advanceSpaces;
        var props = [];
        while (!context.source.startsWith('>') && !context.source.startsWith('/')) {
            var match = HTML_TAG_PROP_REG.exec(context.source);
            var propName = match[0];
            // 消费属性名
            advanceBy(propName.length);
            advanceSpaces();
            // 消费等号
            advanceBy(1);
            advanceSpaces();
            var propValue = '';
            var quote = context.source[0];
            var isQuote = quote === '"' || quote === "'";
            // 根据属性值是否被引号引用来进行不同处理
            if (isQuote) {
                advanceBy(1); // 消费引号
                var lastQuoteIndex = context.source.indexOf(quote);
                if (lastQuoteIndex > -1) {
                    propValue = context.source.slice(0, lastQuoteIndex); // 获取属性值
                    advanceBy(propValue.length + 1);
                }
                else {
                    error("prop value of ".concat(propName, " lacks a quote."), context.source);
                }
            }
            else {
                // 属性值未带引号的情况
                var match_1 = HTML_TAG_PROP_VALUE_WITHOUT_QUOTE.exec(context.source);
                propValue = match_1[0];
                advanceBy(propValue.length);
            }
            if (propValue.replace(/(^s*)|(s*$)/g, "").length == 0) {
                error("the value of prop '".concat(propName, "' cannot be blank"), {
                    propName: propName,
                    propValue: propValue
                });
            }
            advanceSpaces();
            // 处理prop类型与指令
            var prop = parseDirectives(propName, propValue);
            props.push(prop);
        }
        return props;
    }
    /**
     * 解析HTML标签
     * @param context 上下文对象
     * @param type 标签类型
     */
    function parseTag(context, type) {
        if (type === void 0) { type = 'start'; }
        var advanceBy = context.advanceBy, advanceSpaces = context.advanceSpaces;
        // 根据标签类型使用不同的正则
        var match = type === 'start'
            ? HTML_START_TAG_REG.exec(context.source)
            : HTML_END_TAG_REG.exec(context.source);
        var tag = match[1]; // 匹配到的标签名称
        advanceBy(match[0].length); // 消费该标签内容
        advanceSpaces();
        var props = parseAttributes(context); // 解析标签属性
        var isSelfClosing = selfClosingTags.includes(tag);
        advanceBy(isSelfClosing
            ? (context.source.startsWith('/>') ? 2 : 1)
            : 1); // 自闭合标签则根据情况消费'>'或'/>'
        return {
            type: 'Element',
            tag: tag,
            props: props,
            children: [],
            isSelfClosing: isSelfClosing
        };
    }
    /**
     * 解析HTML完整标签元素
     * @param context 上下文对象
     * @param parenStack 父节点栈
     */
    function parseElement(context, parenStack) {
        var element = parseTag(context);
        if (element.isSelfClosing)
            return element; // 自闭合标签无子节点，直接返回
        // 根据标签类型切换解析模式
        if (element.tag === 'textarea' || element.tag === 'title') {
            context.mode = 1 /* ParserModes.RCDATA */;
        }
        else if (HTML_RAWTEXT_TAG_REG.test(element.tag)) {
            context.mode = 2 /* ParserModes.RAWTEXT */;
        }
        else {
            context.mode = 0 /* ParserModes.DATA */;
        }
        parenStack.push(element); // 作为父节点入栈
        element.children = parseChildren(context, parenStack);
        parenStack.pop(); // 解析完所有子元素即出栈
        if (context.source.startsWith("</".concat(element.tag))) {
            parseTag(context, 'end');
        }
        else {
            error("".concat(element.tag, " lacks the end tag."), context.source);
        }
        return element;
    }
    /**
     * 解析注释标签
     * @param context 上下文对象
     */
    function parseComment(context) {
        context.advanceBy('<!--'.length);
        var closeIndex = context.source.indexOf('-->');
        if (closeIndex < 0) {
            error("the comment block lacks the end tag \"-->\"", context.source);
        }
        // 获取注释内容
        var content = context.source.slice(0, closeIndex);
        context.advanceBy(content.length);
        context.advanceBy('-->'.length);
        return {
            type: 'Comment',
            content: content
        };
    }
    /**
     * 解析文本插值
     * @param context 上下文对象
     */
    function parseInterpolation(context) {
        context.advanceBy('{{'.length);
        var closeIndex = context.source.indexOf('}}');
        if (closeIndex < 0) {
            error("the interpolation block lacks the end tag \"}}\"", context.source);
        }
        // 获取插值表达式
        var content = context.source.slice(0, closeIndex);
        context.advanceBy(content.length);
        context.advanceBy('}}'.length);
        return {
            type: 'Interpolation',
            content: {
                type: 'Expression',
                content: decodeHTMLText(content)
            }
        };
    }
    /**
     * 解析纯文本内容
     * @param context 上下文对象
     */
    function parseText(context) {
        var lastIndex = context.source.length;
        var lessThanSignIndex = context.source.indexOf('<'); // 寻找标签<符
        var delimiterIndex = context.source.indexOf('{{'); // 寻找文本插值符{{
        // 取两种符号索引较小的作为结束索引
        if (lessThanSignIndex > -1 && lessThanSignIndex < lastIndex) {
            lastIndex = lessThanSignIndex;
        }
        if (delimiterIndex > -1 && delimiterIndex < lastIndex) {
            lastIndex = delimiterIndex;
        }
        var content = context.source.slice(0, lastIndex);
        context.advanceBy(content.length);
        return {
            type: 'Text',
            content: decodeHTMLText(content)
        };
    }

    /**
     * 解析HTML文本模版并转化为模版AST
     * @param template HTML文本
     */
    function parse(template) {
        // 解析器上下文对象
        var context = {
            source: template,
            mode: 0 /* ParserModes.DATA */,
            advanceBy: function (num) {
                // 消费指定数量字符
                context.source = context.source.slice(num);
            },
            advanceSpaces: function () {
                // 匹配空白字符
                var match = BLANK_CHAR_REG.exec(context.source);
                if (match) {
                    // 清除空白字符
                    context.advanceBy(match[0].length);
                }
            },
            trimEndSpaces: function () {
                context.source = context.source.trimEnd();
            }
        };
        // 先清除两端空白
        context.advanceSpaces();
        context.trimEndSpaces();
        var nodes = parseChildren(context, []);
        return {
            type: 'Root',
            children: nodes
        };
    }

    /**
     * 深度优先遍历节点
     * @param templateAST 需要遍历的ast
     * @param context 上下文对象
     */
    function traverseNode(templateAST, context) {
        // debugger
        context.currentNode = templateAST;
        var exitFns = [];
        // 对当前节点进行转换操作
        var transforms = context.nodeTransforms;
        for (var i_1 = 0; i_1 < transforms.length; i_1++) {
            var onExit = transforms[i_1](context.currentNode, context); // 转换函数的返回函数作为退出阶段的回调函数
            if (onExit) {
                exitFns.push(onExit);
            }
            if (!context.currentNode)
                return; // 若转换后当前node不存在则停止操作
        }
        // 遍历子节点进行转换操作
        var children = context.currentNode.children;
        if (children) {
            for (var i_2 = 0; i_2 < children.length; i_2++) {
                context.parent = context.currentNode;
                context.childIndex = i_2;
                // 递归透传context
                traverseNode(children[i_2], context);
            }
        }
        // 退出阶段
        var i = exitFns.length;
        while (i--) {
            exitFns[i]();
        }
    }

    var JS_VARIABLE_NAME_VALIDATOR = /^([^\x00-\xff]|[a-zA-Z_$])([^\x00-\xff]|[a-zA-Z0-9_$])*$/i;

    /**
     * 创建StringLiteral型的JsAST
     * @param value string值
     */
    function createStringLiteral(value) {
        return {
            type: 'StringLiteral',
            value: value
        };
    }
    /**
     * 创建Identifier型的JsAST
     * @param name identifier值
     */
    function createIdentifier(name) {
        return {
            type: 'Identifier',
            name: name
        };
    }
    /**
     * 创建ArrayExpression型的JsAST
     * @param elements JsAST数组
     */
    function createArrayExpression(elements) {
        return {
            type: 'ArrayExpression',
            elements: elements
        };
    }
    /**
     * 创建CallExpression型的JsAST
     * @param callee 要call的函数名
     * @param args 传入的参数
     */
    function createCallExpression(callee, args) {
        return {
            type: 'CallExpression',
            callee: createIdentifier(callee),
            arguments: args
        };
    }
    /**
     * 创建表达式型的JsAST
     * @param value 表达式字符串
     */
    function createExpressionLiteral(value) {
        return {
            type: 'ExpressionLiteral',
            value: value
        };
    }
    /**
     * 创建键值对型JsAST
     * @param first 键node
     * @param last 值node
     */
    function createPairNode(first, last) {
        return {
            type: 'KeyValuePair',
            first: first,
            last: last
        };
    }
    /**
     * 创建一个预构建的[key: string]: any型键值对JsAST
     * @param key 键
     * @param value 值
     * @param type 值类型
     */
    function createKeyValueObjectNode(key, value, type) {
        var first = createStringLiteral(key);
        var last;
        // 若存在type，按type创建值ast对象
        if (type && typeof value === 'string') {
            last = type === 'StringLiteral' ? createStringLiteral(value) : createExpressionLiteral(value);
        }
        else if (typeof value !== 'string') {
            // 若value为已构建好的ast则直接传入
            last = value;
        }
        return createPairNode(first, last);
    }
    /**
     * 转换文本节点
     * @param node 目标节点
     */
    function transformText(node) {
        if (node.type !== 'Text') {
            return;
        }
        node.jsNode = createCallExpression('_v', [
            createStringLiteral(node.content)
        ]);
    }
    /**
     * 转换注释节点
     * @param node 目标节点
     */
    function transformComment(node) {
        if (node.type !== 'Comment') {
            return;
        }
        node.jsNode = createCallExpression('_h', [
            createStringLiteral('comment'),
            { type: 'ObjectExpression', elements: [] },
            createStringLiteral(node.content)
        ]);
    }
    /**
     * 转换插值节点
     * @param node 目标节点
     */
    function transformInterpolation(node) {
        if (node.type !== 'Interpolation') {
            return;
        }
        // 插值表达式需转换为字符串以显示
        var callExp = createCallExpression('_s', [
            createExpressionLiteral(node.content.content)
        ]);
        // 字符串内容再转换成为文本节点
        node.jsNode = createCallExpression('_v', [
            callExp
        ]);
    }
    /**
     * 转换标签节点
     * @param node 目标节点
     */
    function transformElement(node) {
        // 置于退出阶段的回调函数，保证子节点全部处理完毕
        return function () {
            if (node.type !== 'Element') {
                return;
            }
            // 创建_h函数的调用
            var callExp = createCallExpression('_h', [
                createStringLiteral(node.tag)
            ]);
            // _h第二个参数为解析node的属性值
            if (node.props && node.props.length > 0) {
                // 将props分类依次转换
                var attrs_1 = [];
                var directives_1 = [];
                var events_1 = [];
                // 创建一个props描述对象
                var elementDescriptor = {
                    type: 'ObjectExpression',
                    elements: [
                        {
                            type: 'KeyValuePair',
                            first: createStringLiteral('directives'),
                            last: {
                                type: 'ObjectExpression',
                                elements: directives_1
                            }
                        },
                        {
                            type: 'KeyValuePair',
                            first: createStringLiteral('on'),
                            last: {
                                type: 'ObjectExpression',
                                elements: events_1
                            }
                        },
                        {
                            type: 'KeyValuePair',
                            first: createStringLiteral('attrs'),
                            last: {
                                type: 'ObjectExpression',
                                elements: attrs_1
                            }
                        }
                    ]
                };
                // 依次解析不同的prop并分类
                node.props.forEach(function (prop) {
                    if (prop.type === 'Directive') { // 指令节点
                        directives_1.push(createKeyValueObjectNode(prop.name, prop.exp.content, 'Expression'));
                    }
                    else if (prop.type === 'Event') { // 事件处理函数节点
                        events_1.push(createKeyValueObjectNode(prop.name, 
                        // 若函数名合法则校验是否为函数并判断是否需要包装函数体
                        "(typeof (".concat(JS_VARIABLE_NAME_VALIDATOR.test(prop.exp.content) ? prop.exp.content : 'null', ") === 'function') ? (").concat(prop.exp.content, ") : () => { (").concat(prop.exp.content, ") }"), 'Expression'));
                    }
                    else if (prop.type === 'ReactiveProp') { // 绑定响应式数据的prop节点
                        attrs_1.push(createKeyValueObjectNode(prop.name, prop.exp.content, 'Expression'));
                    }
                    else {
                        // 字符串型attrs
                        attrs_1.push(createKeyValueObjectNode(prop.name, prop.value, 'StringLiteral'));
                    }
                });
                // 解析并转换内置指令，优先级最高，因此在解析完常规props后才进行此操作
                transformDirectiveExpression(node.props, {
                    events: events_1,
                    attrs: attrs_1,
                    createKeyValueObjectNode: createKeyValueObjectNode
                });
                callExp.arguments.push(elementDescriptor);
            }
            else {
                callExp.arguments.push({ type: 'ObjectExpression', elements: [] });
            }
            // _h第三个参数为全部子节点
            callExp.arguments.push(createArrayExpression(node.children.map(function (c) { return c.jsNode; })));
            node.jsNode = callExp;
        };
    }
    function transformRoot(node) {
        // 置于退出阶段的回调函数，保证子节点全部处理完毕
        return function () {
            if (node.type !== 'Root') {
                return;
            }
            var vnodeJSAST = node.children[0].jsNode; // 根节点只能有一个子元素
            if (node.children.length > 1) {
                warn("the template requires only one child node, detected ".concat(node.children.length, ". \n            The DdBind parser will only parse the first one"), null);
            }
            node.jsNode = {
                type: 'FunctionDeclaration',
                id: { type: 'Identifier', name: 'render' },
                body: [{
                        type: 'ReturnStatement',
                        return: vnodeJSAST
                    }]
            };
        };
    }

    /**
     * 将模版AST转换为JS AST
     * @param templateAST 目标模版AST
     */
    function transform(templateAST) {
        var context = {
            currentNode: null,
            childIndex: 0,
            parent: null,
            nodeTransforms: [
                transformText,
                transformComment,
                transformInterpolation,
                transformElement,
                transformRoot
            ]
        };
        traverseNode(templateAST, context);
        return templateAST.jsNode;
    }

    var TextVnodeSymbol = Symbol('TextVnodeSymbol');
    var CommentVnodeSymbol = Symbol('CommentVnodeSymbol');

    /**
     * vnode的建造者方法实现类
     */
    var VnodeUtil = /** @class */ (function () {
        function VnodeUtil() {
        }
        VnodeUtil.builder = function () {
            return new VnodeBuilder();
        };
        return VnodeUtil;
    }());
    var VnodeImpl = /** @class */ (function () {
        function VnodeImpl() {
        }
        return VnodeImpl;
    }());
    var VnodeBuilder = /** @class */ (function () {
        function VnodeBuilder() {
            this.if = true;
        }
        VnodeBuilder.prototype.setType = function (type) {
            this.type = type;
            return this;
        };
        VnodeBuilder.prototype.setChildren = function (children) {
            this.children = children;
            return this;
        };
        VnodeBuilder.prototype.setProps = function (props) {
            this.props = props;
            return this;
        };
        VnodeBuilder.prototype.setEl = function (el) {
            this.el = el;
            return this;
        };
        VnodeBuilder.prototype.setIf = function (value) {
            this.if = value;
        };
        VnodeBuilder.prototype.build = function () {
            var _this = this;
            var vnode = new VnodeImpl();
            Object.keys(this).forEach(function (key) {
                vnode[key] = _this[key];
            });
            return vnode;
        };
        return VnodeBuilder;
    }());

    /**
     * 创建一个Vnode节点
     * @param type Vnode类别
     * @param props Vnode的props对象
     * @param children 子节点
     */
    function createVnode(type, props, children) {
        if (type === 'comment') {
            return VnodeUtil.builder().setType(CommentVnodeSymbol).setChildren(children).build();
        }
        else {
            var builder = VnodeUtil.builder().setType(type).setChildren(children);
            var propsObject = {}; // 空对象用以暂存prop数据
            // 处理prop数据
            patchProps$1(props, propsObject);
            // 根据表达式解析并设置vnode的渲染flag
            if (propsObject['_if_'] !== undefined && !propsObject['_if_']) {
                builder.setIf(false);
            }
            else {
                builder.setIf(true);
            }
            // 设置属性值
            builder.setProps(propsObject);
            return builder.build();
        }
    }
    /**
     * 创建一个文本节点
     * @param value 文本内容
     */
    function createTextVnode(value) {
        return VnodeUtil.builder().setType(TextVnodeSymbol).setChildren(value).build();
    }
    /**
     * 将目标内容转化为文本内容
     * @param value 目标值
     */
    function stringVal(value) {
        return value === null
            ? ''
            : typeof value === 'object'
                ? value.toString()
                : String(value);
    }
    /**
     * 将根据jsAST转换得到的prop对象解析为vnode可以处理的格式
     * @param props 原始props
     * @param target 转换得到的目标对象
     */
    function patchProps$1(props, target) {
        // attrs的内容可以直接添加
        if (props.attrs) {
            Object.assign(target, props.attrs);
        }
        // 将事件转化为prop名的形式
        if (props.on) {
            for (var eventName in props.on) {
                var propKey = 'on' + eventName[0].toUpperCase() + eventName.slice(1, eventName.length); // 构造为以on开头的prop名
                target[propKey] = props.on[eventName];
            }
        }
        // 解析d-show指令表达式内容并设置display样式
        var showDisplay = target['_show_'] !== undefined && !target['_show_'] ? 'none' : '';
        if (Array.isArray(target['_style_'])) {
            target['_style_'].push({ display: showDisplay });
        }
        else if (target['_style_'] && typeof target['style'] === 'object') {
            target['_style_']['display'] = showDisplay;
        }
        else {
            target['_style_'] = { display: showDisplay };
        }
    }

    var Compiler = /** @class */ (function () {
        function Compiler(el, vm) {
            this.$el = el;
            this.$vm = vm;
            // 初始化绑定渲染函数
            this.$vm._h = createVnode;
            this.$vm._v = createTextVnode;
            this.$vm._s = stringVal;
            if (this.$el) {
                this.compileElement(this.$el);
            }
        }
        /**
         * 编译目标元素
         * @param el 目标HTML
         */
        Compiler.prototype.compileElement = function (el) {
            var source = this.$vm.$template || el.innerHTML;
            var templateAST = parse(source); // 编译HTML模版为模版AST
            var jsAST = transform(templateAST); // 将模版AST转换为jsAST
            var code = generate(jsAST); // 根据jsAST生成渲染函数代码
            console.log(code);
            this.$vm.$render = createFunction(code, this.$vm);
        };
        return Compiler;
    }());
    function createFunction(code, vm) {
        try {
            return new Function(code).bind(vm);
        }
        catch (e) {
            error('create function error.', e);
        }
    }

    var activeEffect; // 当前激活的副作用函数
    var effectBucket = new WeakMap(); // 副作用函数桶
    var effectStack = []; // 副作用函数运行栈，避免嵌套副作用函数占用activeEffect的问题
    var iterateBucket = new WeakMap(); // 代理的迭代对象的key值桶
    /**
     * 清除原有依赖关系
     * @param effectFn 副作用函数
     */
    function cleanup(effectFn) {
        effectFn.deps.forEach(function (value) {
            value.delete(effectFn);
        });
        effectFn.deps.length = 0;
    }
    /**
     * 注册副作用函数
     * @param func 副作用函数
     * @param options 副作用函数的执行选项
     */
    function effect(func, options) {
        if (options === void 0) { options = {}; }
        var effectFn = function () {
            cleanup(effectFn);
            activeEffect = effectFn;
            effectStack.push(effectFn);
            var res = func();
            effectStack.pop();
            activeEffect = effectStack[effectStack.length - 1];
            return res;
        };
        effectFn.deps = [];
        effectFn.options = options;
        if (!options.isLazy) {
            effectFn();
        }
        return effectFn;
    }
    /**
     * 追踪并绑定副作用函数
     * @param target 绑定对象
     * @param key 绑定key
     */
    function track(target, key) {
        if (!activeEffect)
            return;
        var depsMap = effectBucket.get(target);
        if (!depsMap) {
            effectBucket.set(target, (depsMap = new Map()));
        }
        if (typeof key === 'symbol') {
            iterateBucket.set(target, key);
        }
        var effects = depsMap.get(key);
        if (!effects) {
            depsMap.set(key, (effects = new Set()));
        }
        effects.add(activeEffect);
        activeEffect.deps.push(effects);
    }
    /**
     * 触发执行副作用函数
     * @param target 绑定对象
     * @param key 绑定key
     * @param type 对代理对象的操作类型(SET/GET/DELETE等)
     */
    function trigger(target, key, type) {
        var depsMap = effectBucket.get(target);
        if (!depsMap)
            return;
        // if (type === 'ADD') {
        //     track(target, key)
        // }
        // depsMap = effectBucket.get(target)
        var effects = depsMap.get(key);
        var effectsToRuns = new Set();
        effects && effects.forEach(function (fn) {
            if (fn !== activeEffect) {
                effectsToRuns.add(fn);
            }
        });
        if (type === 'ADD' && Array.isArray(target)) {
            var lengthEffects = depsMap.get('length');
            lengthEffects && lengthEffects.forEach(function (fn) {
                if (fn != activeEffect) {
                    effectsToRuns.add(fn);
                }
            });
        }
        // 当增加或删除属性时触发迭代时注册的副作用函数
        if (type === 'ADD' || type === 'DELETE') {
            var iterateKey = iterateBucket.get(target);
            iterateKey && depsMap.get(iterateKey).forEach(function (fn) {
                if (fn !== activeEffect) {
                    effectsToRuns.add(fn);
                }
            });
        }
        effectsToRuns.forEach(function (fn) {
            if (fn.options && fn.options.scheduler) {
                fn.options.scheduler(fn);
            }
            else {
                fn();
            }
        });
    }

    /**
     * 判断某个属性是否需要通过setAttribute方式设置
     * @param el 目标dom
     * @param key 目标属性名
     * @param value 属性值
     */
    function shouldSetAsDomProps(el, key, value) {
        if (key === 'form' && el.tagName === 'INPUT')
            return false;
        return key in el;
    }
    /**
     * 通过vnode为真实dom设置props
     * @param el 需要设置的dom
     * @param key 要设置的属性名
     * @param oldValue 旧属性值
     * @param newValue 新属性值
     */
    function patchProps(el, key, oldValue, newValue) {
        // 以on开头的属性视为事件
        if (/^on/.test(key)) {
            var eventName = key.slice(2).toLowerCase();
            var invokers = el._invokers || (el._invokers = {});
            var invoker_1 = invokers[eventName]; // 事件处理函数装饰器
            if (newValue) {
                if (!invoker_1) {
                    // 原来无事件处理函数则注册新的
                    invoker_1 = el._invokers[eventName] = function (event) {
                        // 若事件触发事件早于绑定时间则不处理此事件
                        if (event.timeStamp < invoker_1.attachTime)
                            return;
                        // 处理存在多个事件处理函数的情况
                        if (Array.isArray(invoker_1.value)) {
                            invoker_1.value.forEach(function (fn) { return fn(event); });
                        }
                        else {
                            invoker_1.value(event);
                        }
                    };
                    invoker_1.value = newValue;
                    // 记录此事件的绑定时间
                    invoker_1.attachTime = performance.now();
                    el.addEventListener(eventName, invoker_1);
                }
                else {
                    // 若有事件处理函数则可直接更新
                    invoker_1.value = newValue;
                }
            }
            else if (invoker_1) {
                // 若新值无事件处理函数则清除原事件
                el.removeEventListener(eventName, invoker_1);
            }
        }
        else if (key === 'class') {
            // 针对class属性进行处理
            el.className = newValue || '';
        }
        else if (key === '_style_') {
            // 针对style动态属性进行处理
            if (Array.isArray(newValue)) {
                for (var style in newValue) {
                    Object.assign(el.style, newValue[style]);
                }
            }
            else if (typeof newValue === 'object') {
                Object.assign(el.style, newValue);
            }
        }
        else if (key === '_class_') {
            // 针对class动态属性进行处理
            if (Array.isArray(newValue)) {
                for (var classKey in newValue) {
                    el.classList.add(newValue[classKey]);
                }
            }
            else {
                el.classList.add(newValue);
            }
        }
        else if (shouldSetAsDomProps(el, key)) {
            var type = typeof el[key];
            // 针对HTML attr中boolean型的属性进行处理
            if (type === 'boolean' && newValue === '') {
                el[key] = true;
            }
            else {
                el[key] = newValue;
            }
        }
        else {
            // 不存在于DOM properties的属于用此方法设置
            el.setAttribute(key, newValue);
        }
    }

    /**
     * 完成vnode的挂载更新
     * @param oldVNode 原vnode
     * @param newVNode 需要挂载更新的vnode
     * @param container 渲染容器
     */
    function patch(oldVNode, newVNode, container) {
        if (!newVNode) {
            if (oldVNode) {
                unmountElement(oldVNode);
            }
            return;
        }
        // 若新旧vnode类型不同，则卸载并重新挂载
        if (oldVNode && oldVNode.type !== newVNode.type) {
            unmountElement(oldVNode);
            oldVNode = null;
        }
        var vnodeType = typeof newVNode.type;
        if (vnodeType === 'string') { // vnode为普通标签
            if (!oldVNode || !oldVNode.el) {
                mountElement(newVNode, container); // 挂载vnode
            }
            else {
                updateElement(oldVNode, newVNode); // 更新vnode
            }
        }
        else if (vnodeType === 'object') ;
        else if (vnodeType === 'symbol') { // 标准普通标签以外的标签
            if (newVNode.type === TextVnodeSymbol) { // 文本节点
                if (typeof newVNode.children !== 'string') {
                    error("text node requires children being type of \"string\", received type ".concat(typeof newVNode.children), newVNode);
                }
                if (!oldVNode) {
                    var el = newVNode.el = document.createTextNode(newVNode.children);
                    container.insertBefore(el, null);
                }
                else { // 若原节点存在则更新
                    var el = newVNode.el = oldVNode.el;
                    if (newVNode.children !== oldVNode.children) {
                        el.nodeValue = newVNode.children;
                    }
                }
            }
            else if (newVNode.type === CommentVnodeSymbol) { // 注释节点
                if (typeof newVNode.children !== 'string') {
                    error("comment node requires children being type of \"string\", received type ".concat(typeof newVNode.children), newVNode);
                }
                if (!oldVNode) {
                    var el = newVNode.el = document.createComment(newVNode.children);
                    container.insertBefore(el, null);
                }
                else { // 若原节点存在则更新
                    var el = newVNode.el = oldVNode.el;
                    if (newVNode.children !== oldVNode.children) {
                        el.nodeValue = newVNode.children;
                    }
                }
            }
        }
    }
    /**
     * 将vnode挂载到真实dom
     * @param vnode 需要挂载的vnode
     * @param container 挂载容器
     */
    function mountElement(vnode, container) {
        if (vnode.if) {
            var el_1 = vnode.el = document.createElement(vnode.type);
            // 将每个child挂载到真实dom
            if (typeof vnode.children === 'string') {
                el_1.textContent = vnode.children;
            }
            else if (Array.isArray(vnode.children)) {
                vnode.children.forEach(function (child) {
                    patch(null, child, el_1);
                });
            }
            else {
                patch(null, vnode.children, el_1);
            }
            // 为dom挂载attr
            if (vnode.props) {
                for (var key in vnode.props) {
                    patchProps(el_1, key, null, vnode.props[key]);
                }
            }
            container.insertBefore(el_1, null);
        }
        else if (vnode.el) {
            unmountElement(vnode);
        }
    }
    /**
     * 卸载vnode
     * @param vnode 需要卸载的vnode
     */
    function unmountElement(vnode) {
        var parent = vnode.el.parentNode;
        if (parent) {
            parent.removeChild(vnode.el);
            vnode.el = undefined;
        }
    }
    /**
     * 更新某节点的子节点
     * @param oldVNode 旧vnode
     * @param newVNode 新vnode
     * @param container
     */
    function updateElementChild(oldVNode, newVNode, container) {
        if (newVNode.if) {
            if (typeof newVNode.children === 'string') { // 新vnode的children为字符串的情况
                if (Array.isArray(oldVNode.children)) {
                    oldVNode.children.forEach(function (child) {
                        unmountElement(child);
                    });
                }
                container.textContent = newVNode.children;
            }
            else if (Array.isArray(newVNode.children)) { // 新vnode的children类型为一组组件的情况
                if (Array.isArray(oldVNode.children)) {
                    // 当新老节点children都是一组节点时需要进行Diff操作
                    // 在尽可能减少DOM操作的情况下更新节点内容
                    var oldChildren = oldVNode.children;
                    var newChildren = newVNode.children;
                    var oldLen = oldChildren.length;
                    var newLen = newChildren.length;
                    var commonLen = Math.min(oldLen, newLen);
                    for (var i = 0; i < commonLen; i++) {
                        patch(oldChildren[i], newChildren[i], container);
                    }
                    // 若新子节点数大于旧子节点，说明有新的元素需要挂载
                    // 否则说明需要卸载旧节点
                    if (newLen > oldLen) {
                        for (var i = commonLen; i < newLen; i++) {
                            patch(null, newChildren[i], container);
                        }
                    }
                    else if (oldLen > newLen) {
                        for (var i = commonLen; i < oldLen; i++) {
                            unmountElement(oldChildren[i]);
                        }
                    }
                }
                else {
                    container.textContent = '';
                    newVNode.children.forEach(function (child) {
                        patch(null, child, container);
                    });
                }
            }
            else { // 若新子节点不存在则挨个卸载
                if (Array.isArray(oldVNode.children)) {
                    oldVNode.children.forEach(function (child) {
                        unmountElement(child);
                    });
                }
                else if (typeof oldVNode.children === 'string') {
                    container.textContent = '';
                }
            }
        }
        else {
            unmountElement(oldVNode);
        }
    }
    /**
     * 更新修补vnode并重新挂载
     * @param oldVNode
     * @param newVNode
     */
    function updateElement(oldVNode, newVNode) {
        if (newVNode.if) {
            var el = newVNode.el = oldVNode.el;
            var oldProps = oldVNode.props;
            var newProps = newVNode.props;
            // 更新props
            for (var key in newProps) {
                if (newProps[key] !== oldProps[key]) {
                    patchProps(el, key, oldProps[key], newProps[key]);
                }
            }
            // 清除新vnode中不存在的老prop
            for (var key in oldProps) {
                if (!(key in newProps)) {
                    patchProps(el, key, oldProps[key], null);
                }
            }
            // 更新子节点
            updateElementChild(oldVNode, newVNode, el);
        }
        else {
            unmountElement(oldVNode);
        }
    }

    /**
     * 创建一个渲染器
     */
    function createRenderer() {
        /**
         * 渲染vnode到真实dom
         * @param vnode 虚拟dom
         * @param container 渲染容器dom
         */
        function render(vnode, container) {
            if (vnode) {
                patch(container._vnode, vnode, container); // 挂载或更新vnode
            }
            else {
                if (container._vnode) {
                    unmountElement(container._vnode); // 卸载原有vnode
                }
            }
            container._vnode = vnode;
        }
        return {
            render: render
        };
    }

    var reactiveMap = new Map();
    /**
     * 为所有代理对象与数组绑定新的toString()
     */
    Object.prototype.toString = function () {
        return JSON.stringify(this); // 输出对象值而非[Object object]
    };
    Array.prototype.toString = function () {
        return JSON.stringify(this);
    };
    /**
     * 获取一个唯一的代理handler
     */
    function handler() {
        return {
            set: function (target, p, newValue, receiver) {
                var oldValue = target[p];
                // 对set对类型进行针对常规对象和数组的优化
                var type = Array.isArray(target)
                    ? (Number(p) < target.length ? 'SET' : 'ADD')
                    : (Object.prototype.hasOwnProperty.call(target, p) ? 'SET' : 'ADD');
                var res = Reflect.set(target, p, newValue, receiver);
                // 只有当值发生变化时才更新
                if (oldValue !== newValue && (oldValue === oldValue || newValue === newValue)) {
                    trigger(target, p, type);
                }
                return res;
            },
            get: function (target, p, receiver) {
                var res = Reflect.get(target, p, receiver);
                track(target, p);
                if (typeof res === 'object' && res !== null) {
                    // 为每个对象绑定追踪
                    for (var resKey in res) {
                        track(res, resKey);
                    }
                    return reactive(res);
                }
                return res;
            },
            has: function (target, p) {
                track(target, p);
                return Reflect.has(target, p);
            },
            ownKeys: function (target) {
                track(target, Array.isArray(target) ? 'length' // 若遍历对象为数组则可直接代理length属性
                    : Symbol('iterateKey')); // 设置一个与target关联的key
                return Reflect.ownKeys(target);
            },
            deleteProperty: function (target, p) {
                var hasKey = Object.prototype.hasOwnProperty.call(target, p);
                var res = Reflect.deleteProperty(target, p);
                if (res && hasKey) {
                    trigger(target, p, 'DELETE');
                }
                return res;
            },
        };
    }
    /**
     * 创建一个代理非原始值的响应式对象
     * @param value 响应式对象值
     */
    function reactive(value) {
        if ((typeof value !== "object" || value === null)) {
            error('reactive() requires an object parameter', value);
        }
        // 检查是否已创建了对应的代理对象，有则直接返回
        var existProxy = reactiveMap.get(value);
        if (existProxy)
            return existProxy;
        var proxy = new Proxy(value, handler());
        reactiveMap.set(value, proxy);
        return proxy;
    }

    /**
     * 创建一个基于响应式对象的保留其响应式能力的属性
     * @param target 目标响应式对象
     * @param key 目标键
     */
    function toRef(target, key) {
        var wrapper = {
            get value() {
                return target[key];
            },
            set value(val) {
                target[key] = val;
            }
        };
        // 标识是否为ref对象
        Object.defineProperty(wrapper, '_is_Ref_', {
            value: true
        });
        return wrapper;
    }
    /**
     * 响应式对象转换，使所有键都具有响应式能力
     * @param target 目标响应式对象
     */
    function toRefs(target) {
        var ret = {};
        for (var key in target) {
            ret[key] = toRef(target, key);
        }
        return ret;
    }
    /**
     * 创建一个代理对象，在其中可以自动脱ref
     * @param target 目标对象
     */
    function proxyRefs(target) {
        return new Proxy(target, {
            get: function (target, p, receiver) {
                var value = Reflect.get(target, p, receiver);
                return (value && value._is_Ref_) ? value.value : value; // 若为ref型对象则返回其value
            },
            set: function (target, p, newValue, receiver) {
                var value = target[p];
                if (value && value._is_Ref_) { // 若为ref型对象则设置其value
                    value.value = newValue;
                    return true;
                }
                return Reflect.set(target, p, newValue, receiver);
            }
        });
    }
    /**
     * 创建一个可以代理原始值的响应式数据对象
     * @param value 目标值
     */
    function ref(value) {
        var wrapper = {
            value: value
        };
        Object.defineProperty(wrapper, '_is_Ref_', {
            value: true
        });
        return reactive(wrapper);
    }

    /**
     * 创建一个计算属性
     * @param getter 计算属性方法
     */
    function computed(getter) {
        var buffer; // 缓存上一次计算值
        var dirty = true; // 脏值flag，脏值检测依赖的是响应式数据Proxy
        var effectFn = effect(getter, {
            isLazy: true,
            // 当依赖的响应式数据发生变化时刷新缓存
            scheduler: function () {
                dirty = true;
                trigger(obj, 'value'); // 因为执行副作用函数模式为懒加载，当依赖的响应式数据发送变化时需手动触发其副作用函数
            }
        });
        var obj = {
            get value() {
                if (dirty) {
                    buffer = effectFn();
                    dirty = false;
                }
                track(obj, 'value'); // 添加依赖的响应式对象到计算属性的依赖
                return buffer;
            }
        };
        obj.toString = function () {
            return this.value;
        };
        return obj;
    }

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    /**
     * 遍历对象属性使其绑定响应
     */
    function traverseRef(value, traversed) {
        if (traversed === void 0) { traversed = new Set(); }
        if (!value || typeof value !== 'object' || traversed.has(value))
            return;
        traversed.add(value);
        for (var valueKey in value) {
            traverseRef(value[valueKey], traversed);
        }
        return value;
    }
    /**
     * 注册一个侦听器
     * @param target 侦听对象
     * @param callback 对象值发生变化时执行的回调
     */
    function watch(target, callback) {
        if (typeof target !== "object") {
            warn("watch() requires a object as watching target, received type is ".concat(typeof target), target);
        }
        var getter; // 需要注册的getter函数
        // 若为用户定义的getter则直接使用
        if (typeof target === 'function') {
            getter = target;
        }
        else {
            getter = function () { return traverseRef(target); };
        }
        var newValue, oldValue;
        var onExpiredHandler;
        var onExpired = function (fn) {
            onExpiredHandler = fn;
        };
        var effectFn = effect(getter, {
            isLazy: true,
            scheduler: function () {
                var data = effectFn();
                newValue = (data._is_Ref_)
                    ? data.value
                    : (typeof data === 'object'
                        ? __assign({}, data) : data);
                if (onExpiredHandler)
                    onExpiredHandler(); // 若注册了过期函数则在回调前执行
                callback(newValue, oldValue, onExpired);
                oldValue = newValue;
            }
        });
        oldValue = __assign({}, effectFn()); // 防止与newValue引用同一对象
    }

    /**
     * app对象，同时也是响应式数据绑定this的vm对象
     */
    var DdBind = /** @class */ (function () {
        function DdBind(options) {
            this.$options = options;
        }
        /**
         * 将app挂载到指定dom上
         * @param el dom或selector
         */
        DdBind.prototype.mount = function (el) {
            var _this = this;
            var container;
            if (typeof el === 'string') {
                container = document.querySelector(el);
            }
            else {
                container = el || document.body;
            }
            this.$template = this.$options.template;
            this.$el = container;
            // 创建对应编译器
            this.$compile = new Compiler(container, this);
            // 创建渲染器
            this.$renderer = createRenderer();
            // 清空container原有的HTML结构
            container.innerHTML = '';
            this._bind();
            // 注册响应式数据，当数据改变时重新渲染
            effect(function () {
                _this.$vnode = _this.$render(); // 挂载并渲染vnode
                _this.$renderer.render(_this.$vnode, _this.$el);
            });
            // 绑定完成即触发onMounted钩子
            this.$options.onMounted && this.$options.onMounted.bind(this)();
        };
        /**
         * 将vm对象与option数据进行绑定
         */
        DdBind.prototype._bind = function () {
            var setups = this.$options.setup.bind(this)(); // 为setup绑定当前执行环境
            var methods = this.$options.methods;
            this.$data = this.$options.data();
            Object.assign(setups, this.$data);
            // 将setup返回值处理为data或methods
            for (var setupsKey in setups) {
                if (setups[setupsKey] instanceof Function) {
                    methods[setupsKey] = setups[setupsKey];
                }
                else {
                    this.$data[setupsKey] = setups[setupsKey]; // 合并setup与data块的属性
                }
            }
            // 绑定计算属性
            var computedList = this.$options.computed;
            for (var key in computedList) {
                if (!key.startsWith('$') && !key.startsWith('_')) {
                    Object.defineProperty(this, key, {
                        value: computed(computedList[key].bind(this)),
                        writable: false
                    });
                }
            }
            // 绑定方法
            for (var key in methods) {
                if (!key.startsWith('$') && !key.startsWith('_')) {
                    Object.defineProperty(this, key, {
                        value: methods[key].bind(this),
                        writable: false
                    });
                }
            }
            // 绑定响应式数据
            for (var key in this.$data) {
                if (!this.$data[key]._is_Ref_) {
                    this.$data[key] = ref(this.$data[key]);
                }
            }
            Object.assign(this, this.$data); // 将data绑定在当前vm对象上
            // 绑定侦听属性
            var watchesFn = this.$options.watch;
            for (var key in watchesFn) {
                if (!key.startsWith('$') && !key.startsWith('_')) {
                    watch(this.$data[key], watchesFn[key]); // 绑定在vm上的ref已经自动解value，要实现侦听需要使用$data里的原始响应式对象
                }
            }
        };
        return DdBind;
    }());

    function createApp(options) {
        return proxyRefs(new DdBind(options));
    }

    exports.DdBind = DdBind;
    exports.computed = computed;
    exports.createApp = createApp;
    exports.effect = effect;
    exports.proxyRefs = proxyRefs;
    exports.reactive = reactive;
    exports.ref = ref;
    exports.toRefs = toRefs;
    exports.watch = watch;

}));
