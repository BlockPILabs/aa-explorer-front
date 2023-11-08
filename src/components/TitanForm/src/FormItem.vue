<template>
  <el-form-item
    v-bind="$attrs"
    :prop="propPath"
    :label="column.label"
    :required="column.required"
    :rules="column.rules"
    :error="column.error"
    :show-message="column.showMessage"
    :inline-message="column.inlineMessage"
    :size="column.size"
  >
    <span>111</span>
  </el-form-item>
</template>

<script lang="ts">
  export default {
    name: 'TitanFormItem'
  }
</script>

<script setup lang="ts">
  import { castArray } from 'lodash-es'
  import { getProp } from './utils'
  interface IFormItemProps {
    column: TitanForm.Column
    form: object
    rootForm: object
    formRules?: object[] | object
    emptyWords?: string
    parentFullProp?: string
    labelPosition?: string
    itemIndex?: number
    disabled?: boolean
  }

  const props = defineProps<IFormItemProps>()
  const attrs = useAttrs()

  const propPath = computed(() => {
    if (!props.parentFullProp) {
      return props.column.prop
    }
    return props.parentFullProp + '.' + props.column.prop
  })
  const calcLabelWidth = computed(() => {
    return props.column.labelWidth || attrs.labelWidth
  })
  const calcLabelPosition = computed(() => {
    return props.column.labelPosition || props.labelPosition || 'top'
  })
  const labelStyle = computed(() => {
    return {
      width: calcLabelWidth.value || 'auto',
      display: 'inline-block',
      textAlign:
        (['left', 'right'].includes(calcLabelPosition.value) &&
          calcLabelPosition.value) ||
        'left'
    }
  })
  const normalizedRules = computed(() => {
    const { required } = props.column
    const rules: any[] = []
    if (props.column.rules) {
      rules.push(...castArray(props.column.rules))
    }
    const formRules = props.formRules
    if (formRules && props.column.prop) {
      const _rules = getProp(formRules, props.column.prop).value
      if (_rules) {
        rules.push(...castArray(_rules))
      }
    }
    if (required !== void 0) {
      const requiredRules = rules
        .map((rule, i) => [rule, i])
        .filter(([rule]) => Object.keys(rule).includes('required'))
      if (requiredRules.length > 0) {
        for (const [rule, i] of requiredRules) {
          if (rule.required === required) continue
          rules[i] = { ...rule, required }
        }
      } else {
        rules.push({ required })
      }
    }
    return rules
  })

  const isRequired = computed(() =>
    normalizedRules.value.some((rule) => rule.required)
  )
</script>
