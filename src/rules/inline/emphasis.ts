import { InlineBlock } from "@/core/tokenizer";

import { parseInlineText } from ".";
import { STAR, UNDERSCORE } from "../common/delimiters";

function parseEmphasis(state: InlineBlock) {
    const text = state.src;
    const emMarks = state.delimiters.filter(d => d.char === STAR || d.char === UNDERSCORE);
    if (text.length === 0 || emMarks.length < 2) return false;

    let lastPos = 0;
    let i = 0;

    while (i < emMarks.length - 1) {
        const startMark = emMarks[i];
        const endMark = emMarks[i + 1];

        const nextStartMark = emMarks[i + 2];

        if (endMark.pos - startMark.pos === 1) {
            i++;
            // 避免递归拼接后产生的死循环
            if (emMarks.length === 2) return false;
            continue;
        }

        const isStrong = nextStartMark?.pos - endMark?.pos === 1;

        const tag = isStrong ? "strong" : "em";
        const emContent = text.slice(startMark.pos + 1, endMark.pos);

        state.pushText(state.pos + lastPos, startMark.pos);

        state.pushToken({
            type: `${tag}_open`,
            tag: tag,
            nesting: 1,
            content: "",
            children: []
        });

        state.pushToken({
            type: "text",
            tag: "",
            nesting: 0,
            content: emContent,
            children: parseInlineText(new InlineBlock(emContent))
        });

        state.pushToken({
            type: `${tag}_close`,
            tag: tag,
            nesting: -1,
            content: "",
            children: []
        });

        lastPos = endMark.pos + 1;
        if (isStrong) lastPos++;

        i += 2;
    }

    state.pushText(lastPos, text.length, true);
    state.pos = text.length;

    return true;
}

export default parseEmphasis;
