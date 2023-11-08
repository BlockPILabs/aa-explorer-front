<template>
  <template v-if="col.children?.length">
    <el-table-column :label="col.label" :width="col.width" :align="col.align">
      <TitanTableColumn
        v-for="item in col.children"
        :col="item"
        :key="item.prop"
      >
        <template
          v-for="slot in Object.keys($slots)"
          #[slot]="scope: Record<string, any>"
        >
          <slot :name="slot" v-bind="scope" />
        </template>
      </TitanTableColumn>
      <template #header="{ column, $index }">
        <component
          v-if="col.headerRender"
          :is="col.headerRender"
          :column="column"
          :index="$index"
        />
        <slot
          v-else-if="col.headerSlot"
          :name="col.headerSlot"
          :column="column"
          :index="$index"
        ></slot>
        <span v-else>{{ column.label }}</span>
      </template>
    </el-table-column>
  </template>
  <el-table-column v-else v-bind="col as TableProps<any>">
    <template #header="{ column, $index }">
      <component
        v-if="col.headerRender"
        :is="col.headerRender"
        :column="column"
        :index="$index"
      />
      <slot
        v-else-if="col.headerSlot"
        :name="col.headerSlot"
        :column="column"
        :index="$index"
      ></slot>
      <span v-else>{{ column.label }}</span>
    </template>
    <template #default="{ row, $index }">
      <el-image
        v-if="col.type === 'image'"
        preview-teleported
        :hide-on-click-modal="true"
        :preview-src-list="[row[col.prop!]]"
        :src="row[col.prop!]"
        fit="cover"
        class="w-9 h-9 rounded-lg"
      />
      <el-button-group v-else-if="col.buttons?.length">
        <el-button
          v-for="(btn, index) in col.buttons"
          :key="index"
          :size="btn.size"
          :type="btn.type"
          @click="handleAction(btn.command, { row, $index })"
          >{{ btn.name }}</el-button
        >
      </el-button-group>
      <component
        v-else-if="col.render"
        :is="col.render"
        :row="row"
        :index="$index"
      />
      <slot
        v-else-if="col.slot"
        :name="col.slot"
        :row="row"
        :index="$index"
      ></slot>
      <span v-else>{{ row[col.prop!] }}</span>
    </template>
  </el-table-column>
</template>

<script lang="ts" setup>
  import { type TableProps } from 'element-plus'

  const props = defineProps<{ col: TitanTable.Column }>()
  defineOptions({
    name: 'TitanTableColumn'
  })
  const emit = defineEmits(['command'])
  const handleAction = (
    command: TitanTable.Command,
    { row, $index }: { row: any; $index: number }
  ) => {
    emit('command', command, row, $index)
  }

</script>
