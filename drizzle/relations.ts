import { relations } from "drizzle-orm/relations";
import { user, account, session, staff } from "./schema";

export const accountRelations = relations(account, ({one}) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id]
	}),
}));

export const userRelations = relations(user, ({many}) => ({
	accounts: many(account),
	sessions: many(session),
	staff: many(staff),
}));

export const sessionRelations = relations(session, ({one}) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	}),
}));

export const staffRelations = relations(staff, ({one}) => ({
	user: one(user, {
		fields: [staff.userId],
		references: [user.id]
	}),
}));