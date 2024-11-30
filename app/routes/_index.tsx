import { Suspense, use } from "react";
import { ActionFunctionArgs, useFetcher } from "react-router";

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

  if (!formData.get("post")) {
    return {
      error: "Post is required",
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  data.push({
    id: data.length + 1,
    post: formData.get("post") as string,
  });

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
        <List
          dataPromise={loaderData.data}
          isLoading={fetcher.state === "loading"}
        />
      </Suspense>
      <fetcher.Form method="post" key={fetcher.state}>
        <input type="text" name="post" />
        <button disabled={fetcher.state === "submitting"}>
          {fetcher.state === "submitting" ? "Submitting..." : "Submit"}
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
  isLoading,
}: {
  dataPromise: Promise<{ id: number; post: string }[]>;
  isLoading: boolean;
}) {
  const list = use(dataPromise);

  return (
    <ul style={{ opacity: isLoading ? 0.5 : 1 }}>
      {list?.map((post) => (
        <li key={post.id}>{post.post}</li>
      ))}
    </ul>
  );
}
