---
name: linkedin-post-creation
description: "Turn published pages, drafts, notes, or URLs into source-grounded LinkedIn posts with a clear hook, concise body, working source link, relevant hashtags, and practical sharing instructions. Use when Codex needs to draft, revise, shorten, or prepare a LinkedIn post, announce newly published content, create a LinkedIn share link, check a link preview, or copy an approved post to the clipboard."
---

# LinkedIn post creation

Create a publishable LinkedIn post from the user's source material. Preserve the user's voice, keep claims tied to the source, and make the link easy to share.

## Workflow

### 1. Inspect the source

Use the most direct source available:

- Read supplied text directly.
- For a URL that maps to the current repository, locate and read the source page. Repository source is usually more complete than a scraped rendering.
- For an external page, open the URL and inspect the page before drafting. Browse when the page is not available locally.
- Verify current LinkedIn limits or interface behavior against official LinkedIn Help when the answer depends on them.

Do not draft from a title alone when the page content is available. Do not invent conclusions, examples, metrics, or reader benefits.

### 2. Choose one angle

Find the strongest idea for a professional audience. Favor one of these shapes:

- A counterintuitive conclusion.
- A practical decision rule.
- A mistake the source helps readers avoid.
- A useful model, checklist, or tool.
- A concrete lesson from building or researching the material.

Do not summarize every section. A LinkedIn post needs one coherent reason to click.

### 3. Draft the post

Default to this structure:

1. Open with a specific hook in the first one to three lines.
2. Explain the practical tension or lesson in short paragraphs.
3. Add a compact list only when it improves scanning.
4. State what the linked page gives the reader.
5. Include the full source URL.
6. End with a genuine discussion question when the topic benefits from one.
7. Add three to five relevant hashtags.

Keep the draft comfortably below LinkedIn's current character limit. Verify the limit from official LinkedIn Help when reporting an exact number.

Use first person when the user owns or authored the source. Prefer concrete language such as "I wrote," "I built," or "I found." Do not claim authorship when ownership is unclear.

Follow the repository writing style:

- Do not use em dashes.
- Avoid generic announcement language and inflated adjectives.
- Keep paragraphs short enough to scan on a phone.
- Use bullets sparingly.
- Avoid manufactured engagement prompts.
- Do not place citations inside the LinkedIn draft unless the user requests them. Keep supporting links in the source page when possible.

### 4. Prepare the share path

Give concise posting steps when requested:

1. Open LinkedIn and select **Start a post**.
2. Paste the draft with the source URL included.
3. Select the intended audience.
4. Wait for the link preview and verify its title, description, and image.
5. Publish or schedule the post.

When useful, construct a convenience share URL in this form:

```text
https://www.linkedin.com/sharing/share-offsite/?url=<percent-encoded-source-url>
```

Describe it as a way to open the source URL in LinkedIn's share flow. Do not promise that it will prefill the post commentary.

If the preview is missing or stale, check the published page's canonical URL and Open Graph metadata. Report the issue. Do not modify page metadata unless the user asks for that change.

### 5. Copy only on request

Copy the final plain-text draft only when the user explicitly asks. Exclude Markdown blockquote markers, headings such as `Draft`, instructions, citations, and explanatory notes unless the user asks to include them.

Use the platform clipboard command available in the environment:

- macOS: `pbcopy`
- Linux with Wayland: `wl-copy`
- Linux with X11: `xclip -selection clipboard`
- Windows: `clip`

Preserve paragraph breaks, bullets, the source URL, and hashtags. Confirm that the copy command succeeded.

## Revision requests

Apply common revisions without restarting the workflow:

- **Shorter**: Keep the hook, one supporting idea, the link, and up to three hashtags.
- **More personal**: Add what motivated the work or what changed the user's thinking, using only known context.
- **More technical**: Replace broad benefits with a specific model, tradeoff, or implementation detail from the source.
- **Less promotional**: Lead with the lesson and move the source link near the end.
- **For hiring or leadership audiences**: Emphasize decisions, risks, ownership, and outcomes without turning the post into a sales pitch.

Return one polished default draft. Offer alternatives only when the user requests options or the source supports two materially different audiences.

## Finish criteria

- The draft has one clear angle.
- Every factual claim is supported by the source or clearly framed as the user's view.
- The source URL is correct and included.
- The opening works before LinkedIn truncates the post.
- The prose follows the repository writing style.
- Sharing instructions rely on current official guidance when interface details matter.
- Clipboard contents contain only the requested post text.
