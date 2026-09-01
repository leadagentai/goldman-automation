// AI answer-engine and search crawlers, listed explicitly so there is no
// ambiguity that they are welcome to index the site. Everything is allowed;
// the named entries are belt-and-braces alongside the wildcard rule.
const aiCrawlers = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'Claude-User',
  'Claude-SearchBot',
  'Claude-Web',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'Amazonbot',
  'meta-externalagent',
  'cohere-ai',
  'CCBot',
  'YouBot',
  'DuckAssistBot',
];

export default function robots() {
  return {
    rules: [
      { userAgent: '*', allow: '/' },
      ...aiCrawlers.map((userAgent) => ({ userAgent, allow: '/' })),
    ],
    sitemap: 'https://goldmanautomation.co.uk/sitemap.xml',
    host: 'https://goldmanautomation.co.uk',
  };
}
