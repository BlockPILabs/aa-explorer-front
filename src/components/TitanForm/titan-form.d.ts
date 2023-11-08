// form
import type { FormProps, FormItemProps, RowProps, ColProps } from 'element-plus'
import type { VNode } from 'vue'

export = TitanForm
export as namespace TitanForm
declare namespace TitanForm {
  type Layout = {
    row?: Partial<RowProps>
    col: Partial<ColProps>
  }
  interface Options<T = any> extends Partial<FormProps> {
    emptyText?: string
    layout?: Layout
  }
  interface Column<RecordType = Record<string, any>>
    extends Partial<FormItemProps> {
    prop?: keyof RecordType
    render?: (form: RecordType, rootForm: RecordType) => VNode
    children?: Column<RecordType>[]
    item?: Column<RecordType>[]
    itemButtonText?: string
    itemButtonIcon?: (form: RecordType, rootForm: RecordType) => VNode
    value?: RecordType
    show?: (form: RecordType, rootForm: RecordType) => boolean
    layout?: Layout
    renderLabel?: (form: RecordType, rootForm: RecordType) => VNode
    renderError?: (form: RecordType, rootForm: RecordType) => VNode
    labelPosition?: string
    class?: string
  }
}
