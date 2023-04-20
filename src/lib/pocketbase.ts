import PocketBase from 'pocketbase';
import { PUBLIC_DATABASE_URL } from '$env/static/public'
import { writable } from 'svelte/store';
import { goto } from '$app/navigation';


export const pb = new PocketBase(PUBLIC_DATABASE_URL); // remote
// const pb = new PocketBase('http://127.0.0.1:8090'); // local

export const currentUser = writable(pb.authStore.model);

pb.authStore.onChange((auth) => {
    console.log('authStore changed', auth);
    currentUser.set(pb.authStore.model);
    if(pb.authStore.token){
        console.log("Auth says there is token");
    }else{
        console.log("Return to Login");
        goto("/");
    }

    if(currentUser){
        console.log("Non Empty User");
    }else{
        console.log("Return to Login");
        goto("/");
    }
});