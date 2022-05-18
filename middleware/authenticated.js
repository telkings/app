//If the user does not have a token, we send it to login
//si el usuario no tiene token lo enviamos a login
export default function({ store, redirect }) {
    
  store.dispatch("readToken"); // se utiliza para ejecutar una acción de la store

  if (!store.state.auth) {
    return redirect("/login");
  }

  if(store.state.auth.userData.lock!='0'){
    return redirect("/lock");  
  }
}
