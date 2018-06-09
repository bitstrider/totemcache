# 🗼 towerdb
[![towerdb](https://img.shields.io/npm/v/towerdb.svg)]()
[![towerdb](https://img.shields.io/node/v/towerdb.svg)]()
[![towerdb](https://img.shields.io/npm/l/towerdb.svg)]()

resiliently redundant storage stacks

## Quick Usage
```javascript
const Tower = require('towerdb')

//create a tower
const tower = new Tower()

//create a store from memory
const table = {}
const tmem = Tower.createStore({
	function get(key,options){
		return table[key]
	},
	function set(key,val,options){
		table[key] = val
	}
})

//add store to tower
tower.use(tmem)

async function demo() {
    await tower.get('hello', {default:'world'}) //=> world
    await tower.get('hello') //=> world

    //default option with sync function
    await tower.get('hello:random', {
        default: () => `world-${Math.random().toFixed(10) * Math.pow(10,10)}` //dynamic default value
    })

    await tower.get('hello:random') //=> world-0123456789

    //default option with a promise bearing function
    function fetchWorld() {
        return new Promise((resolve,reject) => {
            setTimeout(() => resolve('world'), 2000)
        })
    }

    await tower.get('hello:promise', {default: fetchWorld }) //=> world (after waiting 2 seconds)
    await tower.get('hello:promise') //=> world

}

demo()

```
