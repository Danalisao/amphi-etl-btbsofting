import { databaseIcon } from '../../../icons';
import { BaseCoreComponent } from '../../BaseCoreComponent';

export class HFSQLOutput extends BaseCoreComponent {
    constructor() {
        const defaultConfig = {
            tsCFselectHFSQLMode: "client_server",
            tsCFinputHFSQLServer: "localhost",
            tsCFinputHFSQLPort: "4900",
            tsCFinputHFSQLDatabase: "",
            tsCFinputHFSQLUser: "",
            tsCFinputHFSQLPassword: "",
            tsCFinputHFSQLDataPath: "",
            tsCFinputHFSQLWDDPath: "",
            tsCFtableTableName: "",
            tsCFradioIfTableExists: "append"
        };
        const form = {
            idPrefix: "component__form",
            fields: [
                {
                    type: "select",
                    label: "Connection Mode",
                    id: "tsCFselectHFSQLMode",
                    options: [
                        { value: "client_server", label: "HFSQL Client/Server", tooltip: "Connect to a remote HFSQL server" },
                        { value: "classic", label: "HFSQL Classic", tooltip: "Connect to a local HFSQL database directory" }
                    ],
                    advanced: true
                },
                {
                    type: "input",
                    label: "Server",
                    id: "tsCFinputHFSQLServer",
                    placeholder: "localhost",
                    condition: { tsCFselectHFSQLMode: "client_server" },
                    advanced: true
                },
                {
                    type: "input",
                    label: "Port",
                    id: "tsCFinputHFSQLPort",
                    placeholder: "4900",
                    condition: { tsCFselectHFSQLMode: "client_server" },
                    advanced: true
                },
                {
                    type: "input",
                    label: "Database Name",
                    id: "tsCFinputHFSQLDatabase",
                    placeholder: "Enter database name",
                    condition: { tsCFselectHFSQLMode: "client_server" }
                },
                {
                    type: "input",
                    label: "Username",
                    id: "tsCFinputHFSQLUser",
                    placeholder: "Enter username",
                    condition: { tsCFselectHFSQLMode: "client_server" },
                    advanced: true
                },
                {
                    type: "input",
                    label: "Password",
                    id: "tsCFinputHFSQLPassword",
                    placeholder: "Enter password",
                    inputType: "password",
                    condition: { tsCFselectHFSQLMode: "client_server" },
                    advanced: true
                },
                {
                    type: "input",
                    label: "Data Directory Path",
                    id: "tsCFinputHFSQLDataPath",
                    placeholder: "C:\\path\\to\\data\\",
                    tooltip: "Path to the directory containing the HFSQL Classic database files",
                    condition: { tsCFselectHFSQLMode: "classic" }
                },
                {
                    type: "input",
                    label: "WDD File Path (optional)",
                    id: "tsCFinputHFSQLWDDPath",
                    placeholder: "C:\\path\\to\\database.wdd",
                    tooltip: "Optional path to the WDD analysis file for type resolution",
                    condition: { tsCFselectHFSQLMode: "classic" },
                    advanced: true
                },
                {
                    type: "input",
                    label: "Table Name",
                    id: "tsCFtableTableName",
                    placeholder: "Enter table name"
                },
                {
                    type: "radio",
                    label: "If Table Exists",
                    id: "tsCFradioIfTableExists",
                    options: [
                        { value: "fail", label: "Fail" },
                        { value: "replace", label: "Replace" },
                        { value: "append", label: "Append" }
                    ],
                    advanced: true
                },
                {
                    type: "info",
                    id: "tsCFinfoDriver",
                    text: "⚠️ Requires the PC-Soft HFSQL ODBC driver installed on the machine running Amphi. 'Replace' truncates the table before inserting.",
                    advanced: true
                }
            ],
        };
        const description = "Use HFSQL Output to write a DataFrame into a HFSQL Classic or Client/Server table via ODBC (pyodbc). Requires the PC-Soft HFSQL ODBC driver.";

        super("HFSQL Output", "hfsqlOutput", description, "pandas_df_output", [], "outputs.Databases", databaseIcon, defaultConfig, form);
    }

    public provideDependencies({ config }): string[] {
        return ['pyodbc'];
    }

    public provideImports({ config }): string[] {
        return [
            "import pandas as pd",
            "import pyodbc",
            "from typing import Optional"
        ];
    }

