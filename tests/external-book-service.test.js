import { ExternalBookService } from '../external-book-service.js';

beforeEach(() => {
  global.fetch = jest.fn();
});

describe("ExternalBookService - transformFormats", () => {
  test("should convert formats object to an array of key/value pairs", () => {
    const inputBook = {
      id: "123",
      formats: {
        "text/html": "https://example.com/book.html",
        "application/epub+zip": "https://example.com/book.epub"
      }
    };

    const result = ExternalBookService.transformFormats({ ...inputBook });
    expect(Array.isArray(result.formats)).toBe(true);
    expect(result.formats).toEqual([
      { key: "text/html", value: "https://example.com/book.html" },
      { key: "application/epub+zip", value: "https://example.com/book.epub" }
    ]);
  });

  test("should not modify formats if already an array", () => {
    const inputBook = {
      id: "123",
      formats: [
        { key: "text/html", value: "https://example.com/book.html" }
      ]
    };

    const result = ExternalBookService.transformFormats({ ...inputBook });
    expect(Array.isArray(result.formats)).toBe(true);
    expect(result.formats).toEqual(inputBook.formats);
  });
});

describe("ExternalBookService - fetchExternalBookById", () => {
  test("should return transformed book if found", async () => {
    const fakeBook = {
      id: "123",
      formats: {
        "text/html": "https://example.com/book.html"
      }
    };
    const fakeResponse = { results: [fakeBook] };

    global.fetch.mockResolvedValueOnce({
      json: async () => fakeResponse
    });

    const result = await ExternalBookService.fetchExternalBookById("123");
    expect(result).toEqual({
      ...fakeBook,
      formats: [{ key: "text/html", value: "https://example.com/book.html" }]
    });
    expect(global.fetch).toHaveBeenCalledWith("https://gutendex.com/books/?ids=123");
  });

  test("should return null if no book found", async () => {
    const fakeResponse = { results: [] };
    global.fetch.mockResolvedValueOnce({
      json: async () => fakeResponse
    });
    const result = await ExternalBookService.fetchExternalBookById("999");
    expect(result).toBeNull();
  });
});

describe("ExternalBookService - fetchAllExternalBooks", () => {
  test("should return an array of transformed books", async () => {
    const fakeBooks = [
      { id: "101", formats: { "text/html": "https://example.com/book101.html" } },
      { id: "102", formats: { "application/epub+zip": "https://example.com/book102.epub" } }
    ];
    const fakeResponse = { results: fakeBooks };
    global.fetch.mockResolvedValueOnce({
      json: async () => fakeResponse
    });

    const result = await ExternalBookService.fetchAllExternalBooks();
    expect(result).toEqual([
      {
        id: "101",
        formats: [{ key: "text/html", value: "https://example.com/book101.html" }]
      },
      {
        id: "102",
        formats: [{ key: "application/epub+zip", value: "https://example.com/book102.epub" }]
      }
    ]);
    expect(global.fetch).toHaveBeenCalledWith("https://gutendex.com/books");
  });

  test("should return an empty array if no results", async () => {
    const fakeResponse = { results: [] };
    global.fetch.mockResolvedValueOnce({
      json: async () => fakeResponse
    });

    const result = await ExternalBookService.fetchAllExternalBooks();
    expect(result).toEqual([]);
  });
});
