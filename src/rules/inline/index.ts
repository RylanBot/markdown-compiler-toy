import { Block, InlineBlock } from "@/core/tokenizer";

import parseEmphasis from "./emphasis";
import parseLink from "./link";
import parseText from "./text";

export function parseInlineBlock(block: Block) {
  const blockTokens = block.tokens;

  blockTokens.forEach(tok => {
    if (tok.type === "inline_block") {
      let state = new InlineBlock(tok.content);
      parseInline(state);
      tok.children = state.tokens;
    }
  });
}

export function parseInlineText(block: InlineBlock) {
  parseInline(block);
  return block.tokens;
}

const parseInline = (state: InlineBlock) => {
  parseText(state);

  const parseRules = [parseEmphasis, parseLink /* 其他行内解析 */];
  for (const rule of parseRules) {
    if (rule(state)) {
      return;
    }
  }
}
