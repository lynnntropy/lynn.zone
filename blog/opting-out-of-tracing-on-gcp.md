---
title: '"Opting Out" of Tracing Headers on Google Cloud Platform'
date: 2022-08-09
---

If you’re using [Google Cloud Run](https://cloud.google.com/run) (and, from what I understand, this also applies to [Google Cloud Functions](https://cloud.google.com/functions) and [Google App Engine standard](https://cloud.google.com/appengine)), Google [will automatically create a trace](https://cloud.google.com/run/docs/trace) in [Cloud Trace](https://cloud.google.com/trace) for each incoming request, and inject the trace context into the request via the [standard](https://www.w3.org/TR/trace-context/) `traceparent` HTTP header.

This is a cool feature… if you _want_ to use Cloud Trace. If you want to send telemetry to a different vendor, though, like [Honeycomb](https://www.honeycomb.io/), this is going to be a problem, because if your app is set up to pick up the trace context from the incoming request’s headers, your telemetry will contain references to "missing" root spans that only exist in Cloud Trace.

In Honeycomb, that'll look something like this, and will prevent a lot of queries from working properly:

![A screenshot of Honeycomb, showing a trace with a missing root span, and the following warning: "The root span of this trace is missing. There may be other spans missing, and the waterfall might render incorrectly. Expand the time range of the query and try again?"](@/assets/blog/opting-out-of-tracing-on-gcp/images/missing-root-span.png)

In my Node.js services, instrumented using [OpenTelemetry](https://opentelemetry.io/) and its included Node.js auto-instrumentations, I "fixed" this issue by using the hooks provided by the HTTP instrumentation to discard any headers Cloud Tracing might be setting before the incoming request gets processed into a span. You can do this by replacing your call to `getNodeAutoInstrumentations()` with this code:

```ts
getNodeAutoInstrumentations({
  '@opentelemetry/instrumentation-http': {
    startIncomingSpanHook: (req) => {
      delete req.headers.traceparent;
      delete req.headers[`x-cloud-trace-context`];
      delete req.headers[`grpc-trace-bin`];

      return {};
    },
  },
}),
```

(If you're setting up `@opentelemetry/instrumentation-http` separately, you can pass the same config object to the `HttpInstrumentation` constructor.)

This is, unfortunately, clearly a hack, but also the least painful way I could find of getting around this issue. Other potential solutions I considered were:

- **Disable Cloud Trace** -- You can't outright disable Cloud Trace for a project without also disabling a bunch of other services that depend on it, and I’m not sure if doing that would even actually prevent this behavior.
- **Use a reverse proxy to strip the headers** -- On Cloud Run, you could theoretically solve this by adding some kind of reverse proxy to your container, and configuring it to strip these headers before they make it to your app. This would (in my opinion, anyway) be a massively overengineered solution, though, and also negatively impact your app's startup time, which is especially important in a serverless context.

Please let me know if you've also run into this and figured out a better way of getting around it!

---

**Update:** Thanks to Andreas for the suggestion of using [B3 Propagation](https://github.com/openzipkin/b3-propagation) as another potential solution!

B3 Propagation is a [natively-supported](https://opentelemetry.io/docs/reference/specification/context/api-propagators/#propagators-distribution) method for trace context propagation by OpenTelemetry, but _not_ by GCP, so configuring OpenTelemetry to use B3 Propagation rather than the W3C Trace Context spec is a convenient, robust and non-hacky way to make sure GCP won't mess with your telemetry.

The main drawback to this method is that you may not be able to do this if you, for example, need to interface with other systems that expect W3C Trace Context headers rather than B3 headers. It's also possible (but, in fairness, probably not super likely) that GCP will introduce support for B3 Propagation in the future, which would potentially break this solution.

I also personally have a bit of philosophical issue with perpetuating the status quo of there being multiple competing standards for doing the same thing, but realistically, even if you're like me and agree that there should really be _one_ standard for this, there isn't really much harm being done by using a feature that OpenTelemetry has already committed to supporting for the foreseeable future.

On a final note, if B3 Propagation doesn't work for you for whatever reason, everything I've said here theoretically holds true for any propagation standard natively supported by OpenTelemetry that _isn't_ W3C Trace Context, which (at time of writing), in addition to B3 Propagation, also includes [W3C Baggage](https://w3c.github.io/baggage/) and the [Jaeger propagation format](https://www.jaegertracing.io/docs/1.38/client-libraries/#propagation-format).
