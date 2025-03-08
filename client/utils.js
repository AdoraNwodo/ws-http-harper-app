// List of possible Gutendex ID values
const possibleIds = [
    26184, 84, 25558, 2701, 1513, 1342, 11, 100, 145, 37106, 2641, 
    64317, 2542, 16389, 67979, 174, 394, 1080, 6761, 2160, 1952, 6593, 
    4085, 844, 5197, 1259, 43, 345, 2554, 5200, 76, 25344
];
  
/**
 * Returns a random ID from the possibleIds array.
 */
export function generateRandomId() {
    const index = Math.floor(Math.random() * possibleIds.length);
    return possibleIds[index];
}
  
/**
 * Generates a random book record with unique details.
 */
export function generateRandomBook() {
    const titles = [
      "The Scarlet Letter",
      "Moby Dick",
      "1984",
      "Brave New World",
      "To Kill a Mockingbird"
    ];

    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const uniquePart = Math.floor(Math.random() * 10000);
    
    return {
      title: `${randomTitle} Part ${uniquePart}`,
      authors: [
        { 
          name: `Author ${uniquePart}`, 
          birth_year: 1900 + (uniquePart % 100), 
          death_year: 1900 + (uniquePart % 100) + 70 
        }
      ],
      summaries: [
        `A dynamically generated record titled "${randomTitle} Part ${uniquePart}".`
      ],
      translators: [],
      subjects: ["Random Fiction", "Example Subject"],
      bookshelves: ["Demo Shelf"],
      languages: ["en"],
      copyright: false,
      media_type: "Text",
      formats: [
        { key: "text/html", value: `https://example.com/book${uniquePart}.html` }
      ],
      download_count: uniquePart
    };
  }
  