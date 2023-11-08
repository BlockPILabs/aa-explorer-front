<template>
  <div
    ref="tableWrap"
    class="titan-table"
    :class="{ 'hidden-empty': hideEmpty }"
  >
    <el-table ref="tableRef" :data="data" v-bind="{ ...$attrs, ..._options }">
      <template v-for="(col, index) in columns" :key="index">
        <el-table-column
          v-if="
            col.type === 'index' ||
            col.type === 'selection' ||
            col.type === 'expand'
          "
          :index="indexMethod"
          v-bind="col as TableProps<any>"
        >
          <template #default="{ row, $index }">
            <component
              v-if="col.render"
              :is="col.render"
              :row="row"
              :index="$index"
            />
            <slot
              v-else-if="col.slot"
              name="expand"
              :row="row"
              :index="$index"
            ></slot>
          </template>
        </el-table-column>

        <titan-table-column :col="col" v-else @command="handleAction">
          <template
            v-for="slot in Object.keys($slots)"
            #[slot]="scope: Record<string, any>"
          >
            <slot :name="slot" v-bind="scope" />
          </template>
        </titan-table-column>
      </template>
      <template #empty>
        <slot name="empty" />
      </template>
      <template #append>
        <slot name="append" />
      </template>
    </el-table>
    <div v-if="_options.showPagination">
      <el-pagination
        v-bind="_paginationConfig"
        @size-change="pageSizeChange"
        @current-change="currentPageChange"
      />
    </div>
  </div>
</template>
<script lang="ts">
  export default {
    name: 'TitanTable'
  }
</script>
<script lang="ts" setup>
  import TitanTableColumn from './Column.vue'
  import { type ComputedRef } from 'vue'
  import { ElTable, type TableProps } from 'element-plus'
  import 'element-plus/theme-chalk/el-table.css'
  interface ITableProps {
    data: Array<object>
    columns: TitanTable.Column[]
    options?: TitanTable.Options
    hideEmpty?: boolean
  }

  const props = defineProps<ITableProps>()
  const tableRef = ref<InstanceType<typeof ElTable>>()

  const _options: ComputedRef<TitanTable.Options> = computed(() => {
    const option = {
      stripe: false,
      showHeader: true,
      showPagination: false
    }
    return Object.assign(option, props?.options)
  })
  const _paginationConfig = computed(() => {
    const config = {
      total: 0,
      currentPage: 1,
      pageSize: 10,
      pageSizes: [10, 20, 30, 40, 50, 100],
      layout: 'total, sizes, prev, pager, next, jumper'
    }
    return Object.assign(config, _options.value.paginationConfig)
  })
  const elementEvents = [
    'select',
    'select-all',
    'selection-change',
    'cell-mouse-enter',
    'cell-mouse-leave',
    'cell-contextmenu',
    'cell-click',
    'cell-dblclick',
    'row-click',
    'row-contextmenu',
    'row-dblclick',
    'header-click',
    'header-contextmenu',
    'sort-change',
    'filter-change',
    'current-change',
    'header-dragend',
    'expand-change'
  ] as const
  type ElTableEmitsType = (typeof elementEvents)[number]
  type Event =
    | 'command'
    | 'size-change'
    | 'current-change'
    | 'pagination-change'
    | ElTableEmitsType
  type EmitsEvent = (event: Event, ...args: any[]) => void
  const emit = defineEmits<EmitsEvent>()
  function indexMethod(index: number) {
    const tabIndex =
      index +
      (_paginationConfig.value.currentPage - 1) *
        _paginationConfig.value.pageSize +
      1
    return tabIndex
  }
  const pageSizeChange = (pageSize: number) => {
    emit('size-change', pageSize)
    emit('pagination-change', 1, pageSize)
  }
  const currentPageChange = (currentPage: number) => {
    emit('current-change', currentPage)
    emit('pagination-change', currentPage, _paginationConfig.value.pageSize)
  }
  const handleAction = (
    command: TitanTable.Command,
    row: any,
    index: number
  ) => {
    emit('command', command, row, index)
  }

  defineExpose({ element: tableRef })
</script>
<style lang="scss" scoped>
  .titan-table {
    &.hidden-empty {
      :deep() {
        .el-table__empty-block {
          display: none;
        }
        .el-table__inner-wrapper::before {
          height: 0px;
        }
      }
    }
  }
  :deep(.el-image__inner) {
    transition: all 0.3s;
    cursor: pointer;

    &:hover {
      transform: scale(1.2);
    }
  }
</style>
