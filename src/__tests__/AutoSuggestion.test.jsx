import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AutoSuggestion from "../components/AutoSuggestion";

const recipes = [
  { id: 1, name: "Margherita Pizza", cuisine: "Italian", difficulty: "Easy", rating: 4.6, image: "" },
  { id: 2, name: "Pizza Pockets", cuisine: "American", difficulty: "Easy", rating: 4.1, image: "" },
];

const mockFetch = (impl) => vi.fn(impl ?? (() => Promise.resolve({ ok: true, json: async () => ({ recipes }) })));

describe("AutoSuggestion", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("shows suggestions, supports keyboard selection and shows details", async () => {
    vi.stubGlobal("fetch", mockFetch());
    const user = userEvent.setup();
    render(<AutoSuggestion />);

    await user.type(screen.getByRole("combobox"), "pizza");
    expect(await screen.findAllByRole("option")).toHaveLength(2);
    expect(fetch).toHaveBeenCalledTimes(1);
    expect(fetch.mock.calls[0][0]).toContain("q=pizza");

    await user.keyboard("{ArrowDown}{Enter}");
    expect(screen.getByRole("combobox")).toHaveValue("Pizza Pockets");
    expect(screen.getByText("American")).toBeInTheDocument();
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("shows an error message and recovers from failures", async () => {
    vi.stubGlobal("fetch", mockFetch(() => Promise.resolve({ ok: false, status: 500 })));
    const user = userEvent.setup();
    render(<AutoSuggestion />);

    await user.type(screen.getByRole("combobox"), "x");
    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("shows 'No results found' and does not crash on Enter", async () => {
    vi.stubGlobal("fetch", mockFetch(() => Promise.resolve({ ok: true, json: async () => ({ recipes: [] }) })));
    const user = userEvent.setup();
    render(<AutoSuggestion />);

    await user.type(screen.getByRole("combobox"), "zzz");
    expect(await screen.findByText(/no results found/i)).toBeInTheDocument();
    await user.keyboard("{Enter}");
    expect(screen.getByText(/no results found/i)).toBeInTheDocument();
  });

  it("clears the input and closes the dropdown", async () => {
    vi.stubGlobal("fetch", mockFetch());
    const user = userEvent.setup();
    render(<AutoSuggestion />);

    await user.type(screen.getByRole("combobox"), "pizza");
    await screen.findAllByRole("option");
    await user.click(screen.getByRole("button", { name: /clear/i }));
    expect(screen.getByRole("combobox")).toHaveValue("");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });
});
