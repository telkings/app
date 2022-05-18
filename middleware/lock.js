export default function({ store, redirect }) {
    
    store.dispatch("readToken"); // se utiliza para ejecutar una acción de la store
  
    if (!store.state.auth) {
      return redirect("/login");
    }
    
  }