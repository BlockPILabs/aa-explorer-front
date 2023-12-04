<script setup lang="tsx">
  import CopyMe from '@/components/CopyMe/index.vue'
  import { getTopBundler } from '@/api/modules/stat'
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
              name: 'BundlerInfo',
              params: { bundler: row.address }
            }}
          />
        )
      }
    },
    {
      label: 'Bundles',
      prop: 'bundles',
      align: 'right',
      render: ({ row }) => {
        return <number-show number={row.bundles} />
      }
    },
    {
      label: '24H Success%',
      prop: 'success24H',
      align: 'right',
      render: ({ row }) => {
        return <number-show number={row.success24H} format='0.[00]%' />
      }
    },
    {
      label: 'Profits(24H)',
      align: 'right',
      render: ({ row }) => {
        return (
          <div>
            <div class='mb-4px'>
              <svg-icon
                iconClass={'coin-' + props.network}
                class='w-16px! h-16px! mr-4px'
              ></svg-icon>
              <number-show
                number={row.feeEarned24H}
                class='fw-600'
                format='0,0.[000000]'
              />
            </div>
            <div>
              <number-show
                number={row.feeEarnedUsd24H}
                format='{&asymp;$}0,0.[000000]'
                class='c-#93959C'
              />
            </div>
          </div>
        )
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
      const res = await getTopBundler(props.network, {
        perPage: perPage.value,
        page: page.value
      })
      total.value = res?.totalCount
      if (page.value === 1) {
        list.value = (res?.BundlerDetails || []).map((item) => {
          item.visible = false
          return item
        })
      } else {
        const newList = (res?.BundlerDetails || []).map((item) => {
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
