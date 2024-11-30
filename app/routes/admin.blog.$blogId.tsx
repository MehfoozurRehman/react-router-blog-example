import {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  redirect,
  useFetcher,
} from "react-router";
import BlogModel from "models/blog";

export async function loader({ params }: LoaderFunctionArgs) {
  const blogId = params.blogId;

  const blog = await BlogModel.findById(blogId)
    .select("title description markdownPath published")
    .lean();

  return blog;
}

export async function action({ params, request }: ActionFunctionArgs) {
  try {
    const blogId = params.blogId;
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

    await BlogModel.findByIdAndUpdate(blogId, {
      title,
      markdownPath,
      description,
      published,
    });

    return redirect("/admin/blog");
  } catch (e) {
    return {
      error: (e as Error).message,
    };
  }
}

export default function BlogEdit({
  loaderData,
}: {
  loaderData: {
    title: string;
    description: string;
    markdownPath: string;
    published: boolean;
  };
}) {
  const fetcher = useFetcher();

  return (
    <>
      <div className="container__content__heading">Edit Blog</div>
      <fetcher.Form method="post" className="container__content__form">
        <input
          type="text"
          name="title"
          placeholder="Title"
          required
          defaultValue={loaderData.title}
        />
        <input
          type="text"
          name="markdownPath"
          placeholder="Markdown Path"
          required
          defaultValue={loaderData.markdownPath}
        />
        <textarea
          name="description"
          placeholder="Description"
          required
          defaultValue={loaderData.description}
        />
        <label
          htmlFor="published"
          className="container__content__form__checkbox"
        >
          <input
            type="checkbox"
            name="published"
            id="published"
            placeholder="Published"
            defaultChecked={loaderData.published}
          />
          Published
        </label>
        <button type="submit">Save</button>
      </fetcher.Form>
    </>
  );
}
