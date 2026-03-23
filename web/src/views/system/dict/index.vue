<template>
  <div class="dict-container">
    <a-row :gutter="16">
      <!-- Dict Type List -->
      <a-col :span="8">
        <a-card class="list-card" :title="t('dict.type')">
          <template #extra>
            <a-button type="link" @click="handleAddType">{{ t('common.add') }}</a-button>
          </template>
          <a-list
            item-layout="horizontal"
            :data-source="typeList"
            :loading="typeLoading"
          >
            <template #renderItem="{ item }">
              <a-list-item 
                class="dict-type-item" 
                :class="{ active: currentType?.id === item.id }"
                @click="handleSelectType(item)"
              >
                <a-list-item-meta
                  :description="item.code"
                >
                  <template #title>
                    <span>{{ item.name }}</span>
                  </template>
                </a-list-item-meta>
                <template #actions>
                  <a @click.stop="handleEditType(item)">{{ t('common.edit') }}</a>
                  <a-popconfirm :title="t('common.confirmDelete')" @confirm="handleDeleteType(item.id)">
                    <a style="color: var(--color-error)" @click.stop>{{ t('common.delete') }}</a>
                  </a-popconfirm>
                </template>
              </a-list-item>
            </template>
          </a-list>
        </a-card>
      </a-col>
      
      <!-- Dict Data List -->
      <a-col :span="16">
        <a-card :title="currentType ? currentType.name : t('dict.data')">
          <template #extra>
            <a-button type="primary" :disabled="!currentType" @click="handleAddData">{{ t('common.create') }}</a-button>
          </template>
          
          <a-table
            :columns="dataColumns"
            :data-source="dataList"
            :loading="dataLoading"
            row-key="id"
            :pagination="false"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <span :style="{ color: record.status === 1 ? 'var(--color-success)' : 'var(--color-error)' }">
                  {{ record.status === 1 ? t('common.active') : t('common.inactive') }}
                </span>
              </template>
              <template v-if="column.key === 'action'">
                <a-space>
                  <a @click="handleEditData(record)">{{ t('common.edit') }}</a>
                  <a-popconfirm :title="t('common.confirmDelete')" @confirm="handleDeleteData(record.id)">
                    <a style="color: var(--color-error)">{{ t('common.delete') }}</a>
                  </a-popconfirm>
                </a-space>
              </template>
            </template>
          </a-table>
        </a-card>
      </a-col>
    </a-row>

    <!-- Type Modal -->
    <a-modal
      v-model:open="typeModalVisible"
      :title="typeModalType === 'add' ? t('common.create') : t('common.edit')"
      @ok="handleTypeModalOk"
      :confirmLoading="typeModalLoading"
      :okText="t('common.save')"
      :cancelText="t('common.cancel')"
    >
      <a-form
        ref="typeModalFormRef"
        :model="typeModalForm"
        :rules="typeModalRules"
        layout="vertical"
      >
        <a-form-item :label="t('dict.name')" name="name">
          <a-input v-model:value="typeModalForm.name" />
        </a-form-item>
        <a-form-item :label="t('dict.code')" name="code">
          <a-input v-model:value="typeModalForm.code" />
        </a-form-item>
        <a-form-item :label="t('dict.remark')" name="remark">
          <a-textarea v-model:value="typeModalForm.remark" />
        </a-form-item>
        <a-form-item :label="t('common.status')" name="status">
          <a-radio-group v-model:value="typeModalForm.status">
            <a-radio :value="1">{{ t('common.active') }}</a-radio>
            <a-radio :value="0">{{ t('common.inactive') }}</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- Data Modal -->
    <a-modal
      v-model:open="dataModalVisible"
      :title="dataModalType === 'add' ? t('common.create') : t('common.edit')"
      @ok="handleDataModalOk"
      :confirmLoading="dataModalLoading"
      :okText="t('common.save')"
      :cancelText="t('common.cancel')"
    >
      <a-form
        ref="dataModalFormRef"
        :model="dataModalForm"
        :rules="dataModalRules"
        layout="vertical"
      >
        <a-form-item :label="t('dict.label')" name="label">
          <a-input v-model:value="dataModalForm.label" />
        </a-form-item>
        <a-form-item :label="t('dict.value')" name="value">
          <a-input v-model:value="dataModalForm.value" />
        </a-form-item>
        <a-form-item :label="t('menu.sort')" name="sort">
          <a-input-number v-model:value="dataModalForm.sort" style="width: 100%" />
        </a-form-item>
        <a-form-item :label="t('common.status')" name="status">
          <a-radio-group v-model:value="dataModalForm.status">
            <a-radio :value="1">{{ t('common.active') }}</a-radio>
            <a-radio :value="0">{{ t('common.inactive') }}</a-radio>
          </a-radio-group>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { 
  getDictTypes, createDictType, updateDictType, deleteDictType,
  getDictData, createDictData, updateDictData, deleteDictData,
  type DictType, type DictData
} from '@/api/dict'

const { t } = useI18n()

// Type List
const typeLoading = ref(false)
const typeList = ref<DictType[]>([])
const currentType = ref<DictType | null>(null)

// Data List
const dataLoading = ref(false)
const dataList = ref<DictData[]>([])
const dataColumns = computed(() => [
  { title: t('dict.label'), dataIndex: 'label', key: 'label' },
  { title: t('dict.value'), dataIndex: 'value', key: 'value' },
  { title: t('menu.sort'), dataIndex: 'sort', key: 'sort' },
  { title: t('common.status'), dataIndex: 'status', key: 'status' },
  { title: t('common.action'), key: 'action', width: 150 },
])

// Type Modal
const typeModalVisible = ref(false)
const typeModalType = ref<'add' | 'edit'>('add')
const typeModalLoading = ref(false)
const typeModalFormRef = ref()
const typeModalForm = reactive({
  id: 0,
  name: '',
  code: '',
  remark: '',
  status: 1,
})
const typeModalRules = computed(() => ({
  name: [{ required: true, message: t('common.required') }],
  code: [{ required: true, message: t('common.required') }],
}))

// Data Modal
const dataModalVisible = ref(false)
const dataModalType = ref<'add' | 'edit'>('add')
const dataModalLoading = ref(false)
const dataModalFormRef = ref()
const dataModalForm = reactive({
  id: 0,
  type_id: 0,
  label: '',
  value: '',
  sort: 0,
  status: 1,
})
const dataModalRules = computed(() => ({
  label: [{ required: true, message: t('common.required') }],
  value: [{ required: true, message: t('common.required') }],
}))

// --- Type Methods ---

const fetchTypes = async () => {
  typeLoading.value = true
  try {
    const res: any = await getDictTypes({})
    if (res.data && res.data.items) {
      typeList.value = res.data.items
    } else {
      // Mock
      typeList.value = [
        { id: 1, name: 'GENDER', code: 'gender', remark: '', status: 1, created_at: '' },
        { id: 2, name: 'STATUS', code: 'status', remark: '', status: 1, created_at: '' },
      ]
    }
  } catch (error) {
    console.error(error)
  } finally {
    typeLoading.value = false
  }
}

const handleSelectType = (item: DictType) => {
  currentType.value = item
  fetchData()
}

const handleAddType = () => {
  typeModalType.value = 'add'
  typeModalForm.id = 0
  typeModalForm.name = ''
  typeModalForm.code = ''
  typeModalForm.remark = ''
  typeModalForm.status = 1
  typeModalVisible.value = true
}

const handleEditType = (item: DictType) => {
  typeModalType.value = 'edit'
  Object.assign(typeModalForm, item)
  typeModalVisible.value = true
}

const handleDeleteType = async (id: number) => {
  try {
    await deleteDictType(id)
    message.success(t('common.success'))
    fetchTypes()
    if (currentType.value?.id === id) {
      currentType.value = null
      dataList.value = []
    }
  } catch (error) {
    message.error(t('common.failed'))
  }
}

const handleTypeModalOk = async () => {
  try {
    await typeModalFormRef.value.validate()
    typeModalLoading.value = true
    if (typeModalType.value === 'add') {
      await createDictType(typeModalForm)
      message.success(t('common.success'))
    } else {
      await updateDictType(typeModalForm.id, typeModalForm)
      message.success(t('common.success'))
    }
    typeModalVisible.value = false
    fetchTypes()
  } catch (error) {
    console.error(error)
  } finally {
    typeModalLoading.value = false
  }
}

// --- Data Methods ---

const fetchData = async () => {
  if (!currentType.value) return
  dataLoading.value = true
  try {
    const res: any = await getDictData({ type_id: currentType.value.id })
    if (res.data && res.data.items) {
      dataList.value = res.data.items
    } else {
      // Mock
      if (currentType.value.code === 'gender') {
        dataList.value = [
          { id: 1, type_id: 1, label: 'MALE', value: '1', sort: 1, status: 1, created_at: '' },
          { id: 2, type_id: 1, label: 'FEMALE', value: '2', sort: 2, status: 1, created_at: '' },
        ]
      } else {
        dataList.value = []
      }
    }
  } catch (error) {
    console.error(error)
  } finally {
    dataLoading.value = false
  }
}

const handleAddData = () => {
  if (!currentType.value) return
  dataModalType.value = 'add'
  dataModalForm.id = 0
  dataModalForm.type_id = currentType.value.id
  dataModalForm.label = ''
  dataModalForm.value = ''
  dataModalForm.sort = 0
  dataModalForm.status = 1
  dataModalVisible.value = true
}

const handleEditData = (item: DictData) => {
  dataModalType.value = 'edit'
  Object.assign(dataModalForm, item)
  dataModalVisible.value = true
}

const handleDeleteData = async (id: number) => {
  try {
    await deleteDictData(id)
    message.success(t('common.success'))
    fetchData()
  } catch (error) {
    message.error(t('common.failed'))
  }
}

const handleDataModalOk = async () => {
  try {
    await dataModalFormRef.value.validate()
    dataModalLoading.value = true
    if (dataModalType.value === 'add') {
      await createDictData(dataModalForm)
      message.success(t('common.success'))
    } else {
      await updateDictData(dataModalForm.id, dataModalForm)
      message.success(t('common.success'))
    }
    dataModalVisible.value = false
    fetchData()
  } catch (error) {
    console.error(error)
  } finally {
    dataModalLoading.value = false
  }
}

onMounted(() => {
  fetchTypes()
})
</script>

<style lang="less" scoped>
.dict-container {
  .list-card {
    height: 100%;
    .dict-type-item {
      cursor: pointer;
      padding: 10px;
      transition: all 0.2s;
      border-bottom: 1px solid #222;
      
      &:hover {
        background: rgba(0, 240, 255, 0.05);
      }
      
      &.active {
        background: rgba(0, 240, 255, 0.1);
        border-left: 2px solid var(--color-primary);
      }
    }
  }
  
  .table-card {
    .table-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      .title {
        font-family: var(--font-family-mono);
        font-size: 18px;
        color: var(--color-primary);
        letter-spacing: 1px;
      }
    }
  }
}
</style>
