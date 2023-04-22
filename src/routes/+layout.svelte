<script>
	import { goto } from "$app/navigation";
    import "../app.css";
    import { currentUser, pb } from "../lib/pocketbase";
    function signout(){
        pb.authStore.clear();
        goto("/")
        
    }

    
</script>

<div class="w-full flex flex-col">
    {#if $currentUser && pb.authStore.isValid}
    <div class="w-full">
        <nav class="bg-emerald-100 flex flex-row items-center justify-center p-5 lg:px-8 gap-10" aria-label="Global">
            
                
                    
                    
                        <a href="/" class="rounded-lg text-gray-700 p-3 px-5 block hover:bg-emerald-400 hover:text-emerald-100 ">Home</a>
                        <a href="/Menu" class="rounded-lg p-3 px-5 block hover:bg-emerald-500 hover:text-emerald-100 ">Menus</a>
                        <a href="/Recipe" class="rounded-lg p-3 px-5 block hover:bg-emerald-400 hover:text-emerald-100 ">Recipes</a>
                        <a href="/Ingredients" class="rounded-lg p-3 px-5 block hover:bg-emerald-500 hover:text-emerald-100 " >Ingredients</a>
                        <button on:click={signout} class="space-x-5 hover:bg-emerald-600 hover:text-emerald-100 hover:border-emerald-200 inline-flex items-center justify-center rounded-md p-2.5  border-2 border-emerald-500 text-emerald-700"> LogOut </button>
                        
                    
                
                
            
        </nav>
    </div> 
    {/if}
    <div class="flex items-center p-12">
        <slot />
    </div>
</div>

<!-- <div class="h-full"> -->

