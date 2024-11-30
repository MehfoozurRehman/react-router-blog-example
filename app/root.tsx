import connectDB from "lib/mongoose";
import {
  Link,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import "styles/global.scss";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div className="container">
          <div className="container__header">
            <Link to="/" className="container__header__title">
              Blogy
            </Link>
            <div className="container__header__by">
              By{" "}
              <a href="http://github.com/mehfoozurRehman" target="_blank">
                @mehfoozurRehman
              </a>
            </div>
          </div>
          <div className="container__content">{children}</div>
        </div>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export async function loader() {
  await connectDB();

  return null;
}

export default function App() {
  return <Outlet />;
}
