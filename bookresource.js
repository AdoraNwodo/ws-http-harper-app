import { Resource, tables } from 'harperdb';
import { ExternalBookService } from './external-book-service.js';

export class Books extends Resource {
    constructor() {
        super();
        this.table = tables.Book;
    }

    /**
     * Custom GET handler.
     * Returns both local (HarperDB) Book records and external book data from Gutendex in one response.
     */
    async get() {
        console.log("GET request received");
        this.id = this.getId();

        if (this.id) {
            const localRecord = await this.table.get(this.id);
            if (localRecord) {
            console.log("Found local record for id:", this.id);
            return localRecord;
            } else {
            console.log("No local record found for id:", this.id, "; fetching from Gutendex.");
            const externalRecord = await ExternalBookService.fetchExternalBookById(this.id);
            return externalRecord || { error: "Record not found in external and internal source." };
            }
        } else {
            try {
            const localBooks = await this.table.get();
            const externalBooks = await ExternalBookService.fetchAllExternalBooks();
            return { localBooks, externalBooks };
            } catch (error) {
            console.error("Error fetching all records:", error);
            return { error: "Internal Server Error" };
            }
        }
    }

    /**
     * Custom POST handler.
     * Saves a new book record in HarperDB.
     */
    async post(data) {
        console.log("POST request received");

        if (typeof data === 'string') {
            try {
            data = JSON.parse(data);
            } catch (err) {
            console.error("Failed to parse payload:", err);
            return { error: "Invalid JSON" };
            }
        }

        if (data && data.id !== undefined) {
            delete data.id;
        }

        try {
            const result = await this.table.post(data);
            console.log("Record created successfully:", result);
            return result;
        } catch (error) {
            console.error("Error creating record in Book:", error);
            return { error: "Internal Server Error", details: error.message };
        }
    }

    /**
     * WebSocket connect() handler.
     * Processes incoming WS messages and yields responses.
     * Incoming messages must include an "action" property:
     *   - For "write": message.data holds the record payload.
     *   - For "read": message may include an "id" property.
     */
    async *connect(incomingMessages) {
        console.log("WebSocket connect() method triggered for Books resource");
        yield { event: "connected", message: "Welcome to the Books resource via WS!" };

        for await (const rawMessage of incomingMessages) {
            let message;
            try {
                message = typeof rawMessage === "string" ? JSON.parse(rawMessage) : rawMessage;
            } catch (e) {
                yield { event: "error", message: "Invalid JSON in message" };
                continue;
            }

            if (message.action === "write") {
            try {
                if (message.data && message.data.id !== undefined) {
                    delete message.data.id;
                }
                const result = await this.table.post(message.data);
                console.log("Record created via WS:", result);
                yield { event: "write_ack", record: result };
            } catch (err) {
                console.error("Error in WS write request:", err);
                yield { event: "error", message: err.message };
            }
            } else if (message.action === "read") {
                if (message.id) {
                    try {
                    const localRecord = await this.table.get(message.id);
                    if (localRecord) {
                        yield { event: "read_ack", record: localRecord };
                    } else {
                        const externalRecord = await ExternalBookService.fetchExternalBookById(message.id);
                        if (externalRecord) {
                            yield { event: "read_ack", record: externalRecord };
                        } else {
                            yield { event: "read_ack", error: "Record not found" };
                        }
                    }
                    } catch (err) {
                        console.error("Error in WS read request for id:", err);
                        yield { event: "error", message: err.message };
                    }
                } else {
                    try {
                        const localBooks = await this.table.get();
                        const externalBooks = await ExternalBookService.fetchAllExternalBooks();
                        yield { event: "read_ack", localBooks, externalBooks };
                    } catch (err) {
                        console.error("Error in WS read request (all):", err);
                        yield { event: "error", message: err.message };
                    }
                }
            } else {
                yield { event: "error", message: "Unknown action" };
            }
        }
    }
}
