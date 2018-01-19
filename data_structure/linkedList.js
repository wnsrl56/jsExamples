const Graph = (function() {
    
    const Vertex = function(key) {
        this.next = null;
        this.arc = null;
        this.key = key;
    };

    const Arc = function(data, dest, capacity) {
        this.nextArc = null;
        this.destination = dest;
        this.data = data;
        this.capacity = capacity;
    };

    this.constructor = function() {
        this.count = 0;
        this.first = null;
    };

    this.insertVertex = function(key) {
        const vertex = new Vertex(key);
        const last = this.first;
        if (last) {
            while (last.next != null) {
                last = last.next;
            }

            last.next = vertex;
        }  else {
            this.first = vertex;
        }

        this.count++;
    };


    this.deleteVertex = function(key) {

    };

    this.insertArc = function(data, fromKey, toKey, capacity) {

    };

    this.deleteArc = function(fromKey, toKey) {

    };
})();

(function main(){

    var graph = new Graph();
    graph.insertVertex('A');

    console.log(graph);

})();