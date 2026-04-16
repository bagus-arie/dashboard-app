<template>
  <div class="loading-wrapper">
    <div class="spinner">
      <div class="double-bounce1"></div>
      <div class="double-bounce2"></div>
    </div>
    <p class="loading-text">Memuat Dashboard...</p>
  </div>
</template>

<style scoped>
.loading-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 40px;
}

.loading-text {
  color: rgba(255, 255, 255, 0.7);
  font-weight: 600;
  letter-spacing: 1px;
}

.spinner {
  width: 50px;
  height: 50px;
  position: relative;
}

.double-bounce1, .double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #6C63FF; /* Sesuaikan dengan warna primary Anda */
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  animation: sk-bounce 2.0s infinite ease-in-out;
}

.double-bounce2 {
  animation-delay: -1.0s;
}

@keyframes sk-bounce {
  0%, 100% { transform: scale(0.0) }
  50% { transform: scale(1.0) }
}
</style>