/**
 * Checks if an error (including nested causes) is a SQLite UNIQUE constraint violation.
 * Drizzle ORM wraps SQLite errors in DrizzleQueryError, placing the original error in `.cause`.
 */
export function isUniqueConstraintError(error: unknown): boolean {
	if (!(error instanceof Error)) return false;

	// Check the error message and all nested causes
	let current: unknown = error;
	while (current instanceof Error) {
		if (current.message.includes('UNIQUE constraint failed')) return true;
		current = current.cause;
	}

	return false;
}
