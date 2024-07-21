import { Block } from "@/core/tokenizer";

import normalize from "../common/normalize";
import parseHeading from "./heading";
import parseParagraph from "./paragraph";

function parseBlock(state: Block) {
    // 预处理
    normalize(state);
    // 各类整行解析
    parseHeading(state);
    parseParagraph(state);
}

export default parseBlock;
