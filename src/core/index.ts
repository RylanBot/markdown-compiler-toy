import parse from "./parse";
import render from "./render";
import { Block } from "./tokenizer";

class Markdown {
    input: Block;
    output: string;

    constructor(text: string) {
        this.tokenizer(text);
        this.parser();
        this.render();
    }

    private tokenizer(text: string) {
        this.input = new Block(text);
    }

    private parser() {
        parse(this.input);
    }

    private render() {
        this.output = render(this.input);
    }

    getSyntaxTree() {
        return JSON.stringify( this.input.tokens, null, 2);
    }

    getHtml() {
        return this.output;
    }

}

export default Markdown;
