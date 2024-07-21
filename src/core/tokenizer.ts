import DELIMITERS, { NEWLINE, SPACE, hasDelimiter } from "@/rules/common/delimiters";
import { parseInlineText } from "@/rules/inline";
import { Token } from "@/types/token";

export class Block {
    src: string; // 输入的源文本
    posMax: number; // 源文本的长度
    pos: number; //  当前解析的位置
    buffer: Token[]; // 临时跟踪嵌套 Token 关系
    tokens: Token[]; // 最终生成的完整 Token 列表

    constructor(src: string) {
        this.src = src;
        this.posMax = src.length;
        this.pos = 0;
        this.buffer = [];
        this.tokens = [];
    }

    pushToken(token: Token) {
        if (token.content === String.fromCharCode(SPACE)) return;

        const parentToken = this.buffer[this.buffer.length - 1];
        if (parentToken?.type === "inline_block") {
            if (!parentToken.children) {
                parentToken.children = [];
            }
            parentToken.children.push(token);
        } else {
            this.tokens.push(token);
        }

        if (token.nesting > 0) {
            this.buffer.push(token);
        } else if (token.nesting < 0) {
            this.buffer.pop();
        }
    }

    pushSegment() {
        const segments = [];
        let segmentStart = this.pos;

        while (this.pos < this.posMax) {
            // 遇到换行符，跳过并重新开始
            if (this.src.charCodeAt(this.pos) === NEWLINE) {
                segments.push(this.src.slice(segmentStart, this.pos));
                segmentStart = this.pos + 1;
                this.pos++;
                break;
            }

            // 遇到分隔符且后面存在空格，则将前面作为一个整体块
            // ⚠️ To Fix: 其实这是一个不完全正确的拆分，但是作者我还没有更好的解决方案 
            if (hasDelimiter(this.src.slice(this.pos, this.pos + 1))
                && this.src.charCodeAt(this.pos + 1) === SPACE
            ) {
                segments.push(this.src.slice(segmentStart, this.pos + 1));
                segmentStart = this.pos + 1;
            }

            this.pos++;
        }

        // 处理剩余部分
        segments.push(this.src.slice(segmentStart, this.pos));

        for (const segment of segments) {
            this.pushToken({
                type: "inline_block",
                tag: "",
                nesting: 0,
                content: segment,
                children: []
            });
        }
    }
}

export class InlineBlock extends Block {
    delimiters: { char: number; pos: number }[]; // 所有分隔符
    cache: string; // 缓存一对 open & close Tag 前后的普通文本

    constructor(src: string) {
        super(src);
        this.delimiters = [];
        this.cache = '';
        this.scanDelimiters();
    }

    private scanDelimiters() {
        let i = this.pos;
        while (i < this.posMax) {
            const charCode = this.src.charCodeAt(i);
            if (Object.values(DELIMITERS).includes(charCode)) {
                this.delimiters.push({ char: charCode, pos: i });
            }
            i++;
        }
    }

    pushToken(token: Token) {
        if (token.content === String.fromCharCode(SPACE)) return;
        this.tokens.push(token);
    }

    pushText(start: number, end: number, isEnd?: boolean) {
        if (start < end) {
            const text = this.src.slice(start, end);

            if (!hasDelimiter(text)) {
                this.tokens.push({
                    type: "text",
                    tag: "",
                    nesting: 0,
                    content: text,
                    children: []
                });
                return;
            }

            this.cache += String.fromCharCode(SPACE); // 用于临时拼接，避免无限递归
            this.cache += text; // 拼接 Tag 前后的文本，尝试再次解析
        }

        if (isEnd) {
            let processToken = parseInlineText(new InlineBlock(this.cache.trim()));
            processToken = processToken.filter(token => !hasDelimiter(token.content));

            const middleIndex = Math.floor(processToken.length / 2);

            const openTokens = processToken.slice(0, middleIndex);
            const closeTokens = processToken.slice(middleIndex);

            this.tokens.splice(this.delimiters[0]?.pos > 0 ? 1 : 0, 0, ...openTokens);
            this.tokens.push(...closeTokens);

            this.cache = ''; // 重置
        }
    }
}
