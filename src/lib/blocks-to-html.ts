import type { ContentBlock } from "@/components/admin/draggable-content-blocks";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function textBlockToHtml(content: Record<string, string>): string {
  const parts: string[] = [];
  if (content.title) parts.push(`<h2>${escapeHtml(content.title)}</h2>`);
  if (content.text) {
    const paragraphs = content.text
      .split("\n\n")
      .filter(Boolean)
      .map((p) => `<p>${escapeHtml(p).replace(/\n/g, "<br>")}</p>`);
    parts.push(paragraphs.join("\n"));
  }
  return parts.join("\n");
}

function imageBlockToHtml(content: Record<string, string>): string {
  if (!content.url) return "";
  const alt = escapeHtml(content.alt || "");
  let html = `<figure><img src="${escapeHtml(content.url)}" alt="${alt}" class="rounded-lg" />`;
  if (content.caption) {
    html += `<figcaption>${escapeHtml(content.caption)}</figcaption>`;
  }
  html += "</figure>";
  return html;
}

function videoBlockToHtml(content: Record<string, string>): string {
  if (!content.url) return "";
  let embedUrl = content.url;
  const ytMatch = content.url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]+)/
  );
  if (ytMatch) embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}`;
  const vimeoMatch = content.url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}`;

  let html = `<div style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:0.5rem;margin:1.5rem 0"><iframe src="${escapeHtml(embedUrl)}" style="position:absolute;top:0;left:0;width:100%;height:100%;border:0" allowfullscreen></iframe></div>`;
  if (content.caption) {
    html += `<p style="text-align:center;font-size:0.8125rem;color:var(--muted-foreground);margin-top:0.5rem">${escapeHtml(content.caption)}</p>`;
  }
  return html;
}

function quoteBlockToHtml(content: Record<string, string>): string {
  let html = `<blockquote><p>${escapeHtml(content.quote || "")}</p>`;
  if (content.author) {
    html += `<footer>— ${escapeHtml(content.author)}</footer>`;
  }
  html += "</blockquote>";
  return html;
}

function codeBlockToHtml(content: Record<string, string>): string {
  const lang = content.language || "code";
  return `<div class="blog-code-block"><div class="blog-code-header">${escapeHtml(lang)}</div><pre><code>${escapeHtml(content.code || "")}</code></pre></div>`;
}

function heroBlockToHtml(content: Record<string, string>): string {
  const bgStyle = content.background
    ? `background-image:url(${escapeHtml(content.background)});background-size:cover;background-position:center;`
    : "background:var(--muted);";
  return `<div style="${bgStyle}padding:3rem 2rem;border-radius:0.75rem;text-align:center;margin:1.5rem 0;color:white;position:relative"><div style="position:relative;z-index:1"><h2 style="font-size:1.75rem;font-weight:700;margin-bottom:0.5rem">${escapeHtml(content.title || "")}</h2><p style="font-size:1rem;opacity:0.9">${escapeHtml(content.subtitle || "")}</p></div></div>`;
}

function tableBlockToHtml(content: Record<string, string>): string {
  try {
    const headers = JSON.parse(content.headers || "[]") as string[];
    const rows = JSON.parse(content.rows || "[]") as string[][];

    let html = '<div class="blog-table-wrap"><table><thead><tr>';
    for (const h of headers) {
      html += `<th>${escapeHtml(h)}</th>`;
    }
    html += "</tr></thead><tbody>";
    for (const row of rows) {
      html += "<tr>";
      for (const cell of row) {
        html += `<td>${escapeHtml(cell)}</td>`;
      }
      html += "</tr>";
    }
    html += "</tbody></table></div>";
    return html;
  } catch {
    return "";
  }
}

const calloutIcons: Record<string, string> = {
  tip: "&#x1F4A1;",
  warning: "&#x26A0;&#xFE0F;",
  info: "&#x2139;&#xFE0F;",
  error: "&#x274C;",
};

