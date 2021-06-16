export const Storage = {
    
    load(name) {
       return JSON.parse(localStorage.getItem(name)) 
    },

    save(name, obj) {
        const parsed = JSON.stringify(obj);
        localStorage.setItem(name, parsed);
    },

    delete(name) {
        localStorage.removeItem(name)
    }

}