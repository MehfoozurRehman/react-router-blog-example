import { ActionFunctionArgs, redirect, useFetcher } from "react-router";
import BlogModel from "models/blog";

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();

  const title = body.get("title") as string;
  const markdownPath = body.get("markdownPath") as string;
  const description = body.get("description") as string;
  const published = body.get("published") === "on";

  if (!title) {
    return {
      error: "Title is required",
    };
  }

  if (!markdownPath) {
    return {
      error: "Markdown Path is required",
    };
  }

  if (!description) {
    return {
      error: "Description is required",
    };
  }

  await BlogModel.create({
    title,
    markdownPath,
    description,
    published,
  });

  return redirect("/admin/blog");
}

export default function BlogCreate() {
  const fetcher = useFetcher();

  return (
    <>
      <div className="container__content__heading">Create Blog</div>
      <fetcher.Form method="post" className="container__content__form">
        <input type="text" name="title" placeholder="Title" required />
        <input
          type="text"
          name="markdownPath"
          placeholder="Markdown Path"
          required
        />
        <textarea name="description" placeholder="Description" required />
        <label
          htmlFor="published"
          className="container__content__form__checkbox"
        >
          <input
            type="checkbox"
            name="published"
            id="published"
            placeholder="Published"
          />
          Published
        </label>
        <button
          type="submit"
          disabled={
            fetcher.state === "loading" || fetcher.state === "submitting"
          }
        >
          {fetcher.state === "submitting" ? "Creating..." : "Create"}
        </button>
      </fetcher.Form>
    </>
  );
}
