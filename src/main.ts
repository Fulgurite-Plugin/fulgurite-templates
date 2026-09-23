// Templates, like Obsidian's core plugin: the notes in a Templates workspace are templates; "Insert template" picks one
// and inserts it at the cursor. The filling ({{title}}, {{date}}, {{time}}, {{date:FORMAT}}, …) is the app's engine
// (`ctx.templates`), the same one MCP agents use, so a template reads the same wherever it's used.
import type { EditorView, Plugin } from "fulgurite"

const plugin: Plugin = {
  onLoad(ctx) {
    // The core reads these too (template.rs `Settings`), with the same defaults.
    ctx.settings.define([
      { key: "workspace", name: "Template workspace", description: "Every note in this workspace is a template", type: "text", default: "Templates", placeholder: "Templates" },
      { key: "dateFormat", name: "Date format", description: "For {{date}}: YYYY-MM-DD, dddd, MMM D, … Text in [brackets] stays as it is.", type: "text", default: "YYYY-MM-DD", placeholder: "YYYY-MM-DD" },
      { key: "timeFormat", name: "Time format", description: "For {{time}}: HH:mm, h:mm A, …", type: "text", default: "HH:mm", placeholder: "HH:mm" },
    ])
    /** Replaces the selection, or inserts at the cursor. */
    const insert = (view: EditorView, text: string) => {
      const [start, end] = view.selection ?? [view.cursor, view.cursor]
      view.replace(start, end, text)
    }

    ctx.commands.add({
      id: "insert",
      name: "Insert template",
      editorCallback() {
        const templates = ctx.templates.list()
        const workspace = String(ctx.settings.values().workspace || "Templates")
        if (!templates) {
          ctx.notice(`Make a workspace named ${workspace} and put your templates in it`)
          return
        }
        if (templates.length === 0) {
          ctx.notice(`${workspace} has no notes yet: each note there is a template`)
          return
        }
        const items = templates.map((t) => ({ id: t.id, label: t.title || "Untitled", detail: t.body.split("\n").find((l) => l.trim()) ?? "" }))
        ctx.ui.suggest({ placeholder: "Insert a template", items }, (id, view) => {
          const template = ctx.notes.get(id)
          if (template) insert(view, ctx.templates.fill(template.body, { title: ctx.notes.current()?.title ?? "" }))
        })
      },
    })
    ctx.commands.add({ id: "insert-date", name: "Insert current date", editorCallback: (view) => insert(view, ctx.templates.fill("{{date}}")) })
    ctx.commands.add({ id: "insert-time", name: "Insert current time", editorCallback: (view) => insert(view, ctx.templates.fill("{{time}}")) })
  },
}

export default plugin
