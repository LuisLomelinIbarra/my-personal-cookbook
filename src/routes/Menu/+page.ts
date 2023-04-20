import { redirect } from "@sveltejs/kit";
import {pb, currentUser} from "$lib/pocketbase";
import { menuList, menuNames } from "$lib/stores";
if(currentUser != undefined && pb.authStore.isValid){
    console.log("There is a token");

}else{
    console.log("Go to Login");
    
    throw redirect(307,"/");
    console.log("Not redirecting");
}
const record = await pb.collection('menu').getFullList();
menuList.set(record);
let menu_Names = record.map((menuEntry) => {return menuEntry.name})
console.log(menu_Names);
menuNames.set(menu_Names);
