<template>
    <section class="py-5">
        <div class="container px-4 px-lg-5 mt-5">
            <div class="row">
                <div class="container d-flex">
                    <div class="col-2 pe-4">
                        <div class="input-group">
                            <select class="form-select" @change="handleSelectTableChanged">
                                <option disabled value="" selected>Please select one</option>
                                <option v-for="tableName in tablesName" :key="tableName" :value="tableName">{{ tableName }}</option>
                            </select>
                            <button class="btn btn-danger" :class="selectedTableName === '' ? 'disabled' : ''"
                                @click="deleteTable">
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                                    class="bi bi-dash-circle-fill" viewBox="0 0 16 16">
                                    <path
                                        d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1h-7z" />
                                </svg>
                            </button>
                        </div>
                        <div class="pt-5" v-show="selectedTableName !== ''">
                            <span>Status: {{ selectedTableStatus }}</span>
                            <br />
                            <span>Primary keys: {{ selectedTablePrimaryKeys.join(', ') }}</span>
                            <br />
                            <span>Size in bytes: {{ selectedTableSizeInBytes }}</span>
                        </div>
                    </div>
                    <div class="col-10">
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
                                    <textarea v-model="item.value" class="form-control"
                                        @click="handleItemInitialValue" @change="handleItemValueChanged">
                                    </textarea>
                                </td>
                                <td>
                                    <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                                        <button class="btn btn-success disabled" @click.prevent="edit(item)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor" class="bi bi-database-fill-up" viewBox="0 0 16 16">
                                                <path
                                                    d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Zm.354-5.854 1.5 1.5a.5.5 0 0 1-.708.708L13 11.707V14.5a.5.5 0 0 1-1 0v-2.793l-.646.647a.5.5 0 0 1-.708-.708l1.5-1.5a.5.5 0 0 1 .708 0ZM8 1c-1.573 0-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4s.875 1.755 1.904 2.223C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777C13.125 5.755 14 5.007 14 4s-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1Z" />
                                                <path
                                                    d="M2 7v-.839c.457.432 1.004.751 1.49.972C4.722 7.693 6.318 8 8 8s3.278-.307 4.51-.867c.486-.22 1.033-.54 1.49-.972V7c0 .424-.155.802-.411 1.133a4.51 4.51 0 0 0-4.815 1.843A12.31 12.31 0 0 1 8 10c-1.573 0-3.022-.289-4.096-.777C2.875 8.755 2 8.007 2 7Zm6.257 3.998L8 11c-1.682 0-3.278-.307-4.51-.867-.486-.22-1.033-.54-1.49-.972V10c0 1.007.875 1.755 1.904 2.223C4.978 12.711 6.427 13 8 13h.027a4.552 4.552 0 0 1 .23-2.002Zm-.002 3L8 14c-1.682 0-3.278-.307-4.51-.867-.486-.22-1.033-.54-1.49-.972V13c0 1.007.875 1.755 1.904 2.223C4.978 15.711 6.427 16 8 16c.536 0 1.058-.034 1.555-.097a4.507 4.507 0 0 1-1.3-1.905Z" />
                                            </svg>
                                        </button>
                                        <button class="btn btn-danger" @click.prevent="del(item)">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                fill="currentColor" class="bi bi-database-fill-dash" viewBox="0 0 16 16">
                                                <path
                                                    d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM11 12h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1ZM8 1c-1.573 0-3.022.289-4.096.777C2.875 2.245 2 2.993 2 4s.875 1.755 1.904 2.223C4.978 6.711 6.427 7 8 7s3.022-.289 4.096-.777C13.125 5.755 14 5.007 14 4s-.875-1.755-1.904-2.223C11.022 1.289 9.573 1 8 1Z" />
                                                <path
                                                    d="M2 7v-.839c.457.432 1.004.751 1.49.972C4.722 7.693 6.318 8 8 8s3.278-.307 4.51-.867c.486-.22 1.033-.54 1.49-.972V7c0 .424-.155.802-.411 1.133a4.51 4.51 0 0 0-4.815 1.843A12.31 12.31 0 0 1 8 10c-1.573 0-3.022-.289-4.096-.777C2.875 8.755 2 8.007 2 7Zm6.257 3.998L8 11c-1.682 0-3.278-.307-4.51-.867-.486-.22-1.033-.54-1.49-.972V10c0 1.007.875 1.755 1.904 2.223C4.978 12.711 6.427 13 8 13h.027a4.552 4.552 0 0 1 .23-2.002Zm-.002 3L8 14c-1.682 0-3.278-.307-4.51-.867-.486-.22-1.033-.54-1.49-.972V13c0 1.007.875 1.755 1.904 2.223C4.978 15.711 6.427 16 8 16c.536 0 1.058-.034 1.555-.097a4.507 4.507 0 0 1-1.3-1.905Z" />
                                            </svg>
                                        </button>
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
        </div>
    </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { ApiClient } from '../../clients/api-client';

