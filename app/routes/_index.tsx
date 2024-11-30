import { Suspense } from "react";
import { ActionFunctionArgs, Await, Form, useFetcher } from "react-router";

let data = [
  {
    id: 1,
    post: "Hello World",
  },
];

export async function loader() {
  const dataPromise = new Promise((resolve) =>
    setTimeout(() => resolve(data), 1000)
  );

  return {
    data: dataPromise,
  };
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  console.log(formData.get("post"));

  if (!formData.get("post")) {
    return {
      error: "Post is required",
    };
  }

  await new Promise((resolve) =>
    setTimeout(
      () =>
        resolve(
          data.push({
            id: data.length + 1,
            post: formData.get("post") as string,
          })
        ),
      1000
    )
  );

  console.log(data);

  return {
    message: "Post created",
  };
}

export default function Blog({
  loaderData,
}: {
  loaderData: {
    data: Promise<
      {
        id: number;
        post: string;
      }[]
    >;
  };
}) {
  const fetcher = useFetcher();

  return (
    <div>
      <h1>Blog</h1>
      <Suspense
        fallback={
          <div>
            <h2>Loading...</h2>
          </div>
        }
      >
        <List dataPromise={loaderData.data} />
      </Suspense>
      <fetcher.Form method="post" key={fetcher.state}>
        <input type="text" name="post" />
        <button
          disabled={
            fetcher.state === "loading" || fetcher.state === "submitting"
          }
        >
          {fetcher.state === "loading" || fetcher.state === "submitting"
            ? "Submitting..."
            : "Submit"}
        </button>
        {fetcher?.data?.message && (
          <p style={{ color: "green" }}>{fetcher.data.message}</p>
        )}
        {fetcher?.data?.error && (
          <p style={{ color: "red" }}>{fetcher.data.error}</p>
        )}
      </fetcher.Form>
    </div>
  );
}

function List({
  dataPromise,
}: {
  dataPromise: Promise<{ id: number; post: string }[]>;
}) {
  return (
    <ul>
      <Await resolve={dataPromise}>
        {(list) => list?.map((post) => <li key={post.id}>{post.post}</li>)}
      </Await>
    </ul>
  );
}
