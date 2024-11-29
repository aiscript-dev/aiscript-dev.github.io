import { defineConfig } from 'vitepress';
import aiscriptTmLanguage from 'aiscript-vscode/aiscript/syntaxes/aiscript.tmLanguage.json' with { type: 'json' };
import { createPlaygroundTransformer } from '../scripts/playground-transformer';

// https://vitepress.dev/reference/site-config
export const shared = defineConfig({
    title: 'AiScript',
    srcDir: 'docs',

    themeConfig: {
        logo: '/icons/aiscript_gd.svg',
        socialLinks: [
            { icon: 'github', link: 'https://github.com/aiscript-dev/aiscript' },
        ],
    },

    head: [
        ['link', { rel: 'icon', href: '/favicon.ico' }],
        ['link', { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }],
    ],

    markdown: {
        math: true,
        codeTransformers: [
            createPlaygroundTransformer(),
        ],
        languages: [
            aiscriptTmLanguage as any,
        ],
    },
})
