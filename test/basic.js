const tap = require('tap')
const Tower = require('../lib/towerdb')

//const tdummy = Tower.createStore(function get(key,options){}, function set(key,val,options){})

const table = {}
const tmem = Tower.createStore({
	get: (key,options) => table[key],
	set: (key,val,options) => table[key] = val
})

const tower = new Tower()

tap.test("towerdb: use store", function (t) {
    t.plan(1)

	tower.use(tmem)
	t.ok(tower.stores.includes(tmem)) //=> world

})



tap.test("towerdb: no key no default", function (t) {
    t.plan(1)

	t.rejects(tower.get('hello')) //=> world
})


tap.test("towerdb: no key with static default value", function (t) {
    t.plan(1)

	tower.get('hello', {default:'world'}) //=> world
	.then(res=>{
		t.equal(res,'world')
	})
})

tap.test("towerdb: key with static default value", function (t) {
	t.plan(1)

	tower.get('hello') //=> world
	.then(res=>{
		t.equal(res,'world')
	})

})


tap.test("towerdb: dynamic default value", function (t) {
    t.plan(2)

	tower.get('hello:random', {
	    default: () => `world-${Math.random().toFixed(10) * Math.pow(10,10)}` //dynamic default value
	})

	.then(res => {
		t.match(res,/world-[0-9]{10}/)

		tower.get('hello:random')
		.then(res2 => {
			t.equal(res,res2)
		})
	})
})



tap.test("towerdb: promised value", function (t) {
    t.plan(2)

	function fetchWorld() {
	    return new Promise((resolve,reject) => {
			setTimeout(() => resolve('world'), 2000)
	       // fetch('example.com/api/world/1', (err,world) => !err ? resolve(world) : reject(err)})
	    })
	}

	tower.get('hello:promise', {default: fetchWorld }) //promise type supported
	.then(res => {
		t.equal(res,'world')

		tower.get('hello:promise')
		.then(res2 => {
			t.equal(res,res2)
		})

	})


})
