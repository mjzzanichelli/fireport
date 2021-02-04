#Fireport

##How it works

Starting from the default port or the highest candidate, *fireport* will attempt to find a new port available by adding 1 recursively, within a time limit 

##Usage

```js
import PortFinder from 'fireport';
PortFinder
  .get()
  .then(
//manage here the fullfillment
  )
```

```js
import PortFinder from 'fireport';
PortFinder
// attempt to find a port within 1s
  .timer(1000)
  .get()
  .then(...)
```

```js
import PortFinder from 'fireport';
PortFinder
// will attempt on declared candidates
  .get(8080,8081)
  .then(...)
```

##Default Values

* time: 10s
* port: 3000

