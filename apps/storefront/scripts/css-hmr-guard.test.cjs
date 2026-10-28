const { test } = require("node:test")
const assert = require("node:assert/strict")
const { readFileSync } = require("node:fs")
const vm = require("node:vm")
const guard = require("./css-hmr-guard-loader.cjs")
const original = readFileSync(require.resolve("next/dist/compiled/mini-css-extract-plugin/hmr/hotModuleReplacement.js"), "utf8")

function fixture(source) {
  let callback
  let removals = 0
  const events = {}
  const clone = { addEventListener: (name, fn) => { events[name] = fn } }
  const parent = {
    appendChild() {},
    removeChild(node) { removals++; node.parentNode = null },
  }
  const oldLink = { href: "http://localhost:8000/main.css", parentNode: parent, cloneNode: () => clone }
  const context = {
    module: { exports: {} }, __dirname: "/fixture",
    document: { currentScript: { src: "http://localhost:8000/main.js" }, querySelectorAll: () => [oldLink] },
    console: { log() {} }, setTimeout: (fn) => { callback = fn }, clearTimeout() {},
  }
  vm.runInNewContext(source, context)
  context.module.exports("test", { locals: true })()
  callback()
  return { oldLink, events, removals: () => removals }
}

test("reproduces installed helper's detached stylesheet error", () => {
  const f = fixture(original)
  f.oldLink.parentNode = null
  assert.throws(() => f.events.load(), /removeChild/)
})
for (const event of ["load", "error"]) {
  test(`detached stylesheet is safe on ${event}`, () => {
    const f = fixture(guard(original))
    f.oldLink.parentNode = null
    assert.doesNotThrow(() => f.events[event]())
    assert.equal(f.removals(), 0)
  })
}
test("connected stylesheet is removed once even with repeated events", () => {
  const f = fixture(guard(original))
  f.events.load()
  f.events.error()
  assert.equal(f.removals(), 1)
})
