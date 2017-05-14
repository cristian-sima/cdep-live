// @flow

import type { ArticlesActions } from "./articles";
import type { CashingsActions } from "./cashings";
import type { ClientsActions } from "./clients";
import type { CompanyInfoActions } from "./info";
import type { DelegatesActions } from "./delegates";
import type { EmployeesActions } from "./employees";
import type { InvoicesActions } from "./invoices";
import type { PermissionsActions } from "./permissions";
import type { SerialsActions } from "./serials";

export type Actions =
CompanyInfoActions
| PermissionsActions
| ArticlesActions
| CashingsActions
| ClientsActions
| DelegatesActions
| EmployeesActions
| InvoicesActions
| SerialsActions
