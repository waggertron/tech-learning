// @ts-nocheck
import type { LoaderFunctionArgs } from "react-router";
import { getProject } from "../../content/docs/posts/_react-example-modules/projects";

export async function loader({ params }: LoaderFunctionArgs) {
  return getProject(String(params.projectId));
}

export default function ProjectRoute({
  loaderData,
}: {
  loaderData: Awaited<ReturnType<typeof loader>>;
}) {
  return (
    <main>
      <h1>{loaderData.name}</h1>
      <p>{loaderData.description}</p>
    </main>
  );
}
