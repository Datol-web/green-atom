<template> <!-- лейаут всех страниц -->
  <div class="app-main-layout">
    <Navbar/>

    <main class="app-content">
      <div class="app-page">
        <router-view />
      </div>
    </main>

    <div class="footer">
      <p class="copyrite">
       © АО "Гринатом" Общий центр обслуживания Госкорпорации "Росатом" - 2021
      </p>
    </div>

  </div>
</template>

<script>
import Navbar from '@/components/NavBar'

export default {
  name: 'main-layout',
  data: () => ({
    
  }),
  components: {
    Navbar
  }
}
</script>
