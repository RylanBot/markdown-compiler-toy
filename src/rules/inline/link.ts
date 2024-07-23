import { InlineBlock } from "@/core/tokenizer";

import { parseInlineText } from ".";
import { LEFT_BRACKET, LEFT_PAREN, RIGHT_BRACKET, RIGHT_PAREN } from "../common/delimiters";

function parseLink(state: InlineBlock) {
    const text = state.src;
    const linkMarks = state.delimiters.filter(d => d.char === LEFT_BRACKET);
    if (text.length === 0 || linkMarks.length < 1) return false;

    let lastPos = 0;
    for (const delimiter of linkMarks) {
        const linkTextEnd = state.delimiters.find(d => d.char === RIGHT_BRACKET && d.pos > delimiter.pos);
        const linkUrlStart = linkTextEnd ? state.delimiters.find(d => d.char === LEFT_PAREN && d.pos > linkTextEnd.pos) : null;
        const linkUrlEnd = linkUrlStart ? state.delimiters.find(d => d.char === RIGHT_PAREN && d.pos > linkUrlStart.pos) : null;
        if (!linkTextEnd || !linkUrlStart || !linkUrlEnd) return false;

        const linkContent = text.slice(delimiter.pos + 1, linkTextEnd.pos);
        const linkUrl = text.slice(linkUrlStart.pos + 1, linkUrlEnd.pos);

        state.pushText(state.pos + lastPos, delimiter.pos);

        state.pushToken({
            type: "link_open",
            tag: "a",
            nesting: 1,
            content: "",
            attrs: [
                ["href", linkUrl],
                ["target", "_blank"]
            ],
            children: []
        });

        state.pushToken({
            type: "text",
            tag: "",
            nesting: 0,
            content: linkContent,
            children: parseInlineText(new InlineBlock(linkContent))
        });

        state.pushToken({
            type: "link_close",
            tag: "a",
            nesting: -1,
            content: "",
            children: []
        });

        lastPos = linkUrlEnd.pos + 1;
    }

    state.pushText(lastPos, text.length, true);
    state.pos = text.length;

    return true;
}

export default parseLink;
