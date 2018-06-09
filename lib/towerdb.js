function Tower(...stores) {
  this.stores = stores
}

Tower.prototype.get = function(key, options = {}) {

  return new Promise(async (resolve, reject) => { //preserving 'this' context
    for (var i = 0; i < this.stores.length; i++) {
      let res = await this.stores[i].get(key)
      if (res !== undefined) {
        console.info(`[store-${i}]: Got it.`)
        resolve(res)

        //propagate up the stack to populate earlier stores
        for (j = i - 1; j >= 0; j--) {
          this.stores[j].set(key, res, options)
        }
        return
      }
    }

    //at this point, key was not found

    //if no options.default
    if (options.default === undefined) {
      reject(new Error("key not found in any stores, 3rd arg 'options.default' async function not specified"))
      return
    }

    //if options.default not function type, then it is the explicit value
    if (typeof options.default !== "function") {

      const val = options.default
      
      resolve(val)
      this.set(key,val,options)

      return
    }

    //at this point, options.default is a function that either:
    //1. returns the value
    //2. returns a promise that will resolve to the value


    //luckily 'await' handles this type fuzziness appropriately
    //if (defaulted instanceof Promise) - so this check is no needed

    const val = await options.default()

    //throw if res undefined here?

    resolve(val)
    this.set(key,val,options)

  })
}

Tower.prototype.set = function(key,val,options) {
    //propagate down the stack to populate all stores
  this.stores.forEach(store => {
    store.set(key, val, options)
  })

}

Tower.prototype.use = function(a) {
  //TODO: add other appropriate checks, like for dupes
  this.stores.push(a)
}

Tower.createStore = function(options) {
  if (options.get === undefined || options.set === undefined) {
    throw new Error("must specify 'get' and 'set' functions")
  }
  return options
}

module.exports = Tower
