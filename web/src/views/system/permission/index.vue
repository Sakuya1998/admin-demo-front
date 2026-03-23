<template>
  <div class="perm-container">
    <a-card :title="t('system.permMgmt')">
      <template #extra>
        <a-space>
          <a-button type="primary" @click="handleAdd">{{ t('common.create') }}</a-button>
          <a-button @click="handleReload">{{ t('perm.reload') }}</a-button>
        </a-space>
      </template>
      
      <a-table
        :columns="columns"
        :data-source="policyList"
        :loading="loading"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'act'">
            <a-tag :color="getActColor(record.act)">{{ record.act }}</a-tag>
          </template>
          <template v-if="column.key === 'action'">
            <a-popconfirm :title="t('common.confirmDelete')" @confirm="handleDelete(record)">
              <a style="color: var(--color-error)">{{ t('common.delete') }}</a>
            </a-popconfirm>
          </template>
        </template>
      </a-table>
    </a-card>

    <a-modal
      v-model:open="modalVisible"
      :title="t('common.add')"
      @ok="handleModalOk"
      :confirmLoading="modalLoading"
      :okText="t('common.save')"
      :cancelText="t('common.cancel')"
    >
      <a-form
        ref="modalFormRef"
        :model="modalForm"
        :rules="modalRules"
        layout="vertical"
      >
        <a-form-item :label="t('perm.subject')" name="sub">
          <a-input v-model:value="modalForm.sub" :placeholder="t('perm.placeholder.sub')" />
        </a-form-item>
        <a-form-item :label="t('perm.object')" name="obj">
          <a-input v-model:value="modalForm.obj" :placeholder="t('perm.placeholder.obj')" />
        </a-form-item>
        <a-form-item :label="t('perm.action')" name="act">
          <a-select v-model:value="modalForm.act">
            <a-select-option value="GET">GET</a-select-option>
            <a-select-option value="POST">POST</a-select-option>
            <a-select-option value="PUT">PUT</a-select-option>
            <a-select-option value="DELETE">DELETE</a-select-option>
            <a-select-option value="*">*</a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { getPolicies, addPolicy, deletePolicy, reloadPolicies, type Policy } from '@/api/permission'

const { t } = useI18n()
const loading = ref(false)
const policyList = ref<Policy[]>([])

const columns = computed(() => [
  { title: t('perm.subject'), dataIndex: 'sub', key: 'sub' },
  { title: t('perm.object'), dataIndex: 'obj', key: 'obj' },
  { title: t('perm.action'), dataIndex: 'act', key: 'act', width: 100 },
  { title: t('common.action'), key: 'action', width: 100 },
])

// Modal
const modalVisible = ref(false)
const modalLoading = ref(false)
const modalFormRef = ref()
const modalForm = reactive<Policy>({
  sub: '',
  obj: '',
  act: 'GET',
})
const modalRules = computed(() => ({
  sub: [{ required: true, message: t('common.required') }],
  obj: [{ required: true, message: t('common.required') }],
  act: [{ required: true, message: t('common.required') }],
}))

const fetchData = async () => {
  loading.value = true
  try {
    const res: any = await getPolicies()
    if (res.data) {
      // Convert array of arrays to array of objects if needed, or backend returns objects
      // Assuming backend returns [[sub, obj, act], ...] or [{sub, obj, act}, ...]
      // Based on API doc: [["role:1", "/api/v1/users", "GET"], ...]
      if (Array.isArray(res.data) && res.data.length > 0 && Array.isArray(res.data[0])) {
        policyList.value = res.data.map((item: any) => ({
          sub: item[0],
          obj: item[1],
          act: item[2],
        }))
      } else {
        policyList.value = res.data
      }
    } else {
      // Mock data
      policyList.value = [
        { sub: 'role:admin', obj: '/api/users', act: 'GET' },
        { sub: 'role:admin', obj: '/api/users', act: 'POST' },
        { sub: 'role:admin', obj: '/api/users', act: 'PUT' },
        { sub: 'role:admin', obj: '/api/users', act: 'DELETE' },
      ]
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

const getActColor = (act: string) => {
  switch (act) {
    case 'GET': return 'blue'
    case 'POST': return 'green'
    case 'PUT': return 'orange'
    case 'DELETE': return 'red'
    default: return 'default'
  }
}

const handleAdd = () => {
  modalForm.sub = ''
  modalForm.obj = ''
  modalForm.act = 'GET'
  modalVisible.value = true
}

const handleDelete = async (record: Policy) => {
  try {
    await deletePolicy(record)
    message.success(t('common.success'))
    fetchData()
  } catch (error) {
    message.error(t('common.failed'))
  }
}

const handleReload = async () => {
  try {
    await reloadPolicies()
    message.success(t('common.success'))
  } catch (error) {
    message.error(t('common.failed'))
  }
}

const handleModalOk = async () => {
  try {
    await modalFormRef.value.validate()
    modalLoading.value = true
    await addPolicy(modalForm)
    message.success(t('common.success'))
    modalVisible.value = false
    fetchData()
  } catch (error) {
    console.error(error)
  } finally {
    modalLoading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<style lang="less" scoped>
.perm-container {
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
