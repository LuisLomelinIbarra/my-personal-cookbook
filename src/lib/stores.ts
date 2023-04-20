import { writable } from "svelte/store";
import { pb } from "./pocketbase";

export const menuList = writable({});
export const menuNames = writable();
export const shoppingList = writable({});
export const ingredientList = writable({});
export const recipeList = writable({});