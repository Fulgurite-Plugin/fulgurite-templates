# Templates

Templates for [Fulgurite](https://github.com/Fulgurite-Plugin), like Obsidian's core plugin: every note in your
Templates workspace is a template. **Insert template** (⌘P) picks one and inserts it at the cursor with its variables
filled in:

- `{{title}}`: the current note's title
- `{{date}}` `{{time}}`, or with a format: `{{date:dddd, MMM D}}` `{{time:h:mm A}}` (moment tokens)
- `{{"a prompt"}}` stays as written: AI fills those (the app's MCP tool `create_note_from_template`)

Also **Insert current date** and **Insert current time**.

Options: the template workspace (`Templates`), the date format (`YYYY-MM-DD`) and the time format (`HH:mm`). The app's
MCP tools read the same options.

## Development

See [api](https://github.com/Fulgurite-Plugin/api).
