import BlogModel from "models/blog";
import { Link } from "react-router";
import { Route } from "./+types/_index";

export async function loader({}: Route.LoaderArgs) {
  const blogsBase = await BlogModel.find({
    published: true,
  })
    .select("title description _id")
    .lean();

  const blogs = blogsBase.map(({ _id, title, description }) => ({
    _id: String(_id),
    title,
    description,
  }));

  return blogs;
}

export default function Blog({ loaderData }: Route.ComponentProps) {
  return (
    <>
      {loaderData.length === 0 ? (
        <div className="container__content__no__data">No blogs found</div>
      ) : (
        loaderData.map((blog) => (
          <div key={blog._id} className="container__content__entry">
            <Link
              to={`/${blog._id}`}
              className="container__content__entry__title"
            >
              {blog.title}
            </Link>
            <div className="container__content__entry__description">
              {blog.description}
            </div>
          </div>
        ))
      )}
    </>
  );
}
