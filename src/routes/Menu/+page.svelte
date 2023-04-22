<script>
	import {menuList, menuNames, shoppingList} from "$lib/stores"
    import { pb, currentUser } from "$lib/pocketbase"
	import { onMount } from "svelte";
    import { get } from "svelte/store";
    import pluscircle from "$lib/assets/svgs/plus-circle.svg"
    import { fade, scale, slide } from 'svelte/transition'

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

    /**
	 * @type {any}
	 */
    let sList;
    let listRecordId;
    onMount(async ()=>{

        console.log("On Mount Start");
        
        // Checar si había alguna lista guardada
        const slist = await pb.collection('tempInfo').getList(1,1,{filter:`user='${get(currentUser).id}'`})
        
        if(slist.items.length == 0){
            const tempRec = await pb.collection('tempInfo').create({'user':get(currentUser).id, 'list_data':{}})
            listRecordId = tempRec.id
            console.log("No record found")
            
        }else{
            
            listRecordId = slist.items[0].id
            sList = slist.items[0].list_data.slist;
            selectedMenu = slist.items[0].list_data.id

            console.log(slist.items[0].list_data.slist);
        }

    });
    
    

    let defaultText = false;
    let ingredientList = Promise.resolve({});
    async function fetchIngredients(){
        const recipies = await pb.collection('menu_recipe').getFullList({
            filter: `menu="${selectedMenu}"`,
        });
        //console.log(recipies);
        let ingredient_filter = ``;
        let rec_qty = {};
        recipies.forEach(recipe => {
            ingredient_filter += `recipe="${recipe.recipe}" ||`
            if(!rec_qty.hasOwnProperty(recipe.recipe)){
                // @ts-ignore
                rec_qty[recipe.recipe] = recipe.recipe_qty;
            }
        });
        ingredient_filter = ingredient_filter.substring(0, ingredient_filter.length - 3);
        const ingredients = await pb.collection('recipe_ingredient').getFullList({
            filter: ingredient_filter,
            expand: 'ingredient,recipe'
        });

        /*
        {
            id : 
            {
                name : "Ingredient name"
                recipies:
                [
                    {
                        r_name : "Recipe Name",
                        r_qty_to_make: 1,
                        units: x,
                        qty_needed: y
                    }, ...
                ]
            }
        }
        */
        let newIngredientList = {};
        
        ingredients.forEach((ing)=>{
            // @ts-ignore
            if(newIngredientList.hasOwnProperty(ing.expand.ingredient.id)){
                //console.log(newIngredientList[ing.expand.ingredient.id]);
                // @ts-ignore
                newIngredientList[ing.expand.ingredient.id].recipes.push({recipeName: ing.expand.recipe.name, recipieQtyToMake: rec_qty[ing.expand.recipe.id], quantity:ing.quantity ,units: ing.unit  })
            }else{
                // @ts-ignore
                newIngredientList[ing.expand.ingredient.id] = {
                    // @ts-ignore
                    id : ing.expand.ingredient.id,
                    // @ts-ignore
                    name : ing.expand.ingredient.name,
                    // @ts-ignore
                    recipes: [{recipeName: ing.expand.recipe.name, recipieQtyToMake: rec_qty[ing.expand.recipe.id], quantity:ing.quantity ,units: ing.unit  }],
                    bought:false,
                    recipeVis:false
                }
            }
        })
        
        //console.log(newIngredientList);
        sList = Object.values(newIngredientList);
        
    }

    
    //Logic to manage the cards
    

	async function mark(shopListItem, got) {
        
		shopListItem.bought = got;
        
        sList.sort();
        sList = sList;
        let value = {slist:sList, id:selectedMenu}
        await pb.collection('tempInfo').update(listRecordId, {list_data:value});
        
        
	}

    async function recipeVisibility(shopListItem, visible) {
        
		shopListItem.recipeVis = visible;
        sList.sort();
        sList = sList;
        
        let value = {slist:sList, id:selectedMenu}
        await pb.collection('tempInfo').update(listRecordId, {list_data:value});
        
        
	}

    //Aux function to select the menu to check
    function handleSelection(){
        if(selectedMenu != undefined){
            ingredientList = fetchIngredients()
            defaultText = false;
        }
        
    }

    

</script>






<div class="content-center place-content-center justify-center max-w-md max-w-md mx-auto flex flex-col items-center gap-10">
    <h1 class="text-xl">Menu</h1>
    <div class="content-center place-content-center justify-center mx-auto max-w-md max-w-md flex flex-col gap-4">
        <p class="texl-md"> 
            Select a menu to display a recipe
        </p>
        <select bind:value={selectedMenu} on:change={handleSelection}>
            <option disabled selected value={undefined}>A Menu</option>
            
            {#each $menuList as menuItem}
                <option value={menuItem.id}> {menuItem.name}</option>
            {/each}
        </select>
    </div>
    <div class="content-center place-content-center justify-center mx-auto  max-w-md max-w-md flex flex-row gap-4 items-center">
        
        <!--Shopping list card-->
        <div class="content-center place-content-center justify-center mx-auto flex flex-col gap-4 h-full">
            <div class="max-w-sm rounded overflow-hidden shadow-lg space-y-2 bg-gray-300 h-full w-screen">
                <div class="font-bold text-xl mb-2 p-4 w-full">Menu Shopping list</div>
                
                {#if sList}
                    <ul class="text-md p-6 w-full gap-2 items-start flex flex-col place-content-evenly justify-between">
                        {#each sList.filter(t => !t.bought) as ingredient (ingredient.id)}
                            <li in:fade|local out:scale|local class="bg-gray-200 p-2 rounded-md w-full flex flex-col items-start place-items-centered place-content-evenly justify-between justify-items-stretch gap-4">
                                
                                <div class="bg-gray-200 p-2 rounded-md w-full flex flex-row items-start place-items-centered place-content-evenly justify-between justify-items-stretch gap-4">
                                    <label class="grow flex flex-row items-center place-content-stretch gap-2 mx-auto"> 
                                        <input type=checkbox on:change={()=>mark(ingredient,true)}> 
                                        {ingredient.name}
                                        
                                    </label>
                                    <button on:click={recipeVisibility(ingredient,!ingredient.recipeVis)} class="flex place-self-end justify-self-end rounded-full bg-gray-300 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none"> <img src={pluscircle} alt="Plus Icon" class="object-cover" /></button>
                                    
                                </div>
                                
                                <div>
                                {#if ingredient.recipeVis}
                                
                                    <ul transition:slide|local>
                                        {#each ingredient.recipes as recipe}
                                        <li class="flex flex-row">{recipe.recipeName} needs {recipe.recipieQtyToMake * recipe.quantity} {recipe.units != "-" ? recipe.units:""} 
                                        </li>
                                        {/each}
                                    </ul>
                                
                                    
                                {/if}
                                </div>
                                
                            </li>
                        {/each}
                    </ul>
                {:else}
                    {#await ingredientList}
                        <ul class="text-md p-6">
                            <li>Select a Menu</li>
                        </ul>
                    {:then}
                    <ul class="text-md p-6 w-full gap-2 items-start flex flex-col place-content-evenly justify-between">
                        {#each sList.filter(t => !t.bought) as ingredient (ingredient.id)}
                        <li in:fade|local out:scale|local class="bg-gray-200 p-2 rounded-md w-full flex flex-col items-start place-items-centered place-content-evenly justify-between justify-items-stretch gap-4">
                                
                            <div class="bg-gray-200 p-2 rounded-md w-full flex flex-row items-start place-items-centered place-content-evenly justify-between justify-items-stretch gap-4">
                                <label class="grow flex flex-row items-center place-content-stretch gap-2 mx-auto"> 
                                    <input type=checkbox on:change={()=>mark(ingredient,true)}> 
                                    {ingredient.name}
                                    
                                </label>
                                <button on:click={recipeVisibility(ingredient,!ingredient.recipeVis)} class="flex place-self-end justify-self-end rounded-full bg-gray-300 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none"> <img src={pluscircle} alt="Plus Icon" class="object-cover" /></button>
                                
                            </div>
                            
                            
                            <div>
                                {#if ingredient.recipeVis}
                                
                                    <ul transition:slide|local>
                                        {#each ingredient.recipes as recipe}
                                        <li class="flex flex-row">{recipe.recipeName} needs {recipe.recipieQtyToMake * recipe.quantity} {recipe.units != "-" ? recipe.units:""} 
                                        </li>
                                        {/each}
                                    </ul>
                                
                                    
                                {/if}
                                </div>
                            
                        </li>
                        {/each}
                    </ul>
                    {:catch error}
                        <p class="text-red-800">An error has occurred: {error.message}</p>
                    {/await}
                {/if}
                
                
            </div>
        </div>
        <!-- Bought card -->
        <div class="content-center place-content-center justify-center mx-auto flex flex-col gap-4 h-full">
            <div class="max-w-sm rounded overflow-hidden shadow-lg space-y-2 bg-gray-300 h-full w-screen">
                <div class="font-bold text-xl mb-2 p-4 ">Bought</div>

                {#if sList}
                    <ul class="text-md p-6 w-full gap-2 items-start flex flex-col place-content-evenly justify-between">
                        {#each sList.filter(t => t.bought) as ingredient (ingredient.id)}
                                <li in:fade|local out:scale|local class="bg-gray-200 p-2 rounded-md w-full flex flex-col items-start place-items-centered place-content-evenly justify-between justify-items-stretch gap-4"> 
                                    <div class="bg-gray-200 p-2 rounded-md w-full flex flex-row items-start place-items-centered place-content-evenly justify-between justify-items-stretch gap-4">
                                        <label class="grow flex flex-row items-center place-content-stretch gap-2 mx-auto"> 
                                            <input checked type=checkbox on:change={()=>mark(ingredient,false)}> {ingredient.name}
                                        </label> 
                                        
                                        <button on:click={recipeVisibility(ingredient,!ingredient.recipeVis)} class="flex place-self-end justify-self-end rounded-full bg-gray-300 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none"> <img src={pluscircle} alt="Plus Icon" class="object-cover" /></button>
                                    </div>
                                    
                                    <div>
                                        {#if ingredient.recipeVis}
                                        
                                            <ul transition:slide|local>
                                                {#each ingredient.recipes as recipe}
                                                <li class="flex flex-row">{recipe.recipeName} needs {recipe.recipieQtyToMake * recipe.quantity} {recipe.units != "-" ? recipe.units:""} 
                                                </li>
                                                {/each}
                                            </ul>
                                        
                                            
                                        {/if}
                                    </div>

                                </li>
                        {/each}
                    </ul>
                {:else}
                    {#await ingredientList}
                        <ul class="text-md p-6">
                            <li> Select a Menu</li>
                        </ul>
                    {:then}
                    <ul class="text-md p-6 w-full gap-2 items-start flex flex-col place-content-evenly justify-between">
                        {#each sList.filter(t => t.bought) as ingredient (ingredient.id)}
                        <li in:fade|local out:scale|local class="bg-gray-200 p-2 rounded-md w-full flex flex-col items-start place-items-centered place-content-evenly justify-between justify-items-stretch gap-4"> 
                            <div class="bg-gray-200 p-2 rounded-md w-full flex flex-row items-start place-items-centered place-content-evenly justify-between justify-items-stretch gap-4">
                                <label class="grow flex flex-row items-center place-content-stretch gap-2 mx-auto"> 
                                    <input checked type=checkbox on:change={()=>mark(ingredient,false)}> {ingredient.name}
                                </label> 
                                
                                <button on:click={recipeVisibility(ingredient,!ingredient.recipeVis)} class="flex place-self-end justify-self-end rounded-full bg-gray-300 active:shadow-lg mouse shadow transition ease-in duration-200 focus:outline-none"> <img src={pluscircle} alt="Plus Icon" class="object-cover" /></button>
                            </div>
                            
                            <div>
                                {#if ingredient.recipeVis}
                                
                                    <ul transition:slide|local>
                                        {#each ingredient.recipes as recipe}
                                        <li class="flex flex-row">{recipe.recipeName} needs {recipe.recipieQtyToMake * recipe.quantity} {recipe.units != "-" ? recipe.units:""} 
                                        </li>
                                        {/each}
                                    </ul>
                                
                                    
                                {/if}
                            </div>

                        </li>
                        {/each}
                    </ul>
                    {:catch error}
                        <p class="text-red-800">An error has occurred: {error.message}</p>
                    {/await}
                {/if}
                
                

            </div>
        </div>
    </div>

</div>

<style lang="postcss">
    :global(html) {
        background-color: theme(colors.gray.100);
    }
</style>