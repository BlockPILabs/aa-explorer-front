<template>
  <el-autocomplete
    v-model="filterVal"
    class="filter-complete"
    popper-class="search-popover"
    :placeholder="placeholder"
    :debounce="500"
    :trigger-on-focus="false"
    :fit-input-width="true"
    :fetch-suggestions="querySearchAsync"
    @select="handleSelect"
  >
    <template #prefix>
      <el-icon :class="{ 'is-loading': isLoading }" v-if="isLoading">
        <i-ep-loading />
      </el-icon>
      <svg-icon iconClass="search" class="w-20px! h-20px!" v-else />
    </template>
    <template #default="{ item }">
      <div v-if="item.groupName" class="bg-#F4F6EF c-#303030 fw-600">
        <span>{{
          SEARCH_RESULT_MAP[item.groupName].group || item.groupName
        }}</span>
      </div>
      <div class="c-#30754B text-16px text-truncate">
        <span>{{ item[SEARCH_RESULT_MAP[item.group].value] }}</span>
      </div>
    </template>
  </el-autocomplete>
</template>

<script lang="ts" setup>
  import { useRouter } from 'vue-router'
  import { searchTerm } from '@/api/modules/search'
  import { flatMap } from 'lodash-es'
  import { SEARCH_RESULT_MAP } from '@/enums/SearchResultMap'
  import { storeToRefs } from 'pinia'
  import { useChainStore } from '@/store/modules/chain'
  const chainStore = useChainStore()
  const { choosingChain } = storeToRefs(chainStore)
  const props = defineProps({
    placeholder: {
      type: String,
      default: 'Search address / hash'
    },
    extraParams: {
      type: Object,
      default: () => ({})
    }
  })
  const filterVal = ref('')
  const isLoading = ref(false)

  async function querySearchAsync(queryString, cb) {
    let minLenth = 4
    if (queryString.startsWith('0x')) {
      minLenth = 6
    }
    if (queryString.length < minLenth) {
      return cb([])
    }

    try {
      isLoading.value = true
      const res = await searchTerm(choosingChain.value, {
        term: queryString,
        ...props.extraParams
      })
      const results = flatMap(res?.Data || [], (item) => {
        return item.Records.map((it, index) => {
          if (index === 0) {
            it.groupName = item.Type
          }
          it.group = item.Type
          return it
        })
      })
      cb(results)
    } catch (error) {
      cb([])
    } finally {
      isLoading.value = false
    }
  }
  const router = useRouter()
  function handleSelect(item) {
    const query = SEARCH_RESULT_MAP[item.group].query
      ? {
          [SEARCH_RESULT_MAP[item.group].query]:
            item[SEARCH_RESULT_MAP[item.group].queryKey]
        }
      : {}
    router.push({
      ...SEARCH_RESULT_MAP[item.group].route,
      params: {
        [SEARCH_RESULT_MAP[item.group].key]:
          item[SEARCH_RESULT_MAP[item.group].value]
      },
      query: {
        ...query
      }
    })
  }
</script>

<style lang="scss">
  .filter-complete {
    width: 100%;
    .el-input__wrapper {
      background-color: #f9f9f9;
      border-radius: 8px;
    }
  }
  .search-popover {
    .el-autocomplete-suggestion li {
      padding: 0px 0px;
      margin: 4px 0px;
      & > div {
        padding: 0 16px;
      }
    }
  }
</style>
