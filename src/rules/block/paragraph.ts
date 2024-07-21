import { Block } from "@/core/tokenizer";

function parseParagraph(state: Block) {
  if (state.pos >= state.posMax) return;

  state.pushToken({
    type: "paragraph_open",
    tag: "p",
    nesting: 1,
    content: "",
    children: []
  });

  state.pushSegment();

  state.pushToken({
    type: "paragraph_close",
    tag: "p",
    nesting: -1,
    content: "",
    children: []
  });
}

export default parseParagraph;
