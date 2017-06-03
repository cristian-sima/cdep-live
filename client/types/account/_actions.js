// @flow

import type { AccountInfoActions } from "./info";
import type { AccountsActions } from "./accounts";
import type { BankHolidaysActions } from "./bankHolidays";
import type { CompaniesActions } from "./companies";
import type { AuthActions } from "./auth";
import type { ModalActions } from "./modal";
import type { NotificationsActions } from "./notifications";
import type { SuggestionsActions } from "./suggestions";

export type Actions =
AccountInfoActions
| BankHolidaysActions
| CompaniesActions
| AuthActions
| ModalActions
| NotificationsActions
| SuggestionsActions
| AccountsActions;
