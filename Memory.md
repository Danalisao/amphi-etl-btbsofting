# 🧠 Project Memory

**Project:** Amphi ETL — Visual Data Preparation Platform  
**Last Updated:** 2026-05-16 — after HFSQL Components Phase 1A + 1B + 2  
**Status:** 🟢 Complete (HFSQL components ready for Phase 3 validation + merge)

## 📍 Current Objective

Add HFSQL (PC-Soft) database connectivity to Amphi ETL visual pipeline editor via ODBC/pyodbc. Users can now visually read from and write to HFSQL Classic and Client/Server databases. Implementation reuses established Input/Output component patterns.

## ✅ Completed Work

| Phase | Title | Deliverable | Status |
| --- | --- | --- | --- |
| 1A | HFSQL Input Component | `HFSQLInput.tsx` + dynamic form + pyodbc code generation | ✅ TypeScript LS clean |
| 1B | HFSQL Output Component | `HFSQLOutput.tsx` aligned with SQL output pattern | ✅ Code-Review APPROVED |
| 2 | HFSQL UI Integration | Registered in index, aggregators, icons; linked to UI | ✅ Package export verified |

## 🔜 Up Next

- [ ] **Phase 3:** Targeted validation (LS TypeScript, no regressions) + formal sign-off  
- [ ] **Phase 4:** Runtime E2E test with live HFSQL database (optional, post-merge)

## 🔑 Key Decisions

- **D001 — ODBC/pyodbc only:** No native Python HFSQL driver found; reuse proven ODBC infrastructure → lower scope, proven compatibility  
- **D002 — Separate Input/Output:** Mirror SQL/ODBC pattern for consistency → easier maintenance, discovery  
- **D003 — Classic + Client/Server only:** Network mode deprioritized → pragmatic scope limit  
- **D004 — No custom connector layer:** pandas.read_sql() + SQLAlchemy handle ODBC transparently → reduce complexity  

## ⚠️ Warnings & Open Questions

- **ODBC Driver Dependency:** HFSQL ODBC driver must be installed on user's machine. Not bundled. → Document in release notes.  
- **No Runtime Testing Yet:** Code generation validated (TypeScript LS, Code-Review); actual pyodbc connection untested. → First integration test before GA.  
- **Connection String Format:** HFSQL ODBC differs from SQL Server (no Windows Auth). If connection fails, verify string first.  
- **Character Encoding:** HFSQL may use non-UTF8. Monitor for encoding errors in Phase 4 testing.

## 🔧 Tech Stack & Conventions

- **Stack:** React + TypeScript, pyodbc + pandas (Python backend), ODBC driver protocol  
- **Patterns:** Component naming `{Database}Input` / `{Database}Output`; reuse `formData` state + `buildConnectionString()` + `generateCode()` for all DB components  
- **Files Modified:** `jupyterlab-amphi/packages/pipeline-components-core/{inputs,outputs}/databases/` + `index.ts`  
- **Validation:** ✅ TypeScript LS clean | ✅ Code-Review approved | ⏳ Runtime E2E pending

---

**For session continuity:** See `.specify/memory/` for detailed progress, decisions, patterns, and handoff context. Start with `context.md` for session state.
