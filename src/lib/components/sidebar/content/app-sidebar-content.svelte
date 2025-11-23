<script lang="ts">
    import { Menu, MenuButton, MenuItem } from '$lib/components/ui/sidebar';
    import { inject } from '$lib/core/di';
    import { PlaylistService } from '$lib/core/services/playlist';
    import type { SidebarItem } from '$lib/components/sidebar/app-sidebar.types';
    import { resolve } from '$app/paths';

    const playlistService = inject(PlaylistService);

    let items = $state<SidebarItem[]>(
        playlistService.items.map((playlist) => ({
            title: playlist.snippet.title,
            route: resolve('/playlists/[id]', { id: playlist.id }),
        })),
    );
</script>

<Menu>
    {#each items as item (item.title)}
        <MenuItem>
            <MenuButton>
                {#snippet child({ props })}
                    <a {...props} href={item.route}>
                        {#if item.icon !== undefined}
                            <item.icon />
                        {/if}

                        <span>{item.title}</span>
                    </a>
                {/snippet}
            </MenuButton>
        </MenuItem>
    {/each}
</Menu>
