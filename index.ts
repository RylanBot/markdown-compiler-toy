import Markdown from '@/core';

async function loadDefaultMd() {
    try {
        const response = await fetch('/example.md');
        if (!response.ok) throw new Error();
        const text = await response.text();
        return text;
    } catch (error) {
        return '';
    }
}

async function initialize() {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement;

    const defaultMarkdown = await loadDefaultMd();
    textarea.value = defaultMarkdown;

    const updateOutput = () => {
        const markdownInput = textarea.value;
        const { tokens, html } = buildParser(markdownInput);

        document.getElementById('html-content-box').innerHTML = html;
        document.getElementById('source-content-box').textContent = html;
        document.getElementById('token-content-box').textContent = tokens;
    }

    updateOutput();

    textarea.addEventListener('input', updateOutput);
}

// ✨ Core Part 
function buildParser(input: string) {
    const markdown = new Markdown(input);
    const tokens = markdown.getSyntaxTree();
    const html = markdown.getHtml();
    return { tokens, html };
}

initialize();