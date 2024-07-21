import { InlineBlock } from "@/core/tokenizer";

/**
 * 处理分隔符前的文本
 */
function parseText(state: InlineBlock) {
    const firstPos = state.delimiters[0]?.pos;

    if (!firstPos) return;

    state.pushToken({
        type: "text",
        tag: "",
        nesting: 0,
        content: state.src.slice(0, firstPos),
        children: []
    })
    state.pos += firstPos;
}

export default parseText;