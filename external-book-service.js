export class ExternalBookService {
    /**
     * Fetch a single external book by its id from Gutendex and transform its formats.
     * @param {string} id - The book id to fetch.
     * @returns {Object|null} The book object or null if not found.
     */
    static async fetchExternalBookById(id) {
      try {
        const gutendexUrl = `https://gutendex.com/books/?ids=${id}`;
        const response = await fetch(gutendexUrl);
        const externalData = await response.json();
        const book = externalData.results && externalData.results[0];
        return book ? this.transformFormats(book) : null;
      } catch (err) {
        console.error("Error fetching external book by id:", err);
        return null;
      }
    }
  
    /**
     * Fetch all external books from Gutendex and transform their formats.
     * @returns {Array} An array of books.
     */
    static async fetchAllExternalBooks() {
      try {
        const response = await fetch(`https://gutendex.com/books`);
        const externalData = await response.json();
        const books = externalData.results || [];
        return books.map(book => this.transformFormats(book));
      } catch (error) {
        console.error("Error fetching all external books:", error);
        throw error;
      }
    }
  
    /**
     * Transform the formats property of an external book record.
     * Converts a formats object into an array of { key, value } objects.
     * @param {Object} book - The book object to transform.
     * @returns {Object} The book object with transformed formats.
     */
    static transformFormats(book) {
      if (book.formats && typeof book.formats === "object" && !Array.isArray(book.formats)) {
        book.formats = Object.keys(book.formats).map(key => ({
          key,
          value: book.formats[key]
        }));
      }
      return book;
    }
  }
  