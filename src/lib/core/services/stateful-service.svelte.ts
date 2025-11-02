import type { ServiceState } from '$lib/core/services/stateful-service.types';

export abstract class StatefulService<TItem> {
    private state = $state<ServiceState<TItem>>({
        items: [],
    });

    items = $derived(this.state.items);

    abstract handleRead(): Promise<TItem[]>;

    async read(): Promise<TItem[]> {
        const items = await this.handleRead();

        this.setItems(items);

        return items;
    }

    protected setItems(items: TItem[]) {
        this.state.items = items;
    }
}
