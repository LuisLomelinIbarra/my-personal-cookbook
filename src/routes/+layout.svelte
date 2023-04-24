<script>
	import { goto } from "$app/navigation";
    import { menuPage } from "$lib/stores";
	
    import "../app.css";
    import { currentUser, pb } from "../lib/pocketbase";
    function signout(){
        pb.authStore.clear();
        goto("/")
        
    }
    
    /**
	 * @type {string}
	 */
    let avatarUrl;
    if(pb.authStore.model?.avatar){
        avatarUrl = pb.getFileUrl($currentUser, pb.authStore.model?.avatar) 
    }else{
        
        avatarUrl = `https://api.dicebear.com/6.x/big-smile/svg?seed=${pb.authStore.model?.id}&rotate=10&backgroundType=solid,gradientLinear&backgroundRotation=0,360,-340,-320,-300,-30&backgroundColor=b6e3f4,d1d4f9,ffdfbf`
        console.log(avatarUrl)
    }
    

    /**
	 * @type {any}
	 */
    let menuDropdownTag;

    let menuDropdown = false;
    
    function resetDropdowns(){
        menuDropdown = false;
    }
</script>

<div class="w-full h-screen flex flex-col gap-y-10">
    {#if $currentUser && pb.authStore.isValid}
    <div class="w-full scroll-py-10">
        <nav class="bg-emerald-100 rounded-b-full border-1 border-emerald-700 flex flex-row items-center justify-center place-content-stretch p-5 lg:px-8 gap-12" aria-label="Global">
            
                
                        <img width="64" height="64" src={avatarUrl} alt="avatar" class="space-x-10 rounded-full hover:border-black border-gray-50 shadow-lg border-3">
                    
                        <a href="/" class=" shadow-sm rounded-lg text-gray-700 p-3 px-5 block hover:bg-emerald-400 hover:text-emerald-100 ">Home</a>
                        <div class="relative inline-block text-left place-content-center">
                            <button on:click={()=>{menuDropdown = !menuDropdown; menuDropdownTag.focus()}} type="button" class="shadow-sm  rounded-lg p-3 px-5 block hover:bg-emerald-500 hover:text-emerald-100 " id="menu-button" aria-expanded="true" aria-haspopup="true" aria-hidden="true">
                                Menu
                            </button>
                            <div tabindex="-1" bind:this={menuDropdownTag} on:focusout={()=>{menuDropdown = false; }}>
                                {#if menuDropdown}
                            <div class="absolute z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                                <div class="py-1" role="none">
                                    <!-- Active: "bg-gray-100 text-gray-900", Not Active: "text-gray-700" -->
                                    <a href="/Menu" on:click={()=>{$menuPage=2; resetDropdowns();}} on:focusout={resetDropdowns} class="text-gray-700 block px-4 py-2 text-sm">Go to Shopping List</a>
                                    <a href="/Menu" on:click={()=>{$menuPage=3;resetDropdowns();}} on:focusout={resetDropdowns} class="text-gray-700 block px-4 py-2 text-sm">Create a Menu</a>
                                    <a href="/Menu" on:click={()=>{$menuPage=4;resetDropdowns();}} on:focusout={resetDropdowns} class="text-gray-700 block px-4 py-2 text-sm">Check a Menu</a>
                                    
                                </div>
                            </div>
                            {/if}
                            </div>
                            
                        </div>
                        
                        <a href="/Recipe" class="shadow-sm  rounded-lg p-3 px-5 block hover:bg-emerald-400 hover:text-emerald-100 ">Recipes</a>
                        <a href="/Ingredients" class="shadow-sm rounded-lg p-3 px-5 block hover:bg-emerald-500 hover:text-emerald-100 " >Ingredients</a>
                        <button on:click={signout} class="shadow-sm space-x-5 hover:bg-emerald-600 hover:text-emerald-100 hover:border-emerald-200 inline-flex items-center justify-center rounded-md p-2.5  border-2 border-emerald-500 text-emerald-700"> LogOut </button>
                        
                    
                
                
            
        </nav>
    </div> 
    {/if}
    <div class="flex place-content-center justify-center items-center h-max gap-10">
        <slot />
    </div>
</div>

<!-- <div class="h-full"> -->

