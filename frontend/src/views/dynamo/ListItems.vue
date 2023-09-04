<template>
    <section class="py-5">
        <div class="container px-4 px-lg-5 mt-5">
            <div class="row">
                <div class="container d-flex">
                    <div>
                        <select @change="handleSelectTableChanged">
                            <option disabled value="" selected>Please select one</option>
                            <option v-for="table in tables" :key="table" :value="table">{{ table }}</option>
                        </select>
                        <button class="btn btn-danger" :class="selectedTable === '' ? 'disabled' : ''" @click="deleteTable">Delete table</button>
                    </div>
                    <table class="table table-striped table-hover">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Value</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody v-for="(item, index) in items">
                            <th scope="row">{{ index }}</th>
                            <td>
                                <textarea v-model="item.value" class="form-control disabled"
                                    @click="handleItemInitialValue"
                                    @change="handleItemValueChanged">
                                </textarea>
                            </td>
                            <td>
                                <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                    <button class="btn btn-success disabled" @click.prevent="edit(item)">Edit</button>
                                </div>
                            </td>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td class="border-bottom-0">
                                    <div class="justify-content-start">
                                        Total: {{ items.length }}
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ApiClient } from '../../clients/api-client';

type Item = {
    value: string
}
type TablesResponseDto = {
    data: string[];
}
type ItemsResponseDto = {
    data: Record<string, unknown>[]
}

const tables = ref<string[]>([]);
const selectedTable = ref<string>('');
const items = ref<Array<Item>>([]);
const apiClient = new ApiClient();

onMounted(async () => {
    tables.value = await listTables();
})

function handleItemInitialValue(event: any): void {
    const target = event.target as HTMLInputElement;

    const hasInitialValue = 'dynamoItemInitialValue' in target.dataset;
    if (!hasInitialValue) {
        target.dataset.dynamoItemInitialValue = target.value;
    }
}

function handleItemValueChanged(event: any): void {
    const target = event.target as HTMLInputElement;

    if (target.dataset.dynamoItemInitialValue === target.value) {
        target?.parentElement?.nextElementSibling?.children.item(0)?.children.item(0)?.classList.add('disabled');
    } else {
        target?.parentElement?.nextElementSibling?.children.item(0)?.children.item(0)?.classList.remove('disabled');
    }
}

async function handleSelectTableChanged(event: any): Promise<void> {
    if (event) {
        selectedTable.value = event.target.value;
        items.value = await listItems(event.target.value);
    }
}

async function edit(item: Item): Promise<void> {
    const tableName = selectedTable.value;

    if (tableName) {
        await updateItem(tableName, item);
    }
}

async function deleteTable() {
    const tableName = selectedTable.value;

    if (tableName) {
        await deleteDynamoTable(tableName);
    }
}

async function listTables(): Promise<string[]> {
    const response = await apiClient.get<TablesResponseDto>(`/dynamo/tables`);

    return response.body.data;
}

async function listItems(tableName: string): Promise<Item[]> {
    const response = await apiClient.get<ItemsResponseDto>(`/dynamo/tables/${tableName}/items`);

    return response.body.data.map((data: Record<string, unknown>) => {
        return {
            value: JSON.stringify(data)
        }
    });
}

async function updateItem(tableName: string, item: Item): Promise<void> {
    await apiClient.put<ItemsResponseDto>(
        `/dynamo/tables/${tableName}/items`,
        {
            value: JSON.parse(item.value)
        }
    );
}

async function deleteDynamoTable(tableName: string) {
    await apiClient.delete(`/dynamo/tables/${tableName}`)
}
</script>
