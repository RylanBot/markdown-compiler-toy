import { Token } from "@/types/token";
import { Block } from "./tokenizer";

function render(state: Block) {
    let tokens = state.tokens;
    let html = "";

    const renderToken = (token: Token) => {
        switch (token.nesting) {
            case 1:
                html += `<${token.tag}`;
                if (token.attrs) {
                    html += formatAttrs(token.attrs);
                }
                html += '>';
                break;
            case 0:
                if (token.children?.length === 0) {
                    html += token.content;
                } else {
                    token.children.forEach(child => renderToken(child));
                }
                break;
            case -1:
                html += `</${token.tag}>`;
                break;
        }
    }

    tokens.forEach(token => renderToken(token));

    return html;
}

const formatAttrs = (attrs?: string[][]) => {
    if (!attrs) return '';
    return attrs.map(attr => {
        if (attr.length === 2) {
            return ` ${attr[0]}="${attr[1]}"`;
        }
        return '';
    }).join('');
}

export default render;
