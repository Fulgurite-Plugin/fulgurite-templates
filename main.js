"use strict";
var __plugin = (() => {
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // src/main.ts
  var main_exports = {};
  __export(main_exports, {
    default: () => main_default
  });
  var plugin = {
    onLoad(ctx) {
      ctx.settings.define([
        { key: "workspace", name: "Template workspace", description: "Every note in this workspace is a template", type: "text", default: "Templates", placeholder: "Templates" },
        { key: "dateFormat", name: "Date format", description: "For {{date}}: YYYY-MM-DD, dddd, MMM D, \u2026 Text in [brackets] stays as it is.", type: "text", default: "YYYY-MM-DD", placeholder: "YYYY-MM-DD" },
        { key: "timeFormat", name: "Time format", description: "For {{time}}: HH:mm, h:mm A, \u2026", type: "text", default: "HH:mm", placeholder: "HH:mm" }
      ]);
      const insert = (view, text) => {
        const [start, end] = view.selection ?? [view.cursor, view.cursor];
        view.replace(start, end, text);
      };
      ctx.commands.add({
        id: "insert",
        name: "Insert template",
        editorCallback() {
          const templates = ctx.templates.list();
          const workspace = String(ctx.settings.values().workspace || "Templates");
          if (!templates) {
            ctx.notice(`Make a workspace named ${workspace} and put your templates in it`);
            return;
          }
          if (templates.length === 0) {
            ctx.notice(`${workspace} has no notes yet: each note there is a template`);
            return;
          }
          const items = templates.map((t) => ({ id: t.id, label: t.title || "Untitled", detail: t.body.split("\n").find((l) => l.trim()) ?? "" }));
          ctx.ui.suggest({ placeholder: "Insert a template", items }, (id, view) => {
            const template = ctx.notes.get(id);
            if (template) insert(view, ctx.templates.fill(template.body, { title: ctx.notes.current()?.title ?? "" }));
          });
        }
      });
      ctx.commands.add({ id: "insert-date", name: "Insert current date", editorCallback: (view) => insert(view, ctx.templates.fill("{{date}}")) });
      ctx.commands.add({ id: "insert-time", name: "Insert current time", editorCallback: (view) => insert(view, ctx.templates.fill("{{time}}")) });
    }
  };
  var main_default = plugin;
  return __toCommonJS(main_exports);
})();
