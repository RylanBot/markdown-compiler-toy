import { Block } from "@/core/tokenizer";

import normalize from "../common/normalize";

import parseHeading from "./heading";
import parseList from "./list";
import parseParagraph from "./paragraph";

function parseBlock(state: Block) {
    // 预处理
    normalize(state);
    // 各类整行解析（注意顺序）
    parseHeading(state);
    parseList(state);
    parseParagraph(state);
}

export default parseBlock;