    public provideFunctions({ config }): string[] {
        const fn = `
def py_fn_hfsql_output_write(
    py_arg_df: pd.DataFrame,
    py_arg_mode: str,
    py_arg_table_name: str,
    py_arg_if_exists: str = "append",
    py_arg_server: Optional[str] = None,
    py_arg_port: Optional[str] = None,
    py_arg_database: Optional[str] = None,
    py_arg_user: Optional[str] = None,
    py_arg_password: Optional[str] = None,
    py_arg_data_path: Optional[str] = None,
    py_arg_wdd_path: Optional[str] = None
) -> None:
    """
    Write a pandas DataFrame to a HFSQL table via ODBC (pyodbc).
    Requires the PC-Soft HFSQL ODBC driver installed on the host.
    - py_arg_mode: "client_server" or "classic"
    - py_arg_if_exists: "fail" | "replace" | "append"
    """
    if py_arg_mode == "client_server":
        py_var_parts = ["Driver={WinDev HFSQL Client/Server};InterfaceVersion=3"]
        if py_arg_server:
            py_var_parts.append(f"Server={py_arg_server}")
        if py_arg_port:
            py_var_parts.append(f"Port={py_arg_port}")
        if py_arg_database:
            py_var_parts.append(f"Database={py_arg_database}")
        if py_arg_user:
            py_var_parts.append(f"UID={py_arg_user}")
        if py_arg_password:
            py_var_parts.append(f"PWD={py_arg_password}")
        py_var_conn_str = ";".join(py_var_parts) + ";"
    elif py_arg_mode == "classic":
        if not py_arg_data_path:
            raise ValueError("Data Directory Path is required for HFSQL Classic mode")
        py_var_parts = ["Driver={WinDev HFSQL Classic};InterfaceVersion=3"]
        py_var_parts.append(f"Database={py_arg_data_path}")
        if py_arg_wdd_path:
            py_var_parts.append(f"Description={py_arg_wdd_path}")
        py_var_conn_str = ";".join(py_var_parts) + ";"
    else:
        raise ValueError("py_arg_mode must be 'client_server' or 'classic'")

    py_var_conn = pyodbc.connect(py_var_conn_str, autocommit=False)
    py_var_cursor = py_var_conn.cursor()
    try:
        if py_arg_if_exists == "fail":
            py_var_cursor.execute(f"SELECT COUNT(*) FROM {py_arg_table_name}")
            if py_var_cursor.fetchone()[0] > 0:
                raise ValueError(f"Table '{py_arg_table_name}' already contains data and if_exists='fail'")
        elif py_arg_if_exists == "replace":
            py_var_cursor.execute(f"DELETE FROM {py_arg_table_name}")
        py_var_cols = ", ".join(py_arg_df.columns.tolist())
        py_var_placeholders = ", ".join(["?" for _ in py_arg_df.columns])
        py_var_sql = f"INSERT INTO {py_arg_table_name} ({py_var_cols}) VALUES ({py_var_placeholders})"
        py_var_rows = [tuple(row) for row in py_arg_df.itertuples(index=False, name=None)]
        py_var_cursor.executemany(py_var_sql, py_var_rows)
        py_var_conn.commit()
    except Exception:
        py_var_conn.rollback()
        raise
    finally:
        py_var_cursor.close()
        py_var_conn.close()
`;
        return [fn];
    }

    public generateComponentCode({ config, inputName }): string {
        const mode = config.tsCFselectHFSQLMode || "client_server";
        const server = (config.tsCFinputHFSQLServer && config.tsCFinputHFSQLServer.trim()) ? `"${config.tsCFinputHFSQLServer}"` : 'None';
        const port = (config.tsCFinputHFSQLPort && config.tsCFinputHFSQLPort.trim()) ? `"${config.tsCFinputHFSQLPort}"` : 'None';
        const database = (config.tsCFinputHFSQLDatabase && config.tsCFinputHFSQLDatabase.trim()) ? `"${config.tsCFinputHFSQLDatabase}"` : 'None';
        const user = (config.tsCFinputHFSQLUser && config.tsCFinputHFSQLUser.trim()) ? `"${config.tsCFinputHFSQLUser}"` : 'None';
        const password = (config.tsCFinputHFSQLPassword && config.tsCFinputHFSQLPassword.trim()) ? `"${config.tsCFinputHFSQLPassword}"` : 'None';
        const dataPath = (config.tsCFinputHFSQLDataPath && config.tsCFinputHFSQLDataPath.trim())
            ? `"${config.tsCFinputHFSQLDataPath.replace(/\\/g, '\\\\')}"`
            : 'None';
        const wddPath = (config.tsCFinputHFSQLWDDPath && config.tsCFinputHFSQLWDDPath.trim())
            ? `"${config.tsCFinputHFSQLWDDPath.replace(/\\/g, '\\\\')}"`
            : 'None';
        const rawTableName = config.tsCFtableTableName?.trim();
        if (!rawTableName) {
            return `# HFSQLOutput: 'Table Name' is required`;
        }
        const tableName = `"${rawTableName}"`;
        const ifExists = config.tsCFradioIfTableExists || "append";

        return `
py_fn_hfsql_output_write(
    py_arg_df=${inputName},
    py_arg_mode="${mode}",
    py_arg_table_name=${tableName},
    py_arg_if_exists="${ifExists}",
    py_arg_server=${server},
    py_arg_port=${port},
    py_arg_database=${database},
    py_arg_user=${user},
    py_arg_password=${password},
    py_arg_data_path=${dataPath},
    py_arg_wdd_path=${wddPath}
)
`;
    }
}
