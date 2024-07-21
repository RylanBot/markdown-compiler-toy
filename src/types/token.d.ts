export type Token = {
    type: string;
    tag: string;
    nesting: number;
    content?: string;
    attrs?:string[][];
    children?: Token[];
}