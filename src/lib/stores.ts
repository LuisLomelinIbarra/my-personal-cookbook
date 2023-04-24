import { writable } from "svelte/store";
import { pb } from "./pocketbase";

export const menuList = writable({});
export const menuNames = writable();
export const ingredientList = writable({});
export const recipeList = writable({});
export const menuPage = writable(1);



/*
export let currentShoppingList:any;

if(browser){
    let readlocalstorage:any;
    if (localStorage.getItem("shoppingList") == null){
        readlocalstorage = {};
    }else{
        readlocalstorage = JSON.parse(localStorage.getItem("shoppingList"));
    }

    currentShoppingList = writable(readlocalstorage);
    currentShoppingList.subscribe((value: any)=>{localStorage.shoppingList = JSON.stringify(value)})
}
*/
/*
interface User {
    email: string
    username: string
}

export const enabled = writable<User>(JSON.parse(localStorage.getItem('user')))

enabled.subscribe((value) => localStorage.user = JSON.stringify(value))
*/