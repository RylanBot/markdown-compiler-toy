import { Block } from "@/core/tokenizer";
import { DASH, DOT, PLUS, SPACE } from "../common/delimiters";

const verifyList = (state: Block) => {
    const currentChar = state.src.charCodeAt(state.pos);
    const nextChar = state.src.charCodeAt(state.pos + 1);
    const thirdChar = state.src.charCodeAt(state.pos + 2);

    if ((currentChar === DASH || currentChar === PLUS) && nextChar === SPACE) {
        return { isValid: true, tag: 'ul' };
    }

    if (currentChar > 0x30 && currentChar < 0x39 && nextChar === DOT && thirdChar === SPACE) {
        return { isValid: true, tag: 'ol' };
    }

    return { isValid: false, tag: '' };
}

function parseList(state: Block, indent: number = 0) {
    const { isValid, tag } = verifyList(state);
    if (!isValid) return;

    state.pushToken({
        type: "list_open",
        tag: tag,
        nesting: 1,
        content: "",
        children: []
    });

    state.tokens.push({
        type: "inline_block",
        tag: " ",
        nesting: 0,
        content: " ",
        children: []
    })

    parseListItem(state, indent);

    state.pushToken({
        type: "list_close",
        tag: tag,
        nesting: -1,
        content: "",
        children: []
    });
}

function parseListItem(state: Block, indent: number) {
    const prevList = verifyList(state);
    if (!prevList.isValid) return;

    state.pos += prevList.tag === 'ul' ? 2 : 3;

    state.pushToken({
        type: "list_item_open",
        tag: "li",
        nesting: 1,
        content: "",
        children: []
    });

    state.pushSegment();

    state.pushToken({
        type: "list_item_close",
        tag: "li",
        nesting: -1,
        content: "",
        children: []
    });

    while (state.pos < state.posMax) {
        let nestedSpaces = 0;
        while (state.src.charCodeAt(state.pos) === SPACE) {
            state.pos++;
            nestedSpaces++;
        }

        const currList = verifyList(state);
        if (nestedSpaces === 0) {
            if (currList.isValid) state.pos--;
            return;
        }

        // ⚠️ To Fix: 如果 tag 突然变化，嵌套有些问题
        if (nestedSpaces > indent || currList.tag !== prevList.tag) {
            parseList(state, nestedSpaces);
        } else if (nestedSpaces === indent) {
            parseListItem(state, nestedSpaces);
        }
    }
}

export default parseList;
