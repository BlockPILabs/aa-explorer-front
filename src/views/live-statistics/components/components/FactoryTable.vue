<script setup lang="tsx">
  import CopyMe from '@/components/CopyMe/index.vue'
  import { getTopFactory } from '@/api/modules/stat'
  import { throttle } from 'lodash-es'
  const props = defineProps({
    network: {
      type: String,
      default: ''
    }
  })
  const page = ref(1)
  const perPage = ref(15)
  const loading = ref(false)
  const list = ref<any>([])
  const total = ref(0)
  const noMore = computed(() => {
    return (!total.value || list.value.length >= total.value) && !loading.value
  })
  const disabled = computed(() => loading.value || noMore.value)
  const tableCol = ref<any>([
    {
      label: 'Address',
      prop: 'address',
      render: ({ row }) => {
        return (
          <CopyMe
            hash={row.address}
            class='c-#30754B'
            routeInfo={{
              name: 'FactoryInfo',
              params: { factory: row.address }
            }}
          />
        )
      }
    },
    {
      label: 'Active Account',
      prop: 'activeAccount',
      align: 'right',
      render: ({ row }) => {
        return (
          <div>
            <number-show number={row.activeAccount} />
          </div>
        )
      }
    },
    {
      label: 'Total Account',
      prop: 'totalAccount',
      align: 'right',
      render: ({ row }) => {
        return <number-show number={row.totalAccount} />
      }
    }
  ])
  function load() {
    if (disabled.value) return
    const throttled = throttle(() => {
      page.value++
      getList()
    }, 300)
    throttled()
  }
  async function getList() {
    try {
      loading.value = true
      const res = await getTopFactory(props.network, {
        perPage: perPage.value,
        page: page.value
      })
      total.value = res?.totalCount
      if (page.value === 1) {
        list.value = (res?.FactoryDetails || []).map((item) => {
          item.visible = false
          return item
        })
      } else {
        const newList = (res?.FactoryDetails || []).map((item) => {
          item.visible = false
          return item
        })
        list.value = list.value.concat(...newList)
      }
    } catch (error) {
      console.error(error)
      if (page.value > 1) {
        page.value--
      }
    } finally {
      loading.value = false
    }
  }
  function handleScroll(e) {
    const { clientHeight, scrollTop, scrollHeight } = e.target
    if (clientHeight + scrollTop === scrollHeight) {
      load()
    }
  }
  const table: any = ref(null)
  onActivated(() => {
    page.value = 1
    getList()
    nextTick(() => {
      const dom = table.value.$refs.tableRef.$refs.scrollBarRef.wrapRef
      dom.addEventListener('scroll', handleScroll)
    })
  })
  onDeactivated(() => {        
    try {
      const dom = table.value.$refs.tableRef.$refs.scrollBarRef.wrapRef
      dom.removeEventListener('scroll', handleScroll)
    } catch (error) {
      
    }
  })
</script>

<template>
  <div>
    <titan-table
      ref="table"
      :data="list"
      :columns="tableCol"
      class="fixed-height-table"
      :hide-empty="true"
      :max-height="360"
    >
      <template #append>
        <p v-if="noMore" class="text-center pt-32px">No more</p>
      </template>
    </titan-table>
    <p v-if="loading" class="text-center pt-4px">Loading...</p>
  </div>
</template>

<style lang="scss" scoped></style>
