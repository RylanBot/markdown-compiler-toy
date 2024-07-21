import { Block } from "@/core/tokenizer";

function normalize(state: Block) {
    let src: string

    // 多个换行只视为一个
    src = state.src.replace(/(\r\n?)+|\n+/g, '\n');
    // 替换空字符
    src = src.replace(/\0/g, '\ufffd');

    state.src = src
}

export default normalize;
