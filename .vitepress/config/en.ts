import { defineConfig, type DefaultTheme } from 'vitepress';

const nav: DefaultTheme.NavItem[] = [
    { text: 'Guide', link: '/en/guides/get-started', activeMatch: '^/en/guides/' },
    { text: 'Reference', link: '/en/references/syntax', activeMatch: '^/en/references/' },
    { text: 'Try AiScript', link: '/en/playground', activeMatch: '^/en/playground' },
];

const guideNav: DefaultTheme.SidebarItem[] = [
    {
        text: 'AiScript Basics',
        items: [
            { text: 'Get Started', link: 'get-started' },
            { text: 'Execute AiScript', link: 'execution' },        
            { text: 'Implement to Your App', link: 'implementation' },
        ],
    },
    { text: 'Reference', base: '/en/references/', link: 'syntax' },
];

const referenceNav: DefaultTheme.SidebarItem[] = [
    {
        text: 'Language Specification',
        items: [
            { text: 'Syntax', link: 'syntax' },
            { text: 'Built-in Properties', link: 'builtin-props' },
            { text: 'Keywords', link: 'keywords' },
            { text: 'Literal Expressions', link: 'literals' },
            { text: 'Built-in Functions', link: 'std' },
            { text: 'Math Functions', link: 'std-math' },
        ],
    },
    {
        text: 'JavaScript Interface Specification',
        items: [
            { text: 'Basic Runtime', link: 'interface/basic' },
            { text: 'AiSON', link: 'interface/aison' },
        ],
    },
];

export const en = defineConfig({
    lang: 'en-US',
    description: 'A user script language for browsers',

    themeConfig: {
        nav,

        sidebar: {
            '/en/guides/': { base: '/en/guides/', items: guideNav },
            '/en/references/': { base: '/en/references/', items: referenceNav },
        },
    },
});
