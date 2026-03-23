<template>
  <div class="profile-container">
    <a-row :gutter="16">
      <a-col :span="8">
        <a-card :title="t('profile.info')">
          <div class="user-info">
            <a-avatar :size="64" :src="userInfo.avatar" />
            <h2>{{ userInfo.nickname }}</h2>
            <p>{{ userInfo.email }}</p>
          </div>
          <a-divider />
          <p><user-outlined /> {{ userInfo.username }}</p>
          <p><phone-outlined /> {{ userInfo.phone }}</p>
          <p><clock-circle-outlined /> {{ userInfo.created_at }}</p>
        </a-card>
      </a-col>
      <a-col :span="16">
        <a-card :title="t('profile.edit')">
          <a-tabs v-model:activeKey="activeTab">
            <a-tab-pane key="basic" :tab="t('profile.basic')">
              <a-form :model="formState" @finish="handleUpdate" layout="vertical">
                <a-form-item :label="t('user.nickname')" name="nickname">
                  <a-input v-model:value="formState.nickname" />
                </a-form-item>
                <a-form-item :label="t('user.email')" name="email">
                  <a-input v-model:value="formState.email" />
                </a-form-item>
                <a-form-item :label="t('user.phone')" name="phone">
                  <a-input v-model:value="formState.phone" />
                </a-form-item>
                <a-button type="primary" html-type="submit">{{ t('common.save') }}</a-button>
              </a-form>
            </a-tab-pane>
            <a-tab-pane key="security" :tab="t('profile.security')">
              <a-form :model="passwordState" @finish="handlePassword" layout="vertical">
                <a-form-item :label="t('profile.oldPassword')" name="old_password">
                  <a-input-password v-model:value="passwordState.old_password" />
                </a-form-item>
                <a-form-item :label="t('profile.newPassword')" name="new_password">
                  <a-input-password v-model:value="passwordState.new_password" />
                </a-form-item>
                <a-button type="primary" html-type="submit">{{ t('common.save') }}</a-button>
              </a-form>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { useI18n } from 'vue-i18n'
import { UserOutlined, PhoneOutlined, ClockCircleOutlined } from '@ant-design/icons-vue'
import { getUserProfile, updateUserProfile, updatePassword } from '@/api/profile'

const { t } = useI18n()
const userInfo = ref<any>({})
const activeTab = ref('basic')

const formState = reactive({
  nickname: '',
  email: '',
  phone: '',
})

const passwordState = reactive({
  old_password: '',
  new_password: '',
})

const fetchData = async () => {
  const res: any = await getUserProfile()
  userInfo.value = res.data
  formState.nickname = res.data.nickname
  formState.email = res.data.email
  formState.phone = res.data.phone
}

const handleUpdate = async () => {
  await updateUserProfile(formState)
  message.success(t('common.success'))
  fetchData()
}

const handlePassword = async () => {
  await updatePassword(passwordState)
  message.success(t('common.success'))
}

onMounted(fetchData)
</script>

<style scoped>
.user-info {
  text-align: center;
}
</style>
