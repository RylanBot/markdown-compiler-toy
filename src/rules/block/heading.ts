import { Block } from "@/core/tokenizer";
import { HASH, SPACE } from "@/rules/common/delimiters";

function parseHeading(state: Block) {
  if (state.src.charCodeAt(state.pos) !== HASH) return;

  // 计算标题级别
  let headingLevel = 1;
  state.pos++;
  while (state.pos < state.posMax
    && state.src.charCodeAt(state.pos) === HASH
  ) {
    headingLevel++;
    state.pos++;
  }

  if (headingLevel > 6) return;

  state.pushToken({
    type: "heading_open",
    tag: "h" + headingLevel,
    nesting: 1,
    content: "",
    children: []
  });

  // 跳过空格
  while (state.pos < state.posMax
    && state.src.charCodeAt(state.pos) === SPACE
  ) {
    state.pos++;
  }

  state.pushSegment();

  state.pushToken({
    type: "heading_close",
    tag: "h" + headingLevel,
    nesting: -1,
    content: "",
    children: []
  });
}

export default parseHeading;
