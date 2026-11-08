import { readFileSync, existsSync } from "node:fs";
import { JSDOM } from "jsdom";
import postcss from "postcss";
import assert from "node:assert/strict";
const html = readFileSync(new URL("../index.html", import.meta.url), "utf8");
const dom = new JSDOM(html);
const { document } = dom.window;
const ids = [...document.querySelectorAll("[id]")].map((n) => n.id);
assert.equal(new Set(ids).size, ids.length, "Duplicate HTML IDs");
for (const element of document.querySelectorAll("[src],link[href]")) {
  const path = element.getAttribute("src") || element.getAttribute("href");
  if (!path.startsWith("http"))
    assert.ok(existsSync(new URL("../" + path, import.meta.url)), path);
}
assert.deepEqual(
  [...document.scripts].map((n) => n.getAttribute("src")),
  ["ui.js", "app.js", "calendar.js", "support.js", "planner.js"],
);
assert.equal(document.querySelectorAll(".ru-mark,.en-mark").length, 0);
assert.ok(
  readFileSync(new URL("../favicon.svg", import.meta.url), "utf8").includes(
    "M35 11H20",
  ),
);
const css = postcss.parse(
  readFileSync(new URL("../style.css", import.meta.url), "utf8"),
);
css.walkComments(() => assert.fail("Unnecessary CSS comments"));
css.walkRules((rule) => {
  const properties = new Set();
  rule.walkDecls((decl) => {
    assert.ok(
      !properties.has(decl.prop),
      "Repeated " + decl.prop + " in " + rule.selector,
    );
    properties.add(decl.prop);
  });
});
assert.ok(
  css.nodes.some(
    (node) =>
      node.type === "atrule" &&
      node.name === "media" &&
      node.params.includes("prefers-reduced-motion"),
  ),
);
dom.window.close();
console.log(
  "Structure passed: unique IDs, local assets, script order, S branding, CSS syntax, no repeated declarations inside blocks, reduced motion.",
);
