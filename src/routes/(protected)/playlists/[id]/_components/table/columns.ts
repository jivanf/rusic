import { renderSnippet } from '$lib/components/ui/data-table';
import type { PlaylistItem } from '$lib/core/services/playlist-item';
import type { ColumnDef } from '@tanstack/table-core';
import { createRawSnippet } from 'svelte';

export const columns: ColumnDef<PlaylistItem>[] = [
    {
        accessorFn: ({ snippet }) => snippet.position + 1,
        header: '#',
        cell: ({ row }) => {
            const snippet = createRawSnippet<[{ index: number }]>((getParams) => {
                const { index } = getParams();

                return {
                    render: () => `
                        ${index}
                     `,
                };
            });

            return renderSnippet(snippet, {
                index: row.original.snippet.position + 1,
            });
        },
    },
    {
        accessorFn: ({ snippet }) => {
            const title = snippet.title;
            const description = snippet.description;

            return !title.endsWith('...')
                ? title
                : description.slice(description.indexOf('\n\n') + 1, description.indexOf('·')).trim();
        },
        header: 'Title',
    },
];