type Item = {
    value: string
}
type TableDetail = {
    primaryKeys: string[];
    status: string;
    sizeInBytes: number;
}
type TablesResponseDto = {
    data: string[];
}
type DetailResponseDto = {
    data: {
        primaryKeys: string[];
        status: string;
        sizeInBytes: number;
    }
}
type ItemsResponseDto = {
    data: Record<string, unknown>[]
}

const tablesName = ref<string[]>([]);
const selectedTableName = ref<string>('');
const selectedTableStatus = ref<string>('');
const selectedTablePrimaryKeys = ref<string[]>([]);
const selectedTableSizeInBytes = ref<number>();
const items = ref<Array<Item>>([]);
const apiClient = new ApiClient();

onMounted(async () => {
    tablesName.value = await listTablesName();
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
        const tableName = event.target.value;
        const tableDetail = await getTableDetail(tableName)

        selectedTableName.value = tableName;
        selectedTableStatus.value = tableDetail.status;
        selectedTablePrimaryKeys.value = tableDetail.primaryKeys;
        selectedTableSizeInBytes.value = tableDetail.sizeInBytes;
        items.value = await listItems(tableName);
    }
}

async function edit(item: Item): Promise<void> {
    const tableName = selectedTableName.value;

    if (tableName) {
        await updateItem(tableName, item);
    }
}

async function del(item: Item): Promise<void> {
    const tableName = selectedTableName.value;

    if (tableName) {
        await deleteItem(tableName, item);
    }
}

async function deleteTable() {
    const tableName = selectedTableName.value;

    if (tableName) {
        await deleteDynamoTable(tableName);
    }
}

async function listTablesName(): Promise<string[]> {
    const response = await apiClient.get<TablesResponseDto>(`/dynamo/tables`);

    return response.body.data;
}

async function getTableDetail(tableName: string): Promise<TableDetail> {
    const response = await apiClient.get<DetailResponseDto>(`/dynamo/tables/${tableName}`);

    return response.body.data;
}

async function listItems(tableName: string): Promise<Item[]> {
    const response = await apiClient.get<ItemsResponseDto>(`/dynamo/tables/${tableName}/items`);

    return response.body.data.map((item: Record<string, unknown>) => {
        return {
            value: JSON.stringify(item)
        }
    })
}

async function updateItem(tableName: string, item: Item): Promise<void> {
    await apiClient.put<ItemsResponseDto>(
        `/dynamo/tables/${tableName}/items`,
        {
            value: JSON.parse(item.value)
        }
    );
}

async function deleteItem(tableName: string, item: Item): Promise<void> {
    const value: Record<string, unknown> = JSON.parse(item.value);
    const itemPrimaryKey = selectedTablePrimaryKeys.value.reduce((previousValue: Record<string, unknown>, primaryKey: string) => {
        if (value[primaryKey]) {
            previousValue[primaryKey] = value[primaryKey];
        }

        return previousValue;
    }, {})

    await apiClient.delete(
        `/dynamo/tables/${tableName}/items`,
        itemPrimaryKey
    );

    const itemIndex = items.value.indexOf(item);

    if (itemIndex > -1) {
        const currentItems = items.value;
        currentItems.splice(itemIndex, 1);

        items.value = currentItems;
    }
}

async function deleteDynamoTable(tableName: string) {
    await apiClient.delete(`/dynamo/tables/${tableName}`)
}
</script>
