(function() {
  var foo = function(arg) { // core constructor
    // ensure to use the `new` operator
    if (!(this instanceof foo))
      return new foo(arg);
    // store an argument for this example
    this.myArg = arg;
    //..
  };

  // create `fn` alias to `prototype` property
  foo.fn = foo.prototype = {
    init: function () {/*...*/}
    //...
  };

  // expose the library
  window.foo = foo;
})();

// Extension:

foo.fn.myPlugin = function () {
  alert(this.myArg);
  return this; // return `this` for chainability
};

foo("bar").myPlugin(); // alerts "bar"