import {
    ALPHABET_OR_NUMBER_REG,
    HTML_REFERENCE_HEAD_REG,
    HTML_REFERENCE_HEX_REG,
    HTML_REFERENCE_NUMBER_REG
} from "compiler/parser/regexp";
import {CCR_REPLACEMENTS, decodeMap, decodeMapKeyMaxLen} from "compiler/parser/references";

/**
 * 解析HTML中的引用字符
 * @param rawText 需要解码的文本
 * @param asAttr 是否用于解码属性值
 */
export function decodeHTMLText(rawText: string, asAttr: boolean = false): string {
    let offset: number = 0
    // 存放解码后的文本结果
    let decodedText: string = ''
    const endIndex: number = rawText.length

    // advance 消费指定长度的文本
    function advance(length) {
        offset += length
        rawText = rawText.slice(length)
    }

    while (offset < endIndex) {
        // 校验字符引用方式
        // &为命名字符引用
        // &#为十进制数字字符引用
        // &#x为十六进制数字字符引用
        const head = HTML_REFERENCE_HEAD_REG.exec(rawText)
        // 无匹配则说明无需解码
        if (!head) {
            const remaining = endIndex - offset
            decodedText += rawText.slice(0, remaining)
            advance(remaining)
            break
        }

        decodedText += rawText.slice(0, head.index)
        advance(head.index) // 消费&前的内容

        if (head[0] === '&') {
            let name: string = ''
            let value: string = undefined

            if (ALPHABET_OR_NUMBER_REG.test(rawText[1])) {
                // 依次从最长到最短查表寻找匹配的引用字符名称
                for (let length = decodeMapKeyMaxLen; !value && length > 0; --length) {
                    name = rawText.slice(1, 1 + length)
                    value = decodeMap[name]
                }

                if (value) {
                    const semi = (rawText[1 + name.length] || '') === ';'
                    // 如果解码的文本作为属性值，最后一个匹配的字符不是分号，
                    // 并且最后一个匹配字符的下一个字符是等于号(=)、ASCII 字母或数字，
                    // 将字符 & 和实体名称 name 作为普通文本
                    if (
                        asAttr &&
                        !semi &&
                        /[=a-z0-9]/i.test(rawText[1 + name.length] || '')
                    ) {
                        decodedText += '&' + name
                        advance(1 + name.length)
                    } else {
                        decodedText += value
                        advance(semi ? 2 + name.length : 1 + name.length) // 由于查找键时未包含分号，若末尾有分号需同时消费掉
                    }
                } else { // 解码失败，无对应值
                    decodedText += '&' + name
                    advance(1 + name.length)
                }
            } else {
                decodedText += '&'
                advance(1)
            }
        } else {
            // 根据引用头判断数字的引用进制
            const isHex: boolean = head[0] === '&#x'
            const pattern: RegExp = isHex ? HTML_REFERENCE_HEX_REG : HTML_REFERENCE_NUMBER_REG
            const body: RegExpExecArray = pattern.exec(rawText) // 匹配得到unicode码值

            if (body) {
                // 根据进制将转为改为数字
                let codePoint: number = parseInt(body[1], isHex ? 16 : 10)
                // 检查unicode值合法性并进行替换
                if (codePoint === 0) {
                    codePoint = 0xfffd
                } else if (codePoint > 0x10ffff) {
                    codePoint = 0xfffd
                } else if (codePoint > 0xd800 && codePoint < 0xdfff) {
                    codePoint = 0xfffd
                } else if ((codePoint > 0xfdd0 && codePoint <= 0xfdef) || (codePoint & 0xfffe) === 0xfffe) {/*do nothing*/
                } else if (
                    (codePoint >= 0x01 && codePoint <= 0x08) ||
                    codePoint === 0x0b ||
                    (codePoint >= 0x0d && codePoint <= 0x1f) ||
                    (codePoint >= 0x7f && codePoint <= 0x9f)) {
                    codePoint = CCR_REPLACEMENTS[codePoint] || codePoint
                }

                // 解码
                const char = String.fromCodePoint(codePoint)
                decodedText += char
                advance(body[0].length)
            } else { // 无匹配则直接当作文本处理
                decodedText += head[0]
                advance(head[0].length)
            }
        }
    }

    return decodedText
}