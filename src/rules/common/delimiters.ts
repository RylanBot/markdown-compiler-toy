export const HASH = 0x23; // # 
export const SPACE = 0x20; // 空格
export const NEWLINE = 0x0a; // 换行

enum DELIMITERS {
    STAR = 0x2a, // *
    UNDERSCORE = 0x5f, // _
    LEFT_BRACKET = 0x5b, // [
    RIGHT_BRACKET = 0x5d, // ]
    LEFT_PAREN = 0x28, // (
    RIGHT_PAREN = 0x29, // )
}

export const hasDelimiter = (src: string) => {
    const delimiters = Object.values(DELIMITERS).map(v => String.fromCharCode(v as number));
    return delimiters.filter(d => src.includes(d)).length > 0;
}

export default DELIMITERS;
