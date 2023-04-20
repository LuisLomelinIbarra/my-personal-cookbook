import { redirect } from "@sveltejs/kit";
    import {pb, currentUser} from "$lib/pocketbase";
    if(currentUser != undefined && pb.authStore.isValid){
        console.log("There is a token");

    }else{
        console.log("Go to Login");
        
        throw redirect(307,"/");
        console.log("Not redirecting");
    }