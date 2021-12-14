<script lang="ts">
    export let result: string;
    const dictionaryUrlPrefix = 'https://www.dictionary.com/browse/';
</script>

<div>
    <a href="{dictionaryUrlPrefix}{result}" target="_blank">{result}</a>
</div>