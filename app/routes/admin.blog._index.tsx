import BlogModel from "models/blog";
import { useTransition } from "react";
import { ActionFunctionArgs, Link, useSubmit } from "react-router";

export async function loader() {
  const blogsBase = await BlogModel.find()
    .select("title description published _id")
    .lean();

  const blogs = blogsBase.map(({ _id, title, description, published }) => ({
    _id: String(_id),
    title,
    description,
    published: published ? "Published" : "Draft",
  }));

  return blogs;
}

export async function action({ request }: ActionFunctionArgs) {
  const body = await request.formData();

  const blogId = body.get("blogId") as string;

  if (!blogId) {
    return {
      error: "Blog ID is required",
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 2000));

  await BlogModel.findByIdAndDelete(blogId);

  return null;
}

export default function Blog({
  loaderData,
}: {
  loaderData: {
    _id: string;
    title: string;
    description: string;
    published: string;
  }[];
}) {
  return (
    <>
      {loaderData.length === 0 ? (
        <div className="container__content__no__data">
          No blogs found
          <Link to="/admin/blog/create">Create</Link>
        </div>
      ) : (
        <>
          <div className="container__content__heading">
            Blogs{" "}
            <Link
              to="/admin/blog/create"
              className="container__content__create"
            >
              Create
            </Link>
          </div>
          {loaderData.map((blog) => (
            <BlogEntry key={blog._id} blog={blog} />
          ))}
        </>
      )}
    </>
  );
}

function BlogEntry({
  blog,
}: {
  blog: {
    _id: string;
    title: string;
    description: string;
    published: string;
  };
}) {
  const submit = useSubmit();
  const [isPending, startTransition] = useTransition();

  const deleteBlog = () => {
    if (!confirm("Are you sure you want to delete this blog?")) {
      return;
    }

    startTransition(async () => {
      await submit({ blogId: blog._id }, { method: "DELETE" });
    });
  };

  return (
    <div className="container__content__entry">
      <div className="container__content__entry__title">
        {blog.title} <span>({blog.published})</span>
      </div>
      <div className="container__content__entry__description">
        {blog.description}
      </div>
      <Link
        to={`/admin/blog/${blog._id}`}
        className="container__content__entry__edit"
      >
        Edit
      </Link>
      <button
        onClick={deleteBlog}
        disabled={isPending}
        className="container__content__entry__delete"
      >
        {isPending ? "Deleting..." : "Delete"}
      </button>
    </div>
  );
}
