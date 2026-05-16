# Pattern Library

**Project:** Amphi ETL — Visual Data Preparation Platform
**Last Updated:** 2026-05-16

## Naming Conventions

| Type | Pattern | Example |
|------|---------|---------|
| Components (Input) | `{Database}Input` | `HFSQLInput.tsx`, `ODBCInput.tsx`, `SQLInput.tsx` |
| Components (Output) | `{Database}Output` | `HFSQLOutput.tsx`, `ODBCOutput.tsx`, `DatabaseOutput.tsx` |
| React files | PascalCase `.tsx` | `HFSQLInput.tsx` |
| Props interface | `{ComponentName}Props` | `HFSQLInputProps` |
| Constants/config | SCREAMING_SNAKE_CASE | `DEFAULT_PORT`, `FIELD_TYPES` |

## File & Folder Structure

```
jupyterlab-amphi/
└── packages/
    └── pipeline-components-core/
        ├── src/
        │   ├── components/
        │   │   ├── inputs/
        │   │   │   └── databases/
        │   │   │       ├── HFSQLInput.tsx (new)
        │   │   │       ├── ODBCInput.tsx
        │   │   │       ├── DatabaseInput.tsx (base/aggregator)
        │   │   │       └── ...
        │   │   ├── outputs/
        │   │   │   └── databases/
        │   │   │       ├── HFSQLOutput.tsx (new)
        │   │   │       ├── DatabaseOutput.tsx (aggregator)
        │   │   │       └── ...
        │   ├── index.ts (exports all component types)
        │   └── ...
        ├── package.json
        └── ...
```

## Reused Patterns

### DatabaseInput Pattern — `CONFIRMED`

- **Where used**: `ODBCInput.tsx`, `DatabaseInput.tsx`, now `HFSQLInput.tsx`
- **Description**: Base component for database connectivity with dynamic form generation
- **Key elements**:
  - `formData` state for multi-field connection config
  - `handleChange()` for form updates
  - `testConnection()` async validation
  - Code generation: `generateCode()` returns Python pyodbc/pandas snippet
  - Export via `code` property in panel state

**Template** (simplified structure from HFSQLInput):
```typescript
interface HFSQLInputProps {
  id: string;
  data: any;
}

export const HFSQLInput: React.FC<HFSQLInputProps> = ({ id, data }) => {
  const [formData, setFormData] = useState({
    connectionType: 'classic',
    server: '',
    port: 4900,
    database: '',
    user: '',
    password: ''
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const buildODBCString = (): string => {
    // ODBC connection string for HFSQL
    if (formData.connectionType === 'classic') {
      return `Driver={HFSQL};Server=local;...`;
    }
    return `Driver={HFSQL};Server=${formData.server}:${formData.port};...`;
  };

  const generateCode = (): string => {
    const connStr = buildODBCString();
    return `
import pyodbc
import pandas as pd

connection_string = '${connStr}'
conn = pyodbc.connect(connection_string)
df = pd.read_sql("SELECT * FROM ...", conn)
    `.trim();
  };

  return (
    <div>
      {/* Form fields for connection config */}
      <Input label="Server" onChange={(v) => handleChange('server', v)} />
      <Button onClick={() => generateCode()}>Generate</Button>
    </div>
  );
};
```

### DatabaseOutput Pattern — `CONFIRMED`

- **Where used**: `ODBCOutput.tsx`, `DatabaseOutput.tsx`, now `HFSQLOutput.tsx`
- **Description**: Base component for database write operations with dynamic SQL generation
- **Key elements**:
  - Same form structure as Input (connection config)
  - `generateCode()` returns SQL INSERT/UPDATE/REPLACE code
  - Support for append/replace write modes
  - Table name and column mapping

### Component Registration — `CONFIRMED`

- **Where used**: `index.ts` in pipeline-components-core
- **Description**: Central export point for all components
```typescript
export { HFSQLInput } from './components/inputs/databases/HFSQLInput';
export { HFSQLOutput } from './components/outputs/databases/HFSQLOutput';
// ... all other components
```

## Anti-Patterns (Do Not Repeat)

| Anti-Pattern | Reason | Where Seen |
|-------------|--------|-----------|
| Custom driver/connector layer for each DB | Increases complexity, duplicates connection logic | Avoided in HFSQL design; reused ODBC |
| Hardcoded connection strings | Breaks portability, security risk | Not present in this implementation |
| Missing connection validation | Silent failures, poor UX | Included `testConnection()` in form |
| Inconsistent prop interface names | Breaks discovery, confuses contributors | HFSQLInputProps / HFSQLOutputProps follow convention |

---

## Code Generation Standards

All database input/output components generate Python code with:
1. Import statements (pyodbc, pandas, sqlalchemy as needed)
2. Connection string construction
3. Read (for inputs) or Write (for outputs) operation
4. Error handling wrapper (try/except for connectivity)

**Example HFSQL Input code generation**:
```python
import pyodbc
import pandas as pd

connection_string = 'Driver={HFSQL};Server=localhost;Database=MyDB;User=Admin;Password=pwd'
conn = pyodbc.connect(connection_string)
df = pd.read_sql("SELECT * FROM mytable", conn)
conn.close()
```

**Example HFSQL Output code generation**:
```python
import pyodbc

connection_string = 'Driver={HFSQL};Server=localhost;Database=MyDB;User=Admin;Password=pwd'
conn = pyodbc.connect(connection_string)
cursor = conn.cursor()
cursor.execute("INSERT INTO target_table VALUES (?)", [...])
conn.commit()
conn.close()
```
