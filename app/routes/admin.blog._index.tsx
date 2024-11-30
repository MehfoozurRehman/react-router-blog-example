import BlogModel from "models/blog";
import { Link } from "react-router";

export async function loader() {
  return await BlogModel.find({
    published: true,
  }).select("title description _id");
}

export default function Blog({
  loaderData,
}: {
  loaderData: {
    _id: string;
    title: string;
    description: string;
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
        loaderData.map((blog) => (
          <div key={blog._id} className="container__content__entry">
            <h2>{blog.title}</h2>
            <p>{blog.description}</p>
            <Link
              to={`/admin/blog/${blog._id}`}
              className="container__content__entry__edit"
            >
              Edit
            </Link>
            <button>Delete</button>
          </div>
        ))
      )}
    </>
  );
}
