<script lang="ts">
    export let result: string;

    const dictionaryUrlPrefix = 'https://www.dictionary.com/browse/';
</script>

<div>
    <a href="{dictionaryUrlPrefix}{result}" target="_blank">{result}</a>
</div>

<style lang="scss">
    div {
        display: flex;
        flex-direction: row;
        margin-top: 0.5em;
    }
</style>