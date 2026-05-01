/**
 * MQTT Service (placeholder).
 * MQTT brokers require a long-lived process and a broker URL. To keep the
 * project safe to run without extra infra, this exposes a no-op publish/subscribe
 * API. To enable real MQTT, install `mqtt` and wire `client = mqtt.connect(url)`.
 */

const subscribers = new Map();

function publish(topic, payload) {
  console.log(`[mqtt:mock] publish ${topic}`, payload);
  const handlers = subscribers.get(topic) || [];
  handlers.forEach((h) => {
    try { h(payload); } catch (e) { console.error('[mqtt:mock] handler error', e); }
  });
}

function subscribe(topic, handler) {
  if (!subscribers.has(topic)) subscribers.set(topic, []);
  subscribers.get(topic).push(handler);
}

module.exports = { publish, subscribe };
