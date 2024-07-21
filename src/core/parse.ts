import parseBlock from "@/rules/block";
import { parseInlineBlock } from "@/rules/inline";

import { Block } from "./tokenizer";

function parse(block: Block) {
  while (block.pos < block.posMax) {
    // 先解析 block
    parseBlock(block);
  }
  // 再细分 inline
  parseInlineBlock(block);
}

export default parse;
