# Alpha 12 role / identity model

- `customer`: read/write own project and create/revoke own share links.
- `sales`: read projects required for sales, work quote state/pricing and create review links.
- `fitment`: read project/quote data, resolve fitment state and manage fitment/catalogue content.
- `admin`: full runtime/configuration authority.

## Enforcement
HTTP-served mode enforces roles on the server. Browser role state is convenience/fallback only.

Alpha 12 introduces hashed HttpOnly server sessions. Anonymous customer sessions are automatically issued so owner isolation has a stable server actor ID. Development staff sessions can be created from `staff-login.html` only when the server allows dev login.

In production, prototype `x-pro4x4-*` role headers and development login default off. A real identity provider/auth gateway remains the next staff-identity dependency.
