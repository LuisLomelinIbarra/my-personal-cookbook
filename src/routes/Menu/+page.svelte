<script>
	import {menuList, menuNames} from "$lib/stores"
    let knownMenu;
    menuList.subscribe((value) =>{
        knownMenu = value
    })
    let knownNames;
    menuNames.subscribe((value)=>{
        knownNames=value
    })
    
    /**
	 * @type {any}
	 */
    let selectedMenu;
</script>
<div class="content-center place-content-center justify-center max-w-md max-w-md mx-auto flex flex-col items-center gap-10">
    <h1 class="text-xl">Menu</h1>
    <div class="content-center place-content-center justify-center mx-auto flex flex-row gap-4">
        <div class="content-center place-content-center justify-center mx-auto flex flex-col gap-4">
            <p class="texl-md"> 
                Select a menu to display a recipe
            </p>
            <select bind:value={selectedMenu} on:change={()=>{console.log(selectedMenu)}}>
                <option disabled selected>A Menu</option>
                {#each $menuList as menuItem}
                    <option value={menuItem.id}> {menuItem.name}</option>
                {/each}
            </select>
        </div>
        <div class="content-center place-content-center justify-center mx-auto flex flex-col gap-4">
            <div class="max-w-sm rounded overflow-hidden shadow-lg space-y-2 bg-gray-300 h-full">
                <div class="font-bold text-xl mb-2 p-4">Menu Shopping list</div>
                <ul class="text-md p-6">
                    <li>More</li>
                    <li>Somthing</li>
                </ul>
            </div>
        </div>
        <div class="content-center place-content-center justify-center mx-auto flex flex-col gap-4 ">
            <div class="max-w-sm rounded overflow-hidden shadow-lg space-y-2 bg-gray-300 h-full">
                <div class="font-bold text-xl mb-2 p-4">Bought</div>
                <ul class="text-md p-6">
                    <li>More</li>
                    <li>Somthing</li>
                </ul>
            </div>
        </div>
    </div>

</div>

<style lang="postcss">
    :global(html) {
        background-color: theme(colors.gray.100);
    }
</style>