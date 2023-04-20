<script lang="ts">
    import { currentUser, pb } from "./pocketbase";

    let username: string;
    let passcode: string;

    async function login() {
        await pb.collection('users').authWithPassword(username,passcode);

    }

    async function signup() {
        try{
            const data = {
                username,
                password:passcode,
                passwordConfirm:passcode,
                name: "Maddy"
            };
            const createdUser = await pb.collection('users').create(data);
            await login();
        }catch (err){
            console.log(err);
        }
    }
    function signout(){
        pb.authStore.clear();
    }
</script>
<div class="content-center place-content-center justify-center max-w-md max-w-md mx-auto flex flex-col items-center gap-10">
    {#if $currentUser && pb.authStore.isValid}
        <p class="place-content-center justify-center text-xl">Signed in as {$currentUser.username}</p>
    {:else}
        <h1 class="bold text-4xl text-grey-600 py-4"> Login/Signup</h1>
        <form on:submit|preventDefault class="content-center place-content-center justify-center max-w-md mx-auto flex flex-col items-center gap-4">
            <input class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Username"
            type="text"
            bind:value={username}/>
            <input class="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            placeholder="Password"
            type="password"
            bind:value={passcode}/>
            <div class="content-center place-content-center grid grid-cols-1 grid-rows-2 flex-auto items-center gap-3">
                <button on:click={signup} class="py-2 px-8 justify-center rounded-md border-rounded border-2 bg-emerald-300 hover:bg-emerald-500 hover:text-emerald-300">Sign Up</button>
                <button on:click={login} class="py-3 px-8 justify-center rounded-md border-1 bg-sky-300 hover:bg-sky-600 hover:text-sky-300">Return to Log In</button>
            </div>
            
        </form>
    {/if}
</div>
