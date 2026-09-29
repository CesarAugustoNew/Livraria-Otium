import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    // em desenvolvimento o front chama /api e o Vite encaminha ao Spring Boot (sem CORS)
    proxy: { '/api': 'http://localhost:8080' },
  },
});
