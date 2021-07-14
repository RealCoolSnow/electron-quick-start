<template>
  <div>
    <router-view />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

export default defineComponent({
  setup() {
    console.log('app created')
    const router = useRouter()
    router.push('/web')
  },
})
</script>
