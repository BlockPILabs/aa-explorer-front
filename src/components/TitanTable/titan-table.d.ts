// table
import type { TableProps, TableColumnCtx } from 'element-plus'
import type { VNode } from 'vue'
export = TitanTable
export as namespace TitanTable
declare namespace TitanTable {
  type Type = 'selection' | 'index' | 'expand' | 'image'
  type Size = 'large' | 'default' | 'small'
  type Align = 'left' | 'center' | 'right'
  type Command = string | number
  type Order = 'ascending' | 'descending'
  interface ButtonItem {
    name: string
    command: Command
    size?: Size
    type?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  }

  interface Column<RecordType = any>
    extends Partial<TableColumnCtx<RecordType>> {
    prop?: keyof RecordType 
    type?: Type 
    slot?: string
    align?: Align 
    headerAlign?: Align 
    buttons?: ButtonItem[]
    render?: (params: { row: RecordType; index: number }) => VNode 
    headerRender?: ({ column, index }) => VNode 
    headerSlot?: string 
    children?: Column<RecordType>[] 
  }
  interface Options<T = any> extends Partial<TableProps<T>> {
    context?: TitanTable<T>
    hideEmpty?: boolean
    showPagination?: boolean 
    paginationConfig?: Pagination 
  }

  interface Pagination {
    total: number 
    currentPage: number 
    pageSize: number 
    pageSizes?: number[] 
    layout?: string 
    background?: boolean 
  }
}
