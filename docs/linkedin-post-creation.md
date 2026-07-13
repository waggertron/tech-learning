# LinkedIn post creation workflow

The `linkedin-post-creation` skill turns a published page, local draft, notes, or URL into a source-grounded LinkedIn post. It also prepares the share link and copies an approved draft to the clipboard when requested.

## Invoke the skill

Use prompts such as:

```text
Use $linkedin-post-creation to turn this page into a LinkedIn post: <url>
```

```text
Use $linkedin-post-creation to make this announcement shorter and copy the final draft to my clipboard.
```

## Workflow contract

The skill:

1. Reads the source before drafting.
2. Selects one practical angle instead of summarizing every section.
3. Writes a concise post with a hook, source link, and restrained hashtags.
4. Checks current LinkedIn behavior against official help when exact interface details matter.
5. Provides posting steps or a convenience share URL when requested.
6. Uses the system clipboard only after an explicit request.

The draft stays in plain text for clean pasting into LinkedIn. Clipboard output excludes Markdown quote markers and surrounding instructions.

## Maintenance

Keep the workflow in `.agents/skills/linkedin-post-creation/SKILL.md`. Update its `agents/openai.yaml` metadata when the trigger or default prompt changes. Validate structural changes with the skill creator's `quick_validate.py` script, then run `npm run build`.
