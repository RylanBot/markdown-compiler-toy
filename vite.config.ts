import fs from 'fs';
import path from 'path';
import { fileURLToPath, URL } from "url";
import { defineConfig } from 'vite';

/**
 * 监听指定文件变化，触发全局热更新
 */
const customHmr = () => {
    return {
        name: 'custom-hmr',
        configureServer(server) {
            const filesToWatch = [
                path.resolve(__dirname, 'public')
            ];
            filesToWatch.forEach((file) => {
                fs.watch(file, (_, filename) => {
                    if (filename) {
                        server.ws.send({
                            type: 'full-reload',          
                            path: '*'
                        });
                    }
                });
            });
        },
    }
}

export default defineConfig({
    plugins: [
        customHmr()
    ],
    resolve: {
        alias: [
            { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) },
        ]
    },
});
