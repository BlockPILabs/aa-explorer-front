<template>
  <el-form
    ref="formRef"
    v-bind="{ ...$attrs, ..._options }"
    :model="model"
    class="titan-form"
  >
    <template v-if="_options.layout">
      <el-row v-bind="_options.layout">
        <el-col v-for="item in columns" :span="getColSpan(item)">
          <titan-form-item
            v-if="!item.show || item.show(model, model)"
            v-bind="$attrs"
            :column="item"
            :empty-words="emptyWords"
            :form="model"
            :root-form="model"
            :form-rules="rules"
          />
        </el-col>
      </el-row>
    </template>
    <template v-else>
      <template v-for="item in columns">
        <titan-form-item
          v-if="!item.show || item.show(model, model)"
          v-bind="$attrs"
          :column="item"
          :empty-words="emptyWords"
          :form="model"
          :root-form="model"
          :form-rules="rules"
        />
      </template>
    </template>
  </el-form>
</template>

<script lang="ts">
  export default {
    name: 'TitanForm'
  }
</script>

<script lang="ts" setup>
  import TitanFormItem from './FormItem.vue'
  import { type FormInstance, FormRules } from 'element-plus'

  interface IFormProps {
    model: Object
    columns: TitanForm.Column[]
    options?: TitanForm.Options
    rules?: FormRules
  }
  const formRef = ref<FormInstance>()
  const props = defineProps<IFormProps>()
  const _options: ComputedRef<TitanForm.Options> = computed(() => {
    const option = {
      emptyText: '-'
    }
    return Object.assign(option, props?.options)
  })
  const emptyWords = computed(() => {
    return _options.value.emptyText
  })
  function getColSpan(col: TitanForm.Column) {
    const defaultSpan = Math.floor(24 / props.columns.length)
    return col.layout?.col?.span || defaultSpan
  }
</script>
