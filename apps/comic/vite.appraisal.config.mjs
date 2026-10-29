import { defineConfig } from 'vite';

export default defineConfig({
  root:'src/appraisal-client',
  esbuild:{jsx:'automatic'},
  build:{outDir:'../../dist/appraisal-client',emptyOutDir:true},
  server:{host:'0.0.0.0',port:5174,strictPort:true,proxy:{'/socket':{target:'http://localhost:3103',ws:true},'/health':'http://localhost:3103'}},
});
