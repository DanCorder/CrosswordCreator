<script lang="ts">
    export let title:string;
    export let author:string;
</script>

<div>
    <lable>Title: <input bind:value={title} /></lable>
    <lable>Author: <input bind:value={author} /></lable>
</div>
