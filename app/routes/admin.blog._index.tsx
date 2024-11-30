import BlogModel from "models/blog";
import { Link } from "react-router";

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
            <div key={blog._id} className="container__content__entry">
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
              <button className="container__content__entry__delete">
                Delete
              </button>
            </div>
          ))}
        </>
      )}
    </>
  );
}
