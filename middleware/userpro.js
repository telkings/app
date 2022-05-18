export default function({ store, redirect }) {
    
    store.dispatch("readToken"); // se utiliza para ejecutar una acción de la store
  
    if (!store.state.auth) {
      return redirect("/login");
    }

    if(store.state.auth.userData.type!='1'){
        return redirect("/dashboard");  
    }

    if(store.state.auth.userData.lock!='0'){
      return redirect("/lock");  
    }
  }