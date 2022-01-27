# Instrumentation workaround for Webpack based projects

## Background

Webpack bundles all the source code (including dependencies) into a single JS file. In Node.js module loading is usually done via CommonJS, meaning dependencies are loaded with `require` function (`require("express")`). OpenTelemetry currently only supports CommonJS as it injects itself into the `require` calls and modifies, intercepts loaded modules. With Webpack however these `require` calls are compiled out as all of the source code lives in a single bundle file and Webpack's internal module loading is used after copying the code. Thus OpenTelemetry (nor any other instrumentation SDKs) can instrument Webpack's internal modules.

## Workaround

To get tracing working via OpenTelemetry, we need to retain the `require` calls. This can be achieved via Webpack [externals](https://webpack.js.org/configuration/externals/) configuration option. When modules are loaded and it encounters a module in the `externals` listing, it won't copy paste its source code to the final bundle.

The downside is that the dependencies listed in externals now need to be available in node_modules, else `require` can't find them.

Say we are using `express` and want to instrument it via `@opentelemetry/instrumentation-express`, then the following needs to be added to `webpack.config.js`:
```js
  externalsType: "node-commonjs",
  externals: [
    "express"
  ]
```

Webpack will now load `express` via the usual `require` method.


See [`webpack.config.js`](./webpack.config.js) for a complete list.


P.S. When using instrumentations targetting Node.js internal libraries, such as `@opentelemetry/instrumentation-http`, `@opentelemetry/instrumentation-net`, `@opentelemetry/instrumentation-dns`, nothing needs to be added to `externals` as these libraries are required in the usual fashion.

## Running the example

```
npm install
npm run compile
npm run start

curl localhost:7000/foo
```

If you have collector running, you should now see spans from `http`, `dns`, `express` and `ioredis` instrumentations.
