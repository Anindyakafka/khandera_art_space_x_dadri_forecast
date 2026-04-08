export type MarkdownListItem = {
  html: string;
  text: string;
};

export type MarkdownBlock =
  | { type: 'heading'; level: 1 | 2 | 3; html: string }
  | { type: 'paragraph'; html: string; text: string }
  | { type: 'list'; items: MarkdownListItem[] }
  | { type: 'hr' };

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stripInlineMarkdown(input: string): string {
  return input
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '$1')
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1');
}

function renderInline(input: string): string {
  const escaped = escapeHtml(input);
  return escaped
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
}

export function parseSimpleMarkdown(markdown: string): MarkdownBlock[] {
  const lines = markdown.split(/\r?\n/);
  const blocks: MarkdownBlock[] = [];
  let currentList: MarkdownListItem[] = [];
  let currentParagraph: string[] = [];

  const flushList = () => {
    if (currentList.length > 0) {
      blocks.push({ type: 'list', items: currentList });
      currentList = [];
    }
  };

  const flushParagraph = () => {
    if (currentParagraph.length === 0) {
      return;
    }

    const html = currentParagraph
      .map((line, index) => {
        const hasHardBreak = /\s{2,}$/.test(line);
        const content = line.trimEnd();
        const suffix = hasHardBreak && index < currentParagraph.length - 1 ? '<br />' : '';
        return `${renderInline(content)}${suffix}`;
      })
      .join(' ');

    const text = currentParagraph.map((line) => stripInlineMarkdown(line.trimEnd())).join('\n');

    blocks.push({
      type: 'paragraph',
      html,
      text
    });

    currentParagraph = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    if (line.startsWith('### ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: 3, html: renderInline(line.slice(4)) });
      continue;
    }

    if (line.startsWith('## ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: 2, html: renderInline(line.slice(3)) });
      continue;
    }

    if (line.startsWith('# ')) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'heading', level: 1, html: renderInline(line.slice(2)) });
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(line)) {
      flushParagraph();
      flushList();
      blocks.push({ type: 'hr' });
      continue;
    }

    if (line.startsWith('- ')) {
      flushParagraph();
      currentList.push({
        html: renderInline(line.slice(2)),
        text: stripInlineMarkdown(line.slice(2))
      });
      continue;
    }

    flushList();
    currentParagraph.push(rawLine.replace(/^\s+/, ''));
  }

  flushParagraph();
  flushList();
  return blocks;
}

export function renderSimpleMarkdown(markdown: string): string {
  return parseSimpleMarkdown(markdown)
    .map((block) => {
      switch (block.type) {
        case 'heading':
          return `<h${block.level}>${block.html}</h${block.level}>`;
        case 'paragraph':
          return `<p>${block.html}</p>`;
        case 'list':
          return `<ul>\n${block.items.map((item) => `  <li>${item.html}</li>`).join('\n')}\n</ul>`;
        case 'hr':
          return '<hr />';
      }
    })
    .join('\n');
}
