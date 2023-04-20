<script>
	import { goto } from "$app/navigation";
    import "../app.css";
    import { currentUser, pb } from "../lib/pocketbase";
    function signout(){
        pb.authStore.clear();
        goto("/")
        
    }

    
</script>
{#if $currentUser && pb.authStore.isValid}
<div class="h-full">
<aside class="bg-emerald-200 fixed h-full flex flex-col items-center justify-center p-10 lg:px-8" aria-label="Global">
    
        <ul class="border-spacing-2 flex flex-col items-center gap-2">
            
            
                <li><a href="/" class="rounded-lg text-gray-700 p-3 px-5 block hover:bg-emerald-400 hover:text-emerald-100 w-full">Home</a></li>
                <li><a href="/Menu" class="rounded-lg p-3 px-5 block hover:bg-emerald-500 hover:text-emerald-100 w-full">Menus</a></li>
                <li><a href="/Recipe" class="rounded-lg p-3 px-5 block hover:bg-emerald-400 hover:text-emerald-100 w-full">Recipes</a></li>
                <li><a href="/Ingredients" class="rounded-lg p-3 px-5 block hover:bg-emerald-500 hover:text-emerald-100 w-full" >Ingredients</a></li>
                <li><button on:click={signout} class="hover:bg-emerald-600 hover:text-emerald-100 hover:border-emerald-200 inline-flex items-center justify-center rounded-md p-2.5  border-2 border-emerald-500 text-emerald-700"> LogOut </button></li>
                
            
        </ul>
        
    
</aside>
</div> 
{/if}
<div class="flex items-center p-12">
    <slot />
</div>
