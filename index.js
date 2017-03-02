import net from 'net';
import assign from 'object-assign';
import Promise from 'bluebird';

function getTime() {
  return (new Date()).getTime();
}

class PortFinder {
  constructor(config = {}) {
    assign(this, {
      candidates: config.candidates || [3000],
      time: config.time || 10000
    })
  }

  static get(...candidates) {
    return (new PortFinder()).get(...candidates);
  }

  static timer(time) {
    return (new PortFinder()).timer(time);
  }

  static check(port) {
    return new Promise((resolve, reject) => {
      var server = net.createServer()
      console.log(`trying port ${port}`)
      server.listen(port, err => {
        server.once('close', () => resolve(port))
        server.close()
      })
      server.on('error', reject)
    })
  }

  timer(time = this.time) {
    return assign(this, { time })
  }

  reset() {
    this.index = null;
    this.start = null;
    this.init = null
  }

  get(...candidates) {
    this.candidates = candidates.length ? candidates.map(port => parseInt(port)).sort() : this.candidates;
    if (this.init) return this.search(this.init.resolve, this.init.reject);
    return new Promise((resolve, reject) => {
      this.init = { resolve, reject };
      this.search(this.init.resolve, this.init.reject);
    })
  }

  search(resolve, reject) {
    this.start = this.start || getTime();
    if (getTime() - this.start > this.time) return reject(`timer end`)
    this.index = this.index || 0;
    this.port = this.index < this.candidates.length
      ? this.candidates[this.index]
      : this.port + 1;
    PortFinder.check(this.port).then(
      (port) => {
        console.log(`port ${port} found in ${getTime() - this.start}ms`)
        resolve(port);
        this.reset();
      },
      () => {
        this.index += 1;
        this.get();
      }
    )
  }
}

export default PortFinder;