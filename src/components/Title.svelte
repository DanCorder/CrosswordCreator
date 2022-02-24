<script lang="ts">
    export let title:string;
    export let author:string;
</script>

<div class="title-block only-print">
    {#if !!title}
        <h1>{title}</h1>
    {/if}
    {#if !!author}
        <h2>by {author}</h2>
    {/if}
</div>

<style lang="scss">
    :global(.only-print),
    :global(.only-print>*) {
        @media screen {
            display: none !important; // Yuck :(
        }
    }

    .title-block {
        margin-bottom: 20px;
    }

    h1 {
        text-align: center;
        font-size: 20px;
        margin-bottom: 5px;
    }
    h2 {
        text-align: center;
        font-size: 15px;
    }
</style>
