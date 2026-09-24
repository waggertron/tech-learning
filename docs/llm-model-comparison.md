# Maintaining the LLM model comparison

The catalog lives in `src/content/docs/topics/ai/llm-model-comparison/index.md`. It is a static, dated reference for major model families, significant historical releases, and separately released sizes. Both the AI category and root topic indexes link to it.

Each row records the model, creator, release date, published parameter count, weight access and license, estimated local inference memory, description, and a primary source link. Prefer the creator's Hugging Face model card for downloadable checkpoints. Use official documentation, release announcements, or original research reports for hosted or historical models. Link to a release-specific source when a current model page replaces historical details.

Keep preview, paper, API, general-availability, and weight-release dates distinct. Use month precision when day-level evidence is not established. A Hugging Face repository's creation date is not necessarily its release date. Record the verification date in the page introduction and frontmatter. Counts in the description, introduction, and both indexes match the number of model rows.

Do not infer proprietary parameter counts or local availability. Read the weights' license, not only the code license. Classify permissive weights separately from custom, research-only, and non-commercial terms. Licenses can change within the same family. Retain a qualification if local access or a release detail remains unverified.

The memory column uses decimal GB. Its first number is an idealized packed 4-bit weight floor, `0.5 * P`, where `P` is billions of stored parameters. The illustrative model-process budget is `ceil(0.6 * P + 2)` through `ceil(0.75 * P + 4)`. It assumes one inference stream, roughly 2K-4K text tokens, and an efficient runtime with supported quantization. This is an editorial planning heuristic, not a tested minimum, vendor measurement, or hardware recommendation. It excludes operating-system and loading headroom. Keep the assumptions beside the table.

Use total MoE parameters for resident storage. Check whether counts exclude visual encoders, embedding tables, conditional memory, or speculative models. Mark exceptional rows rather than forcing them through the generic formula. DeepSeek V4.1 Flash, for example, lists its 552B backbone separately from 196B Engram memory. Gemma effective-size labels also need special treatment. Do not substitute the Hugging Face tensor counter without checking tied weights and auxiliary modules.

After changes, run the content validation tiers documented in `docs/pre-push-validation.md`: style, published-content review, build, rendered pages, internal links, and external links. Inspect the built table header, row count, model links, and memory explanations. No local model execution is implied by these site checks. A model-specific runtime measurement needs its own hardware, precision, context, concurrency, and peak-allocation evidence.
