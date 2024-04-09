export function useTitanTableScrollHeight() {
  const table: any = ref(null)
  const tableHeight = ref(0)
  const { height, width } = useWindowSize()
  const { top } = useElementBounding(table)
  onMounted(() => {
    calcTable()
  })
  function calcTable() {
    nextTick(() => {
      if (width.value < 768) {
        tableHeight.value = 400
      } else {
        tableHeight.value = height.value - top.value - 60
      }
      table.value.element.style.height = tableHeight.value + 'px'
    })
  }
  watch([height, width], () => {
    calcTable()
  })
  return {
    table,
    tableHeight
  }
}
