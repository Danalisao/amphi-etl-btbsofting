# Decision Log

**Project:** Amphi ETL — Visual Data Preparation Platform

| ID | Date | Decision | Context | Rationale | Made By | Status |
|----|------|----------|---------|-----------|---------|--------|
| D001 | 2026-05-16 | Use ODBC/pyodbc for HFSQL, not native driver | No verified Python native driver for HFSQL; reusing existing ODBC infrastructure | Minimize scope, reuse proven pattern, lower maintenance | Session | ✅ Implemented |
| D002 | 2026-05-16 | Separate HFSQLInput & HFSQLOutput components | Mirror existing SQL/ODBC pattern for input/output symmetry | Consistency with codebase conventions, easier testing/maintenance | Session | ✅ Implemented |
| D003 | 2026-05-16 | Target HFSQL Classic + Client/Server (not Network) | Most common modes; Network requires server-side gateway | Pragmatic scope limitation | Session | ✅ Documented |
| D004 | 2026-05-16 | No custom manager/connector layer | pandas.read_sql() + standard SQLAlchemy odbc+pyodbc work without adaptation | Reduce scope, proven compatibility | Session | ✅ Validated |

---

### Implementation Confidence
- D001: High — ODBC is standard for HFSQL integration across platforms
- D002: High — mirrors Input/Output pattern used for SQL, ODBC, MySQL, PostgreSQL
- D003: Medium — Network mode untested; reprioritize only if user demand
- D004: High — pandas + SQLAlchemy handle ODBC dialect transparently
