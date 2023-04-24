<script>
	import CreateMenu from "./createMenu.svelte";
	import ShoppingList from "./shoppingList.svelte";
	import ShowMenu from "./showMenu.svelte";
	import { menuPage } from "$lib/stores";
	

    
</script>

<div class="p-10 content-center place-content-center justify-center max-w-md mx-auto flex flex-col items-center gap-10">
	
	{#if $menuPage == 1}
		<p>Menussss</p>
	{:else if $menuPage == 2}
		<ShoppingList></ShoppingList>
	{:else if $menuPage == 3}
		<CreateMenu></CreateMenu>
	{:else if $menuPage == 4}
		<ShowMenu></ShowMenu>
	{/if}
</div>



<style lang="postcss">
    :global(html) {
        background-color: theme(colors.gray.100);
    }
</style>