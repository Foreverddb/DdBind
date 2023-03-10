/*!
 * ddb's mvvm-learning-framework 
 * ddbind framework as a temporary name 
 * for Baidu's courses
 */
let warn;
let error;
{
    warn = (msg, source) => {
        console.warn(`[DdBind-warn]: at ${source} \n ${msg}`);
    };
    error = (msg, source) => {
        console.error(`[DdBind-error]: at ${source} \n ${msg}`);
    };
}

const HTML_START_TAG_REG = /^<([a-z][^\t\r\n\f />]*)/i;
const HTML_END_TAG_REG = /^<\/([a-z][^\t\r\n\f />]*)/i;
const HTML_RAWTEXT_TAG_REG = /style|xmp|iframe|noembed|noframes|noscript/;
const HTML_TAG_PROP_REG = /^[^\t\r\n\f />][^\t\r\n\f/>=]*/;
const HTML_TAG_PROP_VALUE_WITHOUT_QUOTE = /^[^\t\r\n\f >]+/;
const BLANK_CHAR_REG = /^[\t\r\n\f ]+/;
const HTML_REFERENCE_HEAD_REG = /&(?:#x?)?/i;
const ALPHABET_OR_NUMBER_REG = /[0-9a-z]/i;
const HTML_REFERENCE_HEX_REG = /^&#x([0-9a-f]+);?/i;
const HTML_REFERENCE_NUMBER_REG = /^&#([0-9]+);?/;

const selfClosingTags = [
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
const decodeMapKeyMaxLen = 31;
const CCR_REPLACEMENTS = {
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
const decodeMap = {
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
 * ?????????JsAST??????????????????????????????
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
 * ?????????????????????
 * @param node ????????????
 * @param context ???????????????
 */
function genFunctionDeclaration(node, context) {
    // ??? context ???????????????????????????
    const { push, indent, deIndent } = context;
    push(`with(this) `);
    push(`{`);
    indent();
    // ?????????
    node.body.forEach(n => genNode(n, context));
    deIndent();
    push(`}`);
}
/**
 * ?????????????????????
 * @param node ????????????
 * @param context ???????????????
 */
function genReturnStatement(node, context) {
    const { push } = context;
    push(`return `);
    genNode(node.return, context);
}
/**
 * ?????????????????????????????????
 * @param node ????????????
 * @param context ???????????????
 */
function genCallExpression(node, context) {
    const { push } = context;
    const { callee, arguments: args } = node;
    push(`${callee.name}(`);
    genNodeList(args, context);
    push(`)`);
}
/**
 * ??????????????????
 * @param nodes ????????????
 * @param context ???????????????
 */
function genNodeList(nodes, context) {
    const { push } = context;
    for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        genNode(node, context);
        if (i < nodes.length - 1) {
            push(', ');
        }
    }
}
/**
 * ?????????????????????
 * @param node ????????????
 * @param context ???????????????
 */
function genStringLiteral(node, context) {
    const { push } = context;
    // ???????????????????????????????????????
    node.value = node.value
        .replaceAll(/\n/g, ' ')
        // ????????????????????????????????????
        .replaceAll(/'/g, `\\'`);
    // ????????????????????????????????????????????? node.value ????????????????????????
    push(`'${node.value}'`);
}
/**
 * ???????????????????????????
 * @param node ??????????????????
 * @param context ???????????????
 */
function genArrayExpression(node, context) {
    const { push, indent, deIndent } = context;
    push('[');
    indent();
    genNodeList(node.elements, context);
    deIndent();
    push(']');
}
/**
 * ??????js???????????????
 * @param node ????????????
 * @param context ???????????????
 */
function genExpressionLiteral(node, context) {
    const { push } = context;
    push(`(${node.value})`);
}
/**
 * ??????????????????????????????
 * @param node ????????????
 * @param context ???????????????
 */
function genKeyValuePair(node, context) {
    const { push } = context;
    genNode(node.first, context);
    push(': ');
    genNode(node.last, context);
}
/**
 * ???????????????????????????
 * @param node ????????????
 * @param context ???????????????
 */
function genObjectExpression(node, context) {
    const { push, indent, deIndent } = context;
    push('{');
    indent();
    genNodeList(node.elements, context);
    deIndent();
    push('}');
}

function genGuard(condition) {
    return `if (${condition}) return; `;
}
const codeGuards = {
    'd-model': genGuard('$event.target.composing')
};

/**
 * ??????jsAST????????????????????????
 * @param jsAST ??????jsAST
 */
function generate(jsAST) {
    const context = {
        code: '',
        currentIndent: 0,
        push(code) {
            context.code += code;
        },
        newLine() {
            // ?????????????????????????????????????????????????????????
            {
                context.code += '\n' + '  '.repeat(context.currentIndent);
            }
        },
        indent() {
            {
                context.currentIndent++;
                context.newLine();
            }
        },
        deIndent() {
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
 * directive?????????????????????
 */
const directiveHandler = {
    modelHandler(directive, context) {
        const { createKeyValueObjectNode } = context;
        // model???????????????input??????????????????ref??????
        context.events.push(createKeyValueObjectNode('input', `($event) => { ${codeGuards[directive.name]} (${directive.exp.content}) = $event.target.value }`, 'Expression'));
        context.attrs.push(createKeyValueObjectNode('value', `(${directive.exp.content})`, 'Expression'));
    },
    showHandler(directive, context) {
        const { createKeyValueObjectNode } = context;
        // show?????????????????????style??????????????????????????????
        context.attrs.push(createKeyValueObjectNode('_show_', `${directive.exp.content}`, 'Expression'));
    },
    ifHandler(directive, context) {
        const { createKeyValueObjectNode } = context;
        // if???????????????vnode??????????????????????????????????????????
        context.attrs.push(createKeyValueObjectNode('_if_', directive.exp.content, 'Expression'));
    },
    htmlHandler(directive, context) {
        const { createKeyValueObjectNode } = context;
        context.attrs.push(createKeyValueObjectNode('innerHTML', directive.exp.content, 'Expression'));
    }
};

/**
 * ??????directives?????????????????????????????????
 * @param directives ????????????
 * @param context ???????????????
 */
function transformDirectiveExpression(directives, context) {
    // ??????????????????
    directives.filter(x => x.type === 'Directive').forEach((directive) => {
        genDirectiveExpression(directive, context);
    });
}
/**
 * ????????????????????????JsAST
 * @param directive ??????????????????
 * @param context ???????????????
 */
function genDirectiveExpression(directive, context) {
    // ???????????????d-
    const directiveName = directive.name.slice(2, directive.name.length);
    // ??????handler?????????????????????
    directiveHandler[directiveName + 'Handler'](directive, context);
}

/**
 * ???????????????????????????????????????????????????????????????
 * @param propName ?????????
 * @param propValue ?????????
 */
function parseDirectives(propName, propValue) {
    let prop;
    if (propName.startsWith('@') || propName.startsWith('d-on:') || propName.startsWith('on')) {
        // ??????????????????
        prop = {
            type: 'Event',
            // ?????????
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
        const attrName = propName.startsWith(':')
            ? propName.slice(1, propName.length)
            : propName.slice(7, propName.length);
        // ??????????????????
        prop = {
            type: 'ReactiveProp',
            name: attrName,
            exp: {
                type: 'Expression',
                content: propValue
            }
        };
        // style???class????????????????????????????????????
        if (attrName === 'style' || attrName === 'class') {
            prop.name = `_${attrName}_`;
        }
    }
    else if (propName.startsWith('d-')) {
        // ??????????????????
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
        // ?????????HTML attr
        prop = {
            type: 'Attribute',
            name: propName,
            value: propValue
        };
    }
    return prop;
}

/**
 * ??????HTML??????????????????
 * @param rawText ?????????????????????
 * @param asAttr ???????????????????????????
 */
function decodeHTMLText(rawText, asAttr = false) {
    let offset = 0;
    // ??????????????????????????????
    let decodedText = '';
    const endIndex = rawText.length;
    // advance ???????????????????????????
    function advance(length) {
        offset += length;
        rawText = rawText.slice(length);
    }
    while (offset < endIndex) {
        // ????????????????????????
        // &?????????????????????
        // &#??????????????????????????????
        // &#x?????????????????????????????????
        const head = HTML_REFERENCE_HEAD_REG.exec(rawText);
        // ??????????????????????????????
        if (!head) {
            const remaining = endIndex - offset;
            decodedText += rawText.slice(0, remaining);
            advance(remaining);
            break;
        }
        decodedText += rawText.slice(0, head.index);
        advance(head.index); // ??????&????????????
        if (head[0] === '&') {
            let name = '';
            let value = undefined;
            if (ALPHABET_OR_NUMBER_REG.test(rawText[1])) {
                // ???????????????????????????????????????????????????????????????
                for (let length = decodeMapKeyMaxLen; !value && length > 0; --length) {
                    name = rawText.slice(1, 1 + length);
                    value = decodeMap[name];
                }
                if (value) {
                    const semi = (rawText[1 + name.length] || '') === ';';
                    // ?????????????????????????????????????????????????????????????????????????????????
                    // ????????????????????????????????????????????????????????????(=)???ASCII ??????????????????
                    // ????????? & ??????????????? name ??????????????????
                    if (asAttr &&
                        !semi &&
                        /[=a-z0-9]/i.test(rawText[1 + name.length] || '')) {
                        decodedText += '&' + name;
                        advance(1 + name.length);
                    }
                    else {
                        decodedText += value;
                        advance(semi ? 2 + name.length : 1 + name.length); // ????????????????????????????????????????????????????????????????????????
                    }
                }
                else { // ???????????????????????????
                    decodedText += '&' + name;
                    advance(1 + name.length);
                }
            }
            else {
                decodedText += '&';
                advance(1);
            }
        }
        else {
            // ??????????????????????????????????????????
            const isHex = head[0] === '&#x';
            const pattern = isHex ? HTML_REFERENCE_HEX_REG : HTML_REFERENCE_NUMBER_REG;
            const body = pattern.exec(rawText); // ????????????unicode??????
            if (body) {
                // ?????????????????????????????????
                let codePoint = parseInt(body[1], isHex ? 16 : 10);
                // ??????unicode???????????????????????????
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
                // ??????
                const char = String.fromCodePoint(codePoint);
                decodedText += char;
                advance(body[0].length);
            }
            else { // ????????????????????????????????????
                decodedText += head[0];
                advance(head[0].length);
            }
        }
    }
    return decodedText;
}

/**
 * ???????????????????????????
 * @param context ???????????????
 * @param parenStack ????????????
 */
function parseChildren(context, parenStack) {
    let nodes = [];
    while (!isEnd(context, parenStack)) {
        let node;
        if (context.mode === 0 /* ParserModes.DATA */ || context.mode === 1 /* ParserModes.RCDATA */) {
            // ???DATA??????????????????????????????
            if (context.mode === 0 /* ParserModes.DATA */ && context.source[0] === '<') {
                if (context.source[1] === '!') {
                    if (context.source.startsWith('<!--')) { // ??????????????????
                        node = parseComment(context);
                    }
                    else if (context.source.startsWith('<![CDATA[')) { // CDATA??????
                        error(`the parser is not supporting CDATA mode.`, null);
                        // node = parseCDATA(context, parenStack)
                    }
                }
                else if (context.source[1] === '/') { // ????????????
                    error('invalid end tag in HTML.', context.source);
                    continue;
                }
                else if (/[a-z]/i.test(context.source[1])) {
                    node = parseElement(context, parenStack);
                }
            }
            else if (context.source.startsWith('{{')) { // ??????????????????
                // ????????????
                node = parseInterpolation(context);
            }
        }
        // ???node???????????????????????????DATA?????????????????????text??????
        if (!node) {
            node = parseText(context);
        }
        nodes.push(node);
    }
    return nodes;
}
/**
 * ????????????????????????????????????
 * @param context ???????????????
 * @param parenStack ????????????
 */
function isEnd(context, parenStack) {
    if (!context.source || context.source === '')
        return true;
    // ?????????????????????????????????????????????????????????????????????????????????????????????????????????
    for (let i = parenStack.length - 1; i >= 0; i--) {
        let parent = parenStack[i];
        if (parent && context.source.startsWith(`</${parent.tag}`)) {
            return true;
        }
    }
    return false;
}
/**
 * ??????HTML???????????????
 * @param context ???????????????
 */
function parseAttributes(context) {
    const { advanceBy, advanceSpaces } = context;
    const props = [];
    while (!context.source.startsWith('>') && !context.source.startsWith('/')) {
        const match = HTML_TAG_PROP_REG.exec(context.source);
        const propName = match[0];
        // ???????????????
        advanceBy(propName.length);
        advanceSpaces();
        // ????????????
        advanceBy(1);
        advanceSpaces();
        let propValue = '';
        const quote = context.source[0];
        const isQuote = quote === '"' || quote === "'";
        // ?????????????????????????????????????????????????????????
        if (isQuote) {
            advanceBy(1); // ????????????
            const lastQuoteIndex = context.source.indexOf(quote);
            if (lastQuoteIndex > -1) {
                propValue = context.source.slice(0, lastQuoteIndex); // ???????????????
                advanceBy(propValue.length + 1);
            }
            else {
                error(`prop value of ${propName} lacks a quote.`, context.source);
            }
        }
        else {
            // ??????????????????????????????
            const match = HTML_TAG_PROP_VALUE_WITHOUT_QUOTE.exec(context.source);
            propValue = match[0];
            advanceBy(propValue.length);
        }
        if (propValue.replace(/(^s*)|(s*$)/g, "").length == 0) {
            error(`the value of prop '${propName}' cannot be blank`, {
                propName,
                propValue
            });
        }
        advanceSpaces();
        // ??????prop???????????????
        let prop = parseDirectives(propName, propValue);
        props.push(prop);
    }
    return props;
}
/**
 * ??????HTML??????
 * @param context ???????????????
 * @param type ????????????
 */
function parseTag(context, type = 'start') {
    const { advanceBy, advanceSpaces } = context;
    // ???????????????????????????????????????
    const match = type === 'start'
        ? HTML_START_TAG_REG.exec(context.source)
        : HTML_END_TAG_REG.exec(context.source);
    const tag = match[1]; // ????????????????????????
    advanceBy(match[0].length); // ?????????????????????
    advanceSpaces();
    const props = parseAttributes(context); // ??????????????????
    const isSelfClosing = selfClosingTags.includes(tag);
    advanceBy(isSelfClosing
        ? (context.source.startsWith('/>') ? 2 : 1)
        : 1); // ????????????????????????????????????'>'???'/>'
    return {
        type: 'Element',
        tag,
        props,
        children: [],
        isSelfClosing
    };
}
/**
 * ??????HTML??????????????????
 * @param context ???????????????
 * @param parenStack ????????????
 */
function parseElement(context, parenStack) {
    const element = parseTag(context);
    if (element.isSelfClosing)
        return element; // ??????????????????????????????????????????
    // ????????????????????????????????????
    if (element.tag === 'textarea' || element.tag === 'title') {
        context.mode = 1 /* ParserModes.RCDATA */;
    }
    else if (HTML_RAWTEXT_TAG_REG.test(element.tag)) {
        context.mode = 2 /* ParserModes.RAWTEXT */;
    }
    else {
        context.mode = 0 /* ParserModes.DATA */;
    }
    parenStack.push(element); // ?????????????????????
    element.children = parseChildren(context, parenStack);
    parenStack.pop(); // ?????????????????????????????????
    if (context.source.startsWith(`</${element.tag}`)) {
        parseTag(context, 'end');
    }
    else {
        error(`${element.tag} lacks the end tag.`, context.source);
    }
    return element;
}
/**
 * ??????????????????
 * @param context ???????????????
 */
function parseComment(context) {
    context.advanceBy('<!--'.length);
    const closeIndex = context.source.indexOf('-->');
    if (closeIndex < 0) {
        error(`the comment block lacks the end tag "-->"`, context.source);
    }
    // ??????????????????
    const content = context.source.slice(0, closeIndex);
    context.advanceBy(content.length);
    context.advanceBy('-->'.length);
    return {
        type: 'Comment',
        content
    };
}
/**
 * ??????????????????
 * @param context ???????????????
 */
function parseInterpolation(context) {
    context.advanceBy('{{'.length);
    const closeIndex = context.source.indexOf('}}');
    if (closeIndex < 0) {
        error(`the interpolation block lacks the end tag "}}"`, context.source);
    }
    // ?????????????????????
    const content = context.source.slice(0, closeIndex);
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
 * ?????????????????????
 * @param context ???????????????
 */
function parseText(context) {
    let lastIndex = context.source.length;
    const lessThanSignIndex = context.source.indexOf('<'); // ????????????<???
    const delimiterIndex = context.source.indexOf('{{'); // ?????????????????????{{
    // ????????????????????????????????????????????????
    if (lessThanSignIndex > -1 && lessThanSignIndex < lastIndex) {
        lastIndex = lessThanSignIndex;
    }
    if (delimiterIndex > -1 && delimiterIndex < lastIndex) {
        lastIndex = delimiterIndex;
    }
    const content = context.source.slice(0, lastIndex);
    context.advanceBy(content.length);
    return {
        type: 'Text',
        content: decodeHTMLText(content)
    };
}

/**
 * ??????HTML??????????????????????????????AST
 * @param template HTML??????
 */
function parse(template) {
    // ????????????????????????
    const context = {
        source: template,
        mode: 0 /* ParserModes.DATA */,
        advanceBy(num) {
            // ????????????????????????
            context.source = context.source.slice(num);
        },
        advanceSpaces() {
            // ??????????????????
            const match = BLANK_CHAR_REG.exec(context.source);
            if (match) {
                // ??????????????????
                context.advanceBy(match[0].length);
            }
        },
        trimEndSpaces() {
            context.source = context.source.trimEnd();
        }
    };
    // ?????????????????????
    context.advanceSpaces();
    context.trimEndSpaces();
    const nodes = parseChildren(context, []);
    return {
        type: 'Root',
        children: nodes
    };
}

/**
 * ????????????????????????
 * @param templateAST ???????????????ast
 * @param context ???????????????
 */
function traverseNode(templateAST, context) {
    // debugger
    context.currentNode = templateAST;
    const exitFns = [];
    // ?????????????????????????????????
    const transforms = context.nodeTransforms;
    for (let i = 0; i < transforms.length; i++) {
        const onExit = transforms[i](context.currentNode, context); // ????????????????????????????????????????????????????????????
        if (onExit) {
            exitFns.push(onExit);
        }
        if (!context.currentNode)
            return; // ??????????????????node????????????????????????
    }
    // ?????????????????????????????????
    const children = context.currentNode.children;
    if (children) {
        for (let i = 0; i < children.length; i++) {
            context.parent = context.currentNode;
            context.childIndex = i;
            // ????????????context
            traverseNode(children[i], context);
        }
    }
    // ????????????
    let i = exitFns.length;
    while (i--) {
        exitFns[i]();
    }
}

const JS_VARIABLE_NAME_VALIDATOR = /^([^\x00-\xff]|[a-zA-Z_$])([^\x00-\xff]|[a-zA-Z0-9_$])*$/i;

/**
 * ??????StringLiteral??????JsAST
 * @param value string???
 */
function createStringLiteral(value) {
    return {
        type: 'StringLiteral',
        value
    };
}
/**
 * ??????Identifier??????JsAST
 * @param name identifier???
 */
function createIdentifier(name) {
    return {
        type: 'Identifier',
        name
    };
}
/**
 * ??????ArrayExpression??????JsAST
 * @param elements JsAST??????
 */
function createArrayExpression(elements) {
    return {
        type: 'ArrayExpression',
        elements
    };
}
/**
 * ??????CallExpression??????JsAST
 * @param callee ???call????????????
 * @param args ???????????????
 */
function createCallExpression(callee, args) {
    return {
        type: 'CallExpression',
        callee: createIdentifier(callee),
        arguments: args
    };
}
/**
 * ?????????????????????JsAST
 * @param value ??????????????????
 */
function createExpressionLiteral(value) {
    return {
        type: 'ExpressionLiteral',
        value
    };
}
/**
 * ??????????????????JsAST
 * @param first ???node
 * @param last ???node
 */
function createPairNode(first, last) {
    return {
        type: 'KeyValuePair',
        first,
        last
    };
}
/**
 * ????????????????????????[key: string]: any????????????JsAST
 * @param key ???
 * @param value ???
 * @param type ?????????
 */
function createKeyValueObjectNode(key, value, type) {
    const first = createStringLiteral(key);
    let last;
    // ?????????type??????type?????????ast??????
    if (type && typeof value === 'string') {
        last = type === 'StringLiteral' ? createStringLiteral(value) : createExpressionLiteral(value);
    }
    else if (typeof value !== 'string') {
        // ???value??????????????????ast???????????????
        last = value;
    }
    return createPairNode(first, last);
}
/**
 * ??????????????????
 * @param node ????????????
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
 * ??????????????????
 * @param node ????????????
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
 * ??????????????????
 * @param node ????????????
 */
function transformInterpolation(node) {
    if (node.type !== 'Interpolation') {
        return;
    }
    // ?????????????????????????????????????????????
    const callExp = createCallExpression('_s', [
        createExpressionLiteral(node.content.content)
    ]);
    // ??????????????????????????????????????????
    node.jsNode = createCallExpression('_v', [
        callExp
    ]);
}
/**
 * ??????????????????
 * @param node ????????????
 */
function transformElement(node) {
    // ?????????????????????????????????????????????????????????????????????
    return () => {
        if (node.type !== 'Element') {
            return;
        }
        // ??????_h???????????????
        const callExp = createCallExpression('_h', [
            createStringLiteral(node.tag)
        ]);
        // _h????????????????????????node????????????
        if (node.props && node.props.length > 0) {
            // ???props??????????????????
            const attrs = [];
            const directives = [];
            const events = [];
            // ????????????props????????????
            const elementDescriptor = {
                type: 'ObjectExpression',
                elements: [
                    {
                        type: 'KeyValuePair',
                        first: createStringLiteral('directives'),
                        last: {
                            type: 'ObjectExpression',
                            elements: directives
                        }
                    },
                    {
                        type: 'KeyValuePair',
                        first: createStringLiteral('on'),
                        last: {
                            type: 'ObjectExpression',
                            elements: events
                        }
                    },
                    {
                        type: 'KeyValuePair',
                        first: createStringLiteral('attrs'),
                        last: {
                            type: 'ObjectExpression',
                            elements: attrs
                        }
                    }
                ]
            };
            // ?????????????????????prop?????????
            node.props.forEach(prop => {
                if (prop.type === 'Directive') { // ????????????
                    directives.push(createKeyValueObjectNode(prop.name, prop.exp.content, 'Expression'));
                }
                else if (prop.type === 'Event') { // ????????????????????????
                    events.push(createKeyValueObjectNode(prop.name, 
                    // ??????????????????????????????????????????????????????????????????????????????
                    `(typeof (${JS_VARIABLE_NAME_VALIDATOR.test(prop.exp.content) ? prop.exp.content : 'null'}) === 'function') ? (${prop.exp.content}) : () => { (${prop.exp.content}) }`, 'Expression'));
                }
                else if (prop.type === 'ReactiveProp') { // ????????????????????????prop??????
                    attrs.push(createKeyValueObjectNode(prop.name, prop.exp.content, 'Expression'));
                }
                else {
                    // ????????????attrs
                    attrs.push(createKeyValueObjectNode(prop.name, prop.value, 'StringLiteral'));
                }
            });
            // ????????????????????????????????????????????????????????????????????????props?????????????????????
            transformDirectiveExpression(node.props, {
                events: events,
                attrs: attrs,
                createKeyValueObjectNode
            });
            callExp.arguments.push(elementDescriptor);
        }
        else {
            callExp.arguments.push({ type: 'ObjectExpression', elements: [] });
        }
        // _h?????????????????????????????????
        callExp.arguments.push(createArrayExpression(node.children.map(c => c.jsNode)));
        node.jsNode = callExp;
    };
}
function transformRoot(node) {
    // ?????????????????????????????????????????????????????????????????????
    return () => {
        if (node.type !== 'Root') {
            return;
        }
        const vnodeJSAST = node.children[0].jsNode; // ?????????????????????????????????
        if (node.children.length !== 1) {
            error(`the template requires one root node, detected ${node.children.length}. 
            The DdBind parser will only parse the first one`, null);
            return;
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
 * ?????????AST?????????JS AST
 * @param templateAST ????????????AST
 */
function transform(templateAST) {
    const context = {
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

const TextVnodeSymbol = Symbol('TextVnodeSymbol');
const CommentVnodeSymbol = Symbol('CommentVnodeSymbol');

/**
 * vnode???????????????????????????
 */
class VnodeUtil {
    static builder() {
        return new VnodeBuilder();
    }
}
class VnodeImpl {
}
class VnodeBuilder {
    constructor() {
        this.if = true;
    }
    setType(type) {
        this.type = type;
        return this;
    }
    setChildren(children) {
        this.children = children;
        return this;
    }
    setProps(props) {
        this.props = props;
        return this;
    }
    setEl(el) {
        this.el = el;
        return this;
    }
    setIf(value) {
        this.if = value;
    }
    build() {
        const vnode = new VnodeImpl();
        Object.keys(this).forEach((key) => {
            vnode[key] = this[key];
        });
        return vnode;
    }
}

/**
 * ????????????Vnode??????
 * @param type Vnode??????
 * @param props Vnode???props??????
 * @param children ?????????
 */
function createVnode(type, props, children) {
    if (type === 'comment') {
        return VnodeUtil.builder().setType(CommentVnodeSymbol).setChildren(children).build();
    }
    else {
        const builder = VnodeUtil.builder().setType(type).setChildren(children);
        const propsObject = {}; // ?????????????????????prop??????
        // ??????prop??????
        patchProps$1(props, propsObject);
        // ??????????????????????????????vnode?????????flag
        if (propsObject['_if_'] !== undefined && !propsObject['_if_']) {
            builder.setIf(false);
        }
        else {
            builder.setIf(true);
        }
        delete propsObject['_if_'];
        // ???????????????
        builder.setProps(propsObject);
        return builder.build();
    }
}
/**
 * ????????????????????????
 * @param value ????????????
 */
function createTextVnode(value) {
    return VnodeUtil.builder().setType(TextVnodeSymbol).setChildren(value).build();
}
/**
 * ????????????????????????????????????
 * @param value ?????????
 */
function stringVal(value) {
    return value === null
        ? ''
        : typeof value === 'object'
            ? value.toString()
            : String(value);
}
/**
 * ?????????jsAST???????????????prop???????????????vnode?????????????????????
 * @param props ??????props
 * @param target ???????????????????????????
 */
function patchProps$1(props, target) {
    // attrs???????????????????????????
    if (props.attrs) {
        Object.assign(target, props.attrs);
    }
    // ??????????????????prop????????????
    if (props.on) {
        for (const eventName in props.on) {
            const propKey = 'on' + eventName[0].toUpperCase() + eventName.slice(1, eventName.length); // ????????????on?????????prop???
            target[propKey] = props.on[eventName];
        }
    }
    // ??????d-show??????????????????????????????display??????
    let showDisplay = target['_show_'] !== undefined && !target['_show_'] ? 'none' : '';
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

class Compiler {
    constructor(el, vm) {
        this.$el = el;
        this.$vm = vm;
        // ???????????????????????????
        this.$vm._h = createVnode;
        this.$vm._v = createTextVnode;
        this.$vm._s = stringVal;
        if (this.$el) {
            this.compileElement(this.$el);
        }
    }
    /**
     * ??????????????????
     * @param el ??????HTML
     */
    compileElement(el) {
        const source = this.$vm.$template || el.innerHTML;
        const templateAST = parse(source); // ??????HTML???????????????AST
        const jsAST = transform(templateAST); // ?????????AST?????????jsAST
        const code = generate(jsAST); // ??????jsAST????????????????????????
        this.$vm.$render = createFunction(code, this.$vm);
    }
}
function createFunction(code, vm) {
    try {
        return new Function(code).bind(vm);
    }
    catch (e) {
        error('create function error.', e);
    }
}

let activeEffect; // ??????????????????????????????
const effectBucket = new WeakMap(); // ??????????????????
const effectStack = []; // ????????????????????????????????????????????????????????????activeEffect?????????
const iterateBucket = new WeakMap(); // ????????????????????????key??????
/**
 * ????????????????????????
 * @param effectFn ???????????????
 */
function cleanup(effectFn) {
    effectFn.deps.forEach((value) => {
        value.delete(effectFn);
    });
    effectFn.deps.length = 0;
}
/**
 * ?????????????????????
 * @param func ???????????????
 * @param options ??????????????????????????????
 */
function watchEffect(func, options = {}) {
    const effectFn = () => {
        cleanup(effectFn);
        // ???????????????????????????????????????
        activeEffect = effectFn;
        effectStack.push(effectFn);
        const res = func();
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
 * ??????????????????????????????
 * @param target ????????????
 * @param key ??????key
 */
function track(target, key) {
    if (!activeEffect)
        return;
    let depsMap = effectBucket.get(target);
    if (!depsMap) {
        effectBucket.set(target, (depsMap = new Map()));
    }
    if (typeof key === 'symbol') {
        iterateBucket.set(target, key);
    }
    let effects = depsMap.get(key);
    if (!effects) {
        depsMap.set(key, (effects = new Set()));
    }
    effects.add(activeEffect);
    activeEffect.deps.push(effects);
}
/**
 * ???????????????????????????
 * @param target ????????????
 * @param key ??????key
 * @param type ??????????????????????????????(SET/GET/DELETE???)
 */
function trigger(target, key, type) {
    let depsMap = effectBucket.get(target);
    if (!depsMap)
        return;
    // if (type === 'ADD') {
    //     track(target, key)
    // }
    // depsMap = effectBucket.get(target)
    const effects = depsMap.get(key);
    // ?????????????????????????????????
    const effectsToRuns = new Set();
    effects && effects.forEach((fn) => {
        // ??????????????????????????????????????????????????????
        if (fn !== activeEffect) {
            effectsToRuns.add(fn);
        }
    });
    if (type === 'ADD' && Array.isArray(target)) {
        const lengthEffects = depsMap.get('length');
        lengthEffects && lengthEffects.forEach(fn => {
            if (fn != activeEffect) {
                effectsToRuns.add(fn);
            }
        });
    }
    // ??????????????????????????????????????????????????????????????????
    if (type === 'ADD' || type === 'DELETE') {
        const iterateKey = iterateBucket.get(target);
        iterateKey && depsMap.get(iterateKey).forEach((fn) => {
            if (fn !== activeEffect) {
                effectsToRuns.add(fn);
            }
        });
    }
    effectsToRuns.forEach((fn) => {
        if (fn.options && fn.options.scheduler) {
            fn.options.scheduler(fn);
        }
        else {
            fn();
        }
    });
}

/**
 * ????????????????????????????????????setAttribute????????????
 * @param el ??????dom
 * @param key ???????????????
 * @param value ?????????
 */
function shouldSetAsDomProps(el, key, value) {
    if (key === 'form' && el.tagName === 'INPUT')
        return false;
    return key in el;
}
/**
 * ??????vnode?????????dom??????props
 * @param el ???????????????dom
 * @param key ?????????????????????
 * @param oldValue ????????????
 * @param newValue ????????????
 */
function patchProps(el, key, oldValue, newValue) {
    // ???on???????????????????????????
    if (/^on/.test(key)) {
        const eventName = key.slice(2).toLowerCase();
        const invokers = el._invokers || (el._invokers = {});
        let invoker = invokers[eventName]; // ???????????????????????????
        if (newValue) {
            if (!invoker) {
                // ??????????????????????????????????????????
                invoker = el._invokers[eventName] = (event) => {
                    // ????????????????????????????????????????????????????????????
                    if (event.timeStamp < invoker.attachTime)
                        return;
                    // ?????????????????????????????????????????????
                    if (Array.isArray(invoker.value)) {
                        invoker.value.forEach(fn => fn(event));
                    }
                    else {
                        invoker.value(event);
                    }
                };
                invoker.value = newValue;
                // ??????????????????????????????
                invoker.attachTime = performance.now();
                el.addEventListener(eventName, invoker);
            }
            else {
                // ??????????????????????????????????????????
                invoker.value = newValue;
            }
        }
        else if (invoker) {
            // ????????????????????????????????????????????????
            el.removeEventListener(eventName, invoker);
        }
    }
    else if (key === 'class') {
        // ??????class??????????????????
        el.className = newValue || '';
    }
    else if (key === '_style_') {
        // ??????style????????????????????????
        if (Array.isArray(newValue)) {
            for (const style in newValue) {
                Object.assign(el.style, newValue[style]);
            }
        }
        else if (typeof newValue === 'object') {
            Object.assign(el.style, newValue);
        }
    }
    else if (key === '_class_') {
        // ??????class????????????????????????
        if (Array.isArray(newValue)) {
            for (const classKey in newValue) {
                el.classList.add(newValue[classKey]);
            }
        }
        else {
            el.classList.add(newValue);
        }
    }
    else if (shouldSetAsDomProps(el, key)) {
        const type = typeof el[key];
        // ??????HTML attr???boolean????????????????????????
        if (type === 'boolean' && newValue === '') {
            el[key] = true;
        }
        else {
            el[key] = newValue;
        }
    }
    else {
        // ????????????DOM properties???????????????????????????
        el.setAttribute(key, newValue);
    }
}

// ??????????????????vnode?????????vnode
const vnodeStack = [];
/**
 * ??????vnode???????????????
 * @param oldVNode ???vnode
 * @param newVNode ?????????????????????vnode
 * @param container ????????????
 */
function patch(oldVNode, newVNode, container) {
    // ???????????????????????????dom?????????
    const anchor = vnodeStack.length > 0 ? vnodeStack.pop() : null;
    if (!newVNode) {
        if (oldVNode) {
            unmountElement(oldVNode);
        }
        return;
    }
    // ?????????vnode???????????????????????????????????????
    if (oldVNode && oldVNode.type !== newVNode.type) {
        unmountElement(oldVNode);
        oldVNode = null;
    }
    const vnodeType = typeof newVNode.type;
    if (vnodeType === 'string') { // vnode???????????????
        if (!oldVNode || !oldVNode.el) {
            mountElement(newVNode, container, anchor); // ??????vnode
        }
        else {
            updateElement(oldVNode, newVNode); // ??????vnode
        }
    }
    else if (vnodeType === 'object') ;
    else if (vnodeType === 'symbol') { // ?????????????????????????????????
        if (newVNode.type === TextVnodeSymbol) { // ????????????
            if (typeof newVNode.children !== 'string') {
                error(`text node requires children being type of "string", received type ${typeof newVNode.children}`, newVNode);
            }
            if (!oldVNode) {
                const el = newVNode.el = document.createTextNode(newVNode.children);
                insert(el, container);
            }
            else { // ???????????????????????????
                const el = newVNode.el = oldVNode.el;
                if (newVNode.children !== oldVNode.children) {
                    el.nodeValue = newVNode.children;
                }
            }
        }
        else if (newVNode.type === CommentVnodeSymbol) { // ????????????
            if (typeof newVNode.children !== 'string') {
                error(`comment node requires children being type of "string", received type ${typeof newVNode.children}`, newVNode);
            }
            if (!oldVNode) {
                const el = newVNode.el = document.createComment(newVNode.children);
                insert(el, container);
            }
            else { // ???????????????????????????
                const el = newVNode.el = oldVNode.el;
                if (newVNode.children !== oldVNode.children) {
                    el.nodeValue = newVNode.children;
                }
            }
        }
    }
}
/**
 * ???vnode???????????????dom
 * @param vnode ???????????????vnode
 * @param container ????????????
 * @param anchor ???????????????????????????????????????vnode
 */
function mountElement(vnode, container, anchor) {
    if (vnode.if) {
        const el = vnode.el = document.createElement(vnode.type);
        // ?????????child???????????????dom
        if (typeof vnode.children === 'string') {
            el.textContent = vnode.children;
        }
        else if (Array.isArray(vnode.children)) {
            vnode.children.forEach(child => {
                patch(null, child, el);
            });
        }
        else {
            patch(null, vnode.children, el);
        }
        // ???dom??????attr
        if (vnode.props) {
            for (const key in vnode.props) {
                patchProps(el, key, null, vnode.props[key]);
            }
        }
        insert(el, container, anchor ? anchor.el : null);
    }
    else if (vnode.el) {
        unmountElement(vnode);
    }
}
/**
 * ??????vnode
 * @param vnode ???????????????vnode
 */
function unmountElement(vnode) {
    const parent = vnode.el.parentNode;
    if (parent) {
        parent.removeChild(vnode.el);
        vnode.el = undefined;
    }
}
/**
 * ???????????????????????????
 * @param oldVNode ???vnode
 * @param newVNode ???vnode
 * @param container ??????dom
 */
function updateElementChild(oldVNode, newVNode, container) {
    if (newVNode.if) {
        if (typeof newVNode.children === 'string') { // ???vnode???children?????????????????????
            if (Array.isArray(oldVNode.children)) {
                oldVNode.children.forEach(child => {
                    unmountElement(child);
                });
            }
            container.textContent = newVNode.children;
        }
        else if (Array.isArray(newVNode.children)) { // ???vnode???children??????????????????????????????
            if (Array.isArray(oldVNode.children)) {
                // ???????????????children?????????????????????????????????Diff??????
                // ??????????????????DOM????????????????????????????????????
                const oldChildren = oldVNode.children;
                const newChildren = newVNode.children;
                const oldLen = oldChildren.length;
                const newLen = newChildren.length;
                const commonLen = Math.min(oldLen, newLen);
                for (let i = 0; i < commonLen; i++) {
                    // ???????????????????????????dom
                    for (let j = i + 1; j < commonLen; j++) {
                        diff(oldChildren[j], newChildren[j]);
                        if (newChildren[j].if && newChildren[j].el) {
                            // ???????????????dom?????????
                            vnodeStack.push(newChildren[j]);
                            break;
                        }
                    }
                    diff(oldChildren[i], newChildren[i]);
                    patch(oldChildren[i], newChildren[i], container);
                }
                // ????????????????????????????????????????????????????????????????????????
                // ?????????????????????????????????
                if (newLen > oldLen) {
                    for (let i = commonLen; i < newLen; i++) {
                        patch(null, newChildren[i], container);
                    }
                }
                else if (oldLen > newLen) {
                    for (let i = commonLen; i < oldLen; i++) {
                        unmountElement(oldChildren[i]);
                    }
                }
            }
            else {
                container.textContent = '';
                newVNode.children.forEach(child => {
                    patch(null, child, container);
                });
            }
        }
        else { // ???????????????????????????????????????
            if (Array.isArray(oldVNode.children)) {
                oldVNode.children.forEach(child => {
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
 * ????????????vnode???????????????
 * @param oldVNode
 * @param newVNode
 */
function updateElement(oldVNode, newVNode) {
    if (newVNode.if) {
        const el = newVNode.el = oldVNode.el;
        const oldProps = oldVNode.props;
        const newProps = newVNode.props;
        // ??????props
        for (const key in newProps) {
            if (newProps[key] !== oldProps[key]) {
                patchProps(el, key, oldProps[key], newProps[key]);
            }
        }
        // ?????????vnode??????????????????prop
        for (const key in oldProps) {
            if (!(key in newProps)) {
                patchProps(el, key, oldProps[key], null);
            }
        }
        // ???????????????
        updateElementChild(oldVNode, newVNode, el);
    }
    else {
        unmountElement(oldVNode);
    }
}
/**
 * ????????????????????????DOM
 * @param el ????????????DOM
 * @param container ??????DOM
 * @param anchor ??????DOM
 */
function insert(el, container, anchor = null) {
    container.insertBefore(el, anchor);
}
/**
 * ???????????????DOM??????????????????VNode
 * @param oldVNode ???vnode
 * @param newVNode ???vnode
 */
function diff(oldVNode, newVNode) {
    if (newVNode.el) {
        return;
    }
    if (oldVNode.type !== newVNode.type) {
        return;
    }
    if (typeof oldVNode.children !== typeof newVNode.children) {
        return;
    }
    if (oldVNode.if !== newVNode.if) {
        return;
    }
    newVNode.el = oldVNode.el;
}

/**
 * ?????????????????????
 */
function createRenderer() {
    /**
     * ??????vnode?????????dom
     * @param vnode ??????dom
     * @param container ????????????dom
     */
    function render(vnode, container) {
        if (vnode) {
            patch(container._vnode, vnode, container); // ???????????????vnode
        }
        else {
            if (container._vnode) {
                unmountElement(container._vnode); // ????????????vnode
            }
        }
        container._vnode = vnode;
    }
    return {
        render
    };
}

const reactiveMap = new Map();
/**
 * ??????????????????????????????????????????toString()
 */
Object.prototype.toString = function () {
    return JSON.stringify(this); // ?????????????????????[Object object]
};
Array.prototype.toString = function () {
    return JSON.stringify(this);
};
/**
 * ???????????????????????????handler
 */
function handler() {
    return {
        set(target, p, newValue, receiver) {
            const oldValue = target[p];
            // ???set???????????????????????????????????????????????????
            const type = Array.isArray(target)
                ? (Number(p) < target.length ? 'SET' : 'ADD')
                : (Object.prototype.hasOwnProperty.call(target, p) ? 'SET' : 'ADD');
            const res = Reflect.set(target, p, newValue, receiver);
            // ????????????????????????????????????
            if (oldValue !== newValue && (oldValue === oldValue || newValue === newValue)) {
                trigger(target, p, type);
            }
            return res;
        },
        get(target, p, receiver) {
            const res = Reflect.get(target, p, receiver);
            track(target, p);
            if (typeof res === 'object' && res !== null) {
                // ???????????????????????????
                for (const resKey in res) {
                    track(res, resKey);
                }
                return reactive(res);
            }
            return res;
        },
        has(target, p) {
            track(target, p);
            return Reflect.has(target, p);
        },
        ownKeys(target) {
            track(target, Array.isArray(target) ? 'length' // ??????????????????????????????????????????length??????
                : Symbol('iterateKey')); // ???????????????target?????????key
            return Reflect.ownKeys(target);
        },
        deleteProperty(target, p) {
            const hasKey = Object.prototype.hasOwnProperty.call(target, p);
            const res = Reflect.deleteProperty(target, p);
            if (res && hasKey) {
                trigger(target, p, 'DELETE');
            }
            return res;
        },
    };
}
/**
 * ????????????????????????????????????????????????
 * @param value ??????????????????
 */
function reactive(value) {
    if ((typeof value !== "object" || value === null)) {
        error('reactive() requires an object parameter', value);
    }
    // ??????????????????????????????????????????????????????????????????
    const existProxy = reactiveMap.get(value);
    if (existProxy)
        return existProxy;
    const proxy = new Proxy(value, handler());
    reactiveMap.set(value, proxy);
    return proxy;
}

/**
 * ?????????????????????????????????????????????????????????????????????
 * @param target ?????????????????????
 * @param key ?????????
 */
function toRef(target, key) {
    const wrapper = {
        get value() {
            return target[key];
        },
        set value(val) {
            target[key] = val;
        }
    };
    // ???????????????ref??????
    Object.defineProperty(wrapper, '_is_Ref_', {
        value: true
    });
    return wrapper;
}
/**
 * ????????????????????????????????????????????????????????????
 * @param target ?????????????????????
 */
function toRefs(target) {
    const ret = {};
    for (const key in target) {
        ret[key] = toRef(target, key);
    }
    return ret;
}
/**
 * ???????????????????????????????????????????????????ref
 * @param target ????????????
 */
function proxyRefs(target) {
    return new Proxy(target, {
        get(target, p, receiver) {
            const value = Reflect.get(target, p, receiver);
            return (value && value._is_Ref_) ? value.value : value; // ??????ref?????????????????????value
        },
        set(target, p, newValue, receiver) {
            const value = target[p];
            if (value && value._is_Ref_) { // ??????ref?????????????????????value
                value.value = newValue;
                return true;
            }
            return Reflect.set(target, p, newValue, receiver);
        }
    });
}
/**
 * ?????????????????????????????????????????????????????????
 * @param value ?????????
 */
function ref(value) {
    const wrapper = {
        value: value
    };
    Object.defineProperty(wrapper, '_is_Ref_', {
        value: true
    });
    return reactive(wrapper);
}

/**
 * ????????????????????????
 * @param getter ??????????????????
 */
function computed(getter) {
    let buffer; // ????????????????????????
    let dirty = true; // ??????flag??????????????????????????????????????????Proxy
    const effectFn = watchEffect(getter, {
        isLazy: true,
        // ??????????????????????????????????????????????????????
        scheduler: () => {
            dirty = true;
            trigger(obj, 'value'); // ???????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
        }
    });
    const obj = {
        get value() {
            if (dirty) {
                buffer = effectFn();
                dirty = false;
            }
            track(obj, 'value'); // ??????????????????????????????????????????????????????
            return buffer;
        }
    };
    obj.toString = function () {
        return this.value;
    };
    return obj;
}

/**
 * ????????????????????????????????????
 */
function traverseRef(value, traversed = new Set()) {
    if (!value || typeof value !== 'object' || traversed.has(value))
        return;
    traversed.add(value);
    for (const valueKey in value) {
        traverseRef(value[valueKey], traversed);
    }
    return value;
}
/**
 * ?????????????????????
 * @param target ????????????
 * @param callback ???????????????????????????????????????
 */
function watch(target, callback) {
    if (typeof target !== "object") {
        warn(`watch() requires a object as watching target, received type is ${typeof target}`, target);
    }
    let getter; // ???????????????getter??????
    // ?????????????????????getter???????????????
    if (typeof target === 'function') {
        getter = target;
    }
    else {
        getter = () => traverseRef(target);
    }
    let newValue, oldValue;
    let onExpiredHandler;
    const onExpired = (fn) => {
        onExpiredHandler = fn;
    };
    const effectFn = watchEffect(getter, {
        isLazy: true,
        scheduler: () => {
            let data = effectFn();
            newValue = (data._is_Ref_)
                ? data.value
                : (typeof data === 'object'
                    ? Object.assign({}, data) : data);
            if (onExpiredHandler)
                onExpiredHandler(); // ?????????????????????????????????????????????
            callback(newValue, oldValue, onExpired);
            oldValue = newValue;
        }
    });
    oldValue = Object.assign({}, effectFn()); // ?????????newValue??????????????????
}

/**
 * app??????????????????????????????????????????this???vm??????
 */
class DdBind {
    constructor(options) {
        this.$options = options;
    }
    /**
     * ???app???????????????dom???
     * @param el dom???selector
     */
    mount(el) {
        let container;
        if (typeof el === 'string') {
            container = document.querySelector(el);
        }
        else {
            container = el ? el : document.body;
        }
        this.$template = this.$options.template;
        this.$el = container;
        // ?????????????????????
        this.$compile = new Compiler(container, this);
        // ???????????????
        this.$renderer = createRenderer();
        // ??????container?????????HTML??????
        container.innerHTML = '';
        this._bind();
        // ??????????????????????????????????????????????????????
        watchEffect(() => {
            this.$vnode = this.$render(); // ???????????????vnode
            this.$renderer.render(this.$vnode, this.$el);
        });
        // ?????????????????????onMounted??????
        this.$options.onMounted && this.$options.onMounted.bind(this)();
    }
    /**
     * ???vm?????????option??????????????????
     */
    _bind() {
        const setups = this.$options.setup ? this.$options.setup.bind(this)() : {}; // ???setup????????????????????????
        const methods = this.$options.methods ? this.$options.methods : {};
        this.$data = this.$options.data ? this.$options.data() : {};
        Object.assign(setups, this.$data);
        // ???setup??????????????????data???methods
        for (const setupsKey in setups) {
            if (setups[setupsKey] instanceof Function) {
                methods[setupsKey] = setups[setupsKey];
            }
            else {
                this.$data[setupsKey] = setups[setupsKey]; // ??????setup???data????????????
            }
        }
        // ??????????????????
        const computedList = this.$options.computed ? this.$options.computed : {};
        for (const key in computedList) {
            if (!key.startsWith('$') && !key.startsWith('_')) {
                Object.defineProperty(this, key, {
                    value: computed(computedList[key].bind(this)),
                    writable: false
                });
            }
        }
        // ????????????
        for (const key in methods) {
            if (!key.startsWith('$') && !key.startsWith('_')) {
                Object.defineProperty(this, key, {
                    value: methods[key].bind(this),
                    writable: false
                });
            }
        }
        // ?????????????????????
        for (const key in this.$data) {
            if (!this.$data[key]._is_Ref_) {
                this.$data[key] = ref(this.$data[key]);
            }
        }
        Object.assign(this, this.$data); // ???data???????????????vm?????????
        // ??????????????????
        const watchesFn = this.$options.watch ? this.$options.watch : {};
        for (const key in watchesFn) {
            if (!key.startsWith('$') && !key.startsWith('_')) {
                watch(this.$data[key], watchesFn[key]); // ?????????vm??????ref???????????????value??????????????????????????????$data???????????????????????????
            }
        }
    }
}

function createApp(options) {
    return proxyRefs(new DdBind(options));
}

export { DdBind, computed, createApp, proxyRefs, reactive, ref, toRefs, watch, watchEffect };
