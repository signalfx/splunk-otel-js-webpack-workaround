# Instrumentation workaround for Webpack 5 based projects

Webpack bundles all the source code, including dependencies, into a single JS file. Node.js usually loads modules through CommonJS, which means that dependencies are loaded using `require` functions (for example, `require("express")`). OpenTelemetry only supports CommonJS, as it injects itself into the `require` calls and intercepts loaded modules. With Webpack, `require` calls are compiled out, as all of the source code lives in a single bundle file and Webpack's internal module loading is used after copying the code. Thus OpenTelemetry, nor any other instrumentation SDKs, cannot instrument Webpack's internal modules.

> The workaround for Webpack 4 is located [here](https://github.com/signalfx/splunk-otel-js-webpack-workaround/tree/webpack4).

## Workaround

To get tracing to work using OpenTelemetry, you need to retain the `require` calls. You can do this using Webpack's [externals](https://webpack.js.org/configuration/externals/) configuration option. When modules are loaded and Webpack encounters a module in the `externals` list, it won't copies and pastes the source code to the final bundle file. Dependencies listed in externals need to be available in `node_modules` for `require` to find them.

Consider we are using `express` and want to instrument it using `@opentelemetry/instrumentation-express`. You'd need to add the following to `webpack.config.js`:

```js
  externalsType: "node-commonjs",
  externals: [
    "express"
  ]
```

Webpack will now load `express` using the `require` method.

See [`webpack.config.js`](./webpack.config.js) for a complete list.

> **Note**: When using instrumentations targeting Node.js code modules, such as `http`, `net`, and `dns`, you don't need to add them to `externals`.

## Running the example

```
npm install
npm run compile
npm run start

curl localhost:7000/foo
```

If you have the Splunk OpenTelemetry Collector running, you should now see spans from `http`, `dns`, `express`, and `ioredis` instrumentations.
