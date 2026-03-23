<template>
  <div class="tags-view-container">
    <div class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        :key="tag.path"
        :to="{ path: tag.path, query: tag.query }"
        class="tags-view-item"
        :class="isActive(tag) ? 'active' : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        {{ tag.title && isI18nKey(tag.title) ? t(tag.title) : tag.title }}
        <close-outlined
          v-if="!isAffix(tag)"
          class="close-icon"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </div>
    
    <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
      <li @click="refreshSelectedTag(selectedTag)">{{ t('tagsView.refresh') }}</li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        {{ t('tagsView.close') }}
      </li>
      <li @click="closeOthersTags">{{ t('tagsView.closeOthers') }}</li>
      <li @click="closeAllTags">{{ t('tagsView.closeAll') }}</li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useTagsViewStore } from '@/stores/tagsView'
import { CloseOutlined } from '@ant-design/icons-vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const tagsViewStore = useTagsViewStore()

const visitedViews = computed(() => tagsViewStore.visitedViews)
const visible = ref(false)
const top = ref(0)
const left = ref(0)
const selectedTag = ref<any>({})
const affixTags = ref<any[]>([])

const isActive = (tag: any) => {
  return tag.path === route.path
}

const isAffix = (tag: any) => {
  return tag.meta && tag.meta.affix
}

const isI18nKey = (title: string) => {
  return title && (title.includes('.') || title === 'DASHBOARD' || title === 'USER MGMT') // Simple check
}

const addTags = () => {
  const { name } = route
  if (name) {
    tagsViewStore.addView(route)
  }
  return false
}

const initTags = () => {
  const affixTags = (router.getRoutes() || [])
    .filter((item) => item.meta && item.meta.affix)
    .map((item) => ({
      name: item.name,
      path: item.path,
      meta: item.meta,
      title: (item.meta.title as string) || 'no-name'
    }))
  
  for (const tag of affixTags) {
    // Must have tag name
    if (tag.name) {
      tagsViewStore.addVisitedView(tag)
    }
  }
}

const refreshSelectedTag = (view: any) => {
  tagsViewStore.delCachedView(view)
  const { fullPath } = view
  nextTick(() => {
    router.replace({
      path: '/redirect' + fullPath,
    }).catch(() => {
        // Fallback if redirect route doesn't exist
        router.replace(fullPath)
    })
  })
}

const closeSelectedTag = (view: any) => {
  tagsViewStore.delView(view).then(({ visitedViews }: any) => {
    if (isActive(view)) {
      toLastView(visitedViews, view)
    }
  })
}

const closeOthersTags = () => {
  router.push(selectedTag.value)
  tagsViewStore.delOthersViews(selectedTag.value).then(() => {
    // moveToCurrentTag()
  })
}

const closeAllTags = () => {
  tagsViewStore.delAllViews().then(({ visitedViews }: any) => {
    if (affixTags.value.some((tag) => tag.path === route.path)) {
      return
    }
    toLastView(visitedViews, route)
  })
}

const toLastView = (visitedViews: any[], view: any) => {
  const latestView = visitedViews.slice(-1)[0]
  if (latestView) {
    router.push(latestView.path)
  } else {
    // now the default is to redirect to the home page if there is no tags-view,
    // you can adjust it according to your needs.
    if (view.name === 'Dashboard') {
      // to reload home page
      router.replace({ path: '/redirect' + view.fullPath })
    } else {
      router.push('/')
    }
  }
}

const openMenu = (tag: any, e: MouseEvent) => {
  const menuMinWidth = 105
  // const offsetLeft = 240 // sidebar width
  const offsetWidth = document.body.offsetWidth // container width
  const maxLeft = offsetWidth - menuMinWidth
  const left15 = e.clientX + 15
  
  if (left15 > maxLeft) {
    left.value = maxLeft
  } else {
    left.value = left15
  }
  
  top.value = e.clientY
  visible.value = true
  selectedTag.value = tag
}

const closeMenu = () => {
  visible.value = false
}

watch(
  () => route.path,
  () => {
    addTags()
    // moveToCurrentTag()
  }
)

watch(visible, (value) => {
  if (value) {
    document.body.addEventListener('click', closeMenu)
  } else {
    document.body.removeEventListener('click', closeMenu)
  }
})

onMounted(() => {
  initTags()
  addTags()
})
</script>

<style lang="less" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: var(--color-bg-container);
  border-bottom: 1px solid var(--color-border);
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
  
  .tags-view-wrapper {
    display: flex;
    align-items: center;
    height: 100%;
    padding: 0 10px;
    overflow-x: auto;
    
    .tags-view-item {
      display: inline-flex;
      align-items: center;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid var(--color-border);
      color: var(--color-text);
      background: var(--color-bg-base);
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;
      text-decoration: none;
      
      &:first-of-type {
        margin-left: 0;
      }
      
      &.active {
        background-color: var(--color-primary);
        color: #000;
        border-color: var(--color-primary);
        
        &::before {
          content: '';
          background: #000;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 5px;
        }
      }
      
      .close-icon {
        margin-left: 5px;
        width: 12px;
        height: 12px;
        vertical-align: 0;
        border-radius: 50%;
        text-align: center;
        transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
        transform-origin: 100% 50%;
        
        &:before {
          transform: scale(0.6);
          display: inline-block;
          vertical-align: -1px;
        }
        
        &:hover {
          background-color: #000;
          color: #fff;
        }
      }
    }
  }
  
  .contextmenu {
    margin: 0;
    background: var(--color-bg-container);
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: var(--color-text);
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    border: 1px solid var(--color-border);
    
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      
      &:hover {
        background: var(--color-primary);
        color: #000;
      }
    }
  }
}
</style>
