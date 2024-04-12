<script setup lang="ts">
import { ref } from "vue";
import HelloWorld from "./components/HelloWorld.vue";
import { useNative } from "./native/use-native";
const { setTitle, openFile, onUpdateCounter, counterValue } = useNative();

const title = ref<string>("");
const updateTitle = () => {
    setTitle(title.value);
};
const getFilePath = async () => {
    console.log(await openFile());
};
onUpdateCounter((value: number) => {
    console.log(value);
    counterValue(value);
});
</script>

<template>
    <div>
        <a href="https://vitejs.dev" target="_blank">
            <img src="/vite.svg" class="logo" alt="Vite logo" />
        </a>
        <a href="https://vuejs.org/" target="_blank">
            <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
        </a>
    </div>
    <HelloWorld msg="Vite + Vue" />
    <input type="text" v-model="title" />
    <button type="button" @click="updateTitle">IPC更新标题</button>
    <div>
        <button type="button" @click="getFilePath">打开文件</button>
    </div>
</template>

<style scoped>
.logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
}
.logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
