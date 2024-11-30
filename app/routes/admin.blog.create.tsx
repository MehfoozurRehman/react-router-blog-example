import { useFetcher } from "react-router";

export default function BlogCreate() {
  const fetcher = useFetcher();

  return (
    <>
      <div className="container__content__heading">Create Blog</div>
      <fetcher.Form className="container__content__form">
        <input type="text" name="title" placeholder="Title" required />
        <input
          type="text"
          name="markdownPath"
          placeholder="Markdown Path"
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          required
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
            required
          />
          Published
        </label>
        <button type="submit">Create</button>
      </fetcher.Form>
    </>
  );
}
