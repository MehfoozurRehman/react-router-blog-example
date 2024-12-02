import { Route } from "./+types/$blog";
import BlogModel from "models/blog";
import fs from "fs/promises";
import path from "path";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export async function loader({ params }: Route.LoaderArgs) {
  const blogId = params.blog as string;

  if (!blogId) {
    return {
      error: "Blog ID is required",
    };
  }

  const blog = await BlogModel.findById(blogId);

  if (!blog) {
    return {
      error: "Blog not found",
    };
  }

  if (!blog.published) {
    return {
      error: "Blog not published",
    };
  }

  const { title, description, markdownPath } = blog;

  let file = null;

  try {
    file = await fs.readFile(
      path.join(process.cwd(), "public", markdownPath + ".md")
    );
  } catch (err) {
    return {
      error: "Blog content not found",
    };
  }

  if (!file) {
    return {
      error: "Blog content not found",
    };
  }

  return {
    title,
    description,
    content: file.toString(),
  };
}

export default function BlogDetails({ loaderData }: Route.ComponentProps) {
  return loaderData.error ? (
    <div className="container__content__no__data">{loaderData.error}</div>
  ) : (
    <div className="container__content__entry">
      <div className="container__content__entry__title">{loaderData.title}</div>
      <div className="container__content__entry__description">
        {loaderData.description}
      </div>
      <Markdown
        remarkPlugins={[remarkGfm]}
        className="container__content__entry__content"
      >
        {loaderData.content}
      </Markdown>
    </div>
  );
}
