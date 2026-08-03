import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SearchBar from "../components/SearchBar";

describe("SearchBar", () => {
  it("renders search input", () => {
    render(<SearchBar searchTerm="" onSearch={() => {}} />);
    expect(screen.getByPlaceholderText("Search by title or author...")).toBeInTheDocument();
  });

  it("calls onSearch when user types", async () => {
    const onSearch = jest.fn();
    render(<SearchBar searchTerm="" onSearch={onSearch} />);
    const input = screen.getByPlaceholderText("Search by title or author...");
    await userEvent.type(input, "harry");
    expect(onSearch).toHaveBeenCalled();
  });

  it("shows clear button when searchTerm is not empty", () => {
    render(<SearchBar searchTerm="harry" onSearch={() => {}} />);
    expect(screen.getByText("Clear")).toBeInTheDocument();
  });

  it("hides clear button when searchTerm is empty", () => {
    render(<SearchBar searchTerm="" onSearch={() => {}} />);
    expect(screen.queryByText("Clear")).not.toBeInTheDocument();
  });

  it("calls onSearch with empty string when Clear is clicked", async () => {
    const onSearch = jest.fn();
    render(<SearchBar searchTerm="harry" onSearch={onSearch} />);
    await userEvent.click(screen.getByText("Clear"));
    expect(onSearch).toHaveBeenCalledWith("");
  });
});