export const SPACE = 0x20; // 空格
export const NEWLINE = 0x0a; // \n

export const HASH = 0x23; // # 
export const DASH = 0x2d; // -
export const PLUS = 0x2b; // +
export const DOT = 0x2e; // .

export const STAR = 0x2a; // *
export const UNDERSCORE = 0x5f; // _
export const LEFT_BRACKET = 0x5b; // [
export const RIGHT_BRACKET = 0x5d; // ]
export const LEFT_PAREN = 0x28; // (
export const RIGHT_PAREN = 0x29; // )

export const hasDelimiter = (src: string) => {
    const delimiterCodes = [
        STAR, UNDERSCORE, 
        LEFT_BRACKET, RIGHT_BRACKET, LEFT_PAREN, RIGHT_PAREN
    ];

    const delimiters = delimiterCodes.map(code => String.fromCharCode(code));
    return delimiters.some(d => src.includes(d));
}
