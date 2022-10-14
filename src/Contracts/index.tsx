import { Form, Link, LoaderFunctionArgs, NavLink, Outlet, redirect, RouteObject, useLoaderData, useNavigation, useSubmit } from 'react-router-dom'
import Contact from './Contact'
import ErrorPage from './ErrorPage'
import './index.css'
import { Contract, createContact, deleteContact, getContact, getContacts, updateContact } from "./api";
import Edit from './Edit';
import { useEffect } from 'react';
async function contactLoader({ params }: LoaderFunctionArgs) {
  const contact = await getContact(params.contactId || '');
  if (!contact) {
    throw new Response("", {
      status: 404,
      statusText: "Not Found",
    });
  }
  return contact;
}
const Contracts: RouteObject = {
  path: "/contacts",
  async loader({ request }) {
    const url = new URL(request.url)
    const q = url.searchParams.get("q")
    const contacts = await getContacts(q || '')
    return { contacts, q }
  },
  errorElement: <ErrorPage />,
  element: <App />,
  children: [
    {
      async action() {
        const contact = await createContact();
        return redirect(`/contacts/${contact.id}/edit`);
      },
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <p id="zero-state">
            This is a demo for React Router.
            <br />
            Check out{" "}
            <a href="https://reactrouter.com/">
              the docs at reactrouter.com
            </a>
            .
          </p>
        },
        {
          path: ":contactId",
          loader: contactLoader,
          errorElement: <ErrorPage />,
          async action({ request, params }) {
            let formData = await request.formData();
            return updateContact(params.contactId || '', {
              favorite: formData.get("favorite") === "true",
            });
          },
          element: <Contact />
        },
        {
          path: ":contactId/edit",
          loader: contactLoader,
          async action({ request, params }) {
            const formData = await request.formData();
            const updates = Object.fromEntries(formData);
            await updateContact(params.contactId || '', updates);
            return redirect(`/contacts/${params.contactId}`);
          },
          element: <Edit />
        },
        {
          path: ":contactId/destroy",
          errorElement: <div>Oops! There was an error.</div>,
          async action({ params }) {
            //throw new Error("oh dang!");
            await deleteContact(params.contactId || '')
            return redirect('/contacts')
          }
        }
      ]
    }
  ],

}
export default Contracts
function App() {
  const { contacts, q } = useLoaderData() as {
    contacts: Contract[]
    q: string
  }
  useEffect(() => {
    (document.getElementById("q") as HTMLInputElement).value = q;
  }, [q]);
  const navigation = useNavigation();
  const submit = useSubmit();
  const searching =
    navigation.location &&
    new URLSearchParams(navigation.location.search).has(
      "q"
    );

  return (
    <>
      <div id="sidebar">
        <h1>React Router Contacts</h1>
        <div>
          <Form id="search-form" role="search">
            <input
              id="q"
              className={searching ? "loading" : ""}
              aria-label="Search contacts"
              placeholder="Search"
              type="search"
              name="q"
              defaultValue={q}
              onChange={e => {
                const isFirstSearch = q == null;
                submit(e.currentTarget.form, {
                  replace: !isFirstSearch,
                });
              }}
            />
            <div
              id="search-spinner"
              aria-hidden
              hidden={!searching}
            />
            <div
              className="sr-only"
              aria-live="polite"
            ></div>
          </Form>
          <Form method="post">
            <button type="submit">New</button>
          </Form>
        </div>
        <nav>
          {contacts.length ? (
            <ul>
              {contacts.map((contact) => (
                <li key={contact.id}>  <NavLink
                  to={`/contacts/${contact.id}`}
                  className={({ isActive, isPending }) =>
                    isActive
                      ? "active"
                      : isPending
                        ? "pending"
                        : ""
                  }>
                  {contact.first || contact.last ? (
                    <>
                      {contact.first} {contact.last}
                    </>
                  ) : (
                    <i>No Name</i>
                  )}{" "}
                  {contact.favorite && <span>★</span>}
                </NavLink>
                </li>
              ))}
            </ul>
          ) : (
            <p>
              <i>No contacts</i>
            </p>
          )}
        </nav>
      </div>
      <div id="detail" className={
        navigation.state === "loading" ? "loading" : ""
      }>
        <Outlet />
      </div>
    </>
  )
}