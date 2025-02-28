import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(), 
    tailwindcss(),
    // Temporariamente comentado para debug
    // obfuscator({
    //   options: {
    //     compact: true,
    //     controlFlowFlattening: true,
    //     controlFlowFlatteningThreshold: 1,
    //     numbersToExpressions: true,
    //     simplify: true,
    //     stringArrayShuffle: true,
    //     splitStrings: true,
    //     stringArrayThreshold: 1,
    //     transformObjectKeys: true,
    //     unicodeEscapeSequence: false,
    //     debugProtection: true,
    //     debugProtectionInterval: 4000,
    //     disableConsoleOutput: true,
    //     identifierNamesGenerator: 'hexadecimal',
    //     rotateStringArray: true,
    //     selfDefending: true,
    //     stringArray: true,
    //     stringArrayEncoding: ['rc4'],
    //   }
    // })
  ],
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.webp'],
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          
          let extType = assetInfo.name.split('.').at(1) || '';
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(extType)) {
            extType = 'img';
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
      },
    },
  },
})