function calloutBlockToHtml(content: Record<string, string>): string {
  const type = content.type || "info";
  const icon = calloutIcons[type] || calloutIcons.info;
  return `<div class="blog-callout blog-callout-${escapeHtml(type)}"><div class="blog-callout-title">${icon} ${escapeHtml(content.title || type.charAt(0).toUpperCase() + type.slice(1))}</div><div class="blog-callout-body">${escapeHtml(content.content || "").replace(/\n/g, "<br>")}</div></div>`;
}

function faqBlockToHtml(content: Record<string, string>): string {
  try {
    const items = JSON.parse(content.items || "[]") as {
      question: string;
      answer: string;
    }[];
    if (items.length === 0) return "";

    let html = '<div class="blog-faq">';
    for (const item of items) {
      html += `<details><summary>${escapeHtml(item.question)}</summary><div class="blog-faq-answer">${escapeHtml(item.answer).replace(/\n/g, "<br>")}</div></details>`;
    }
    html += "</div>";
    return html;
  } catch {
    return "";
  }
}

function pollBlockToHtml(content: Record<string, string>): string {
  try {
    const options = JSON.parse(content.options || "[]") as {
      label: string;
      percentage: number;
    }[];
    if (options.length === 0) return "";

    let html = `<div class="blog-poll"><div class="blog-poll-title">${escapeHtml(content.question || "")}</div>`;
    for (const opt of options) {
      html += `<div class="blog-poll-option"><div class="blog-poll-label"><span>${escapeHtml(opt.label)}</span><span>${opt.percentage}%</span></div><div class="blog-poll-bar"><div class="blog-poll-fill" style="width:${opt.percentage}%"></div></div></div>`;
    }
    html += "</div>";
    return html;
  } catch {
    return "";
  }
}

function highlightBlockToHtml(content: Record<string, string>): string {
  const color = content.color || "blue";
  return `<div class="blog-highlight blog-highlight-${escapeHtml(color)}">${escapeHtml(content.text || "").replace(/\n/g, "<br>")}</div>`;
}

function socialBlockToHtml(content: Record<string, string>): string {
  const platform = content.platform || "twitter";
  const initials: Record<string, string> = {
    twitter: "X",
    facebook: "f",
    instagram: "IG",
    linkedin: "in",
  };
  return `<a href="${escapeHtml(content.url || "#")}" target="_blank" rel="noopener noreferrer" class="blog-social"><div class="blog-social-icon blog-social-${escapeHtml(platform)}">${initials[platform] || "?"}</div><div class="blog-social-content"><div class="blog-social-text">${escapeHtml(content.text || "")}</div><div class="blog-social-url">${escapeHtml(content.url || "")}</div></div></a>`;
}

function dividerBlockToHtml(content: Record<string, string>): string {
  const style = content.style || "line";
  if (style === "dots") return '<div class="blog-divider-dots"></div>';
  if (style === "gradient") return '<hr class="blog-divider-gradient" />';
  return '<hr class="blog-divider-line" />';
}

function seoBlockToHtml(content: Record<string, string>): string {
  return `<div class="blog-seo-preview"><div class="seo-title">${escapeHtml(content.seoTitle || "")}</div><div class="seo-url">${escapeHtml(content.seoUrl || "")}</div><div class="seo-description">${escapeHtml(content.seoDescription || "")}</div></div>`;
}

const converters: Record<
  string,
  (content: Record<string, string>) => string
> = {
  text: textBlockToHtml,
  image: imageBlockToHtml,
  video: videoBlockToHtml,
  quote: quoteBlockToHtml,
  code: codeBlockToHtml,
  hero: heroBlockToHtml,
  table: tableBlockToHtml,
  callout: calloutBlockToHtml,
  faq: faqBlockToHtml,
  poll: pollBlockToHtml,
  highlight: highlightBlockToHtml,
  social: socialBlockToHtml,
  divider: dividerBlockToHtml,
  seo: seoBlockToHtml,
};

export function blocksToHtml(blocks: ContentBlock[]): string {
  return blocks
    .map((block) => {
      const converter = converters[block.type];
      return converter ? converter(block.content) : "";
    })
    .filter(Boolean)
    .join("\n\n");
}
