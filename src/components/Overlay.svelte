<script lang="ts">
    let visible = false;

    function visibilityToggle() {
        visible = !visible;
    }
</script>

<span class="link" on:click={visibilityToggle}>
    <slot name="linkText">Open</slot>
</span>
{#if visible}
<div class="overlay">
    <div class="content-block">
        <p class="link close" on:click={visibilityToggle}>Close</p>
        <slot name="content">Hello World!</slot>
    </div>
</div>
{/if}

<style lang="scss">
    .overlay {
        position: fixed;
        width: 100%;
        height: 100%;
        display: flex;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: rgba(0,0,0,0.5);
        z-index: 10;
    }
    .content-block {
        width: 100%;
        margin: 30px;
        overflow-y: scroll;
    }
    .link {
        text-decoration: underline;
        cursor: pointer;
    }
    .close {
        text-align: right;
    }
</style>