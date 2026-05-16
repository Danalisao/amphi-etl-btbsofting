import { databaseIcon } from '../../../icons';
import { BaseCoreComponent } from '../../BaseCoreComponent';

export class HFSQLInput extends BaseCoreComponent {
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
            tsCFradioQueryMethod: "table",
            tsCFtableTableName: "",
            tsCFcodeTextareaSqlQuery: "",
            tsCFbooleanAutoCommit: true
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
                    type: "boolean",
                    label: "Auto Commit",
                    id: "tsCFbooleanAutoCommit",
                    advanced: true
                },
                {
                    type: "radio",
                    label: "Query Method",
                    id: "tsCFradioQueryMethod",
                    options: [
                        { value: "table", label: "Table Name" },
                        { value: "query", label: "SQL Query" }
                    ],
                    advanced: true
                },
                {
                    type: "input",
                    label: "Table Name",
                    id: "tsCFtableTableName",
                    placeholder: "Enter table name",
                    condition: { tsCFradioQueryMethod: "table" }
                },
                {
                    type: "codeTextarea",
                    label: "SQL Query",
                    height: '50px',
                    mode: "sql",
                    placeholder: 'SELECT * FROM table_name',
                    id: "tsCFcodeTextareaSqlQuery",
                    tooltip: 'Optional. By default the SQL query is: SELECT * FROM table_name_provided.',
                    condition: { tsCFradioQueryMethod: "query" },
                    advanced: true
                },
                {
                    type: "info",
                    id: "tsCFinfoDriver",
                    text: "⚠️ Requires the PC-Soft HFSQL ODBC driver installed on the machine running Amphi.",
                    advanced: true
                }
            ],
        };
        const description = "Use HFSQL Input to retrieve data from a HFSQL Classic or Client/Server database via ODBC (pyodbc). Requires the PC-Soft HFSQL ODBC driver.";

        super("HFSQL Input", "hfsqlInput", description, "pandas_df_input", [], "inputs.Databases", databaseIcon, defaultConfig, form);
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
def py_fn_hfsql_input_query(
    py_arg_mode: str,
    py_arg_server: Optional[str] = None,
    py_arg_port: Optional[str] = None,
    py_arg_database: Optional[str] = None,
    py_arg_user: Optional[str] = None,
    py_arg_password: Optional[str] = None,
    py_arg_data_path: Optional[str] = None,
    py_arg_wdd_path: Optional[str] = None,
    py_arg_autocommit: bool = True,
    py_arg_query_method: str = "table",
    py_arg_sql_query: Optional[str] = None,
    py_arg_table_name: Optional[str] = None
) -> pd.DataFrame:
    """
    Read from HFSQL via ODBC (pyodbc) and return a pandas DataFrame.
    Requires the PC-Soft HFSQL ODBC driver installed on the host.
    - py_arg_mode: "client_server" or "classic"
    - py_arg_query_method: "table" or "query"
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

    if py_arg_query_method == "query":
        if not py_arg_sql_query:
            raise ValueError("SQL query is required when Query Method='query'")
        py_var_query = py_arg_sql_query
    elif py_arg_query_method == "table":
        if not py_arg_table_name:
            raise ValueError("Table Name is required when Query Method='table'")
        py_var_query = f"SELECT * FROM {py_arg_table_name}"
    else:
        raise ValueError("py_arg_query_method must be 'query' or 'table'")

    py_var_conn = None
    try:
        py_var_conn = pyodbc.connect(py_var_conn_str, autocommit=py_arg_autocommit)
        py_df_result = pd.read_sql(py_var_query, py_var_conn).convert_dtypes()
        return py_df_result
    finally:
        if py_var_conn is not None:
            py_var_conn.close()
`;
        return [fn];
    }

    public generateComponentCode({ config, outputName }): string {
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
        const autocommit = config.tsCFbooleanAutoCommit ? 'True' : 'False';
        const queryMethod = config.tsCFradioQueryMethod ? `"${config.tsCFradioQueryMethod}"` : '"table"';

        let tableName = 'None';
        if (config.tsCFtableTableName && config.tsCFtableTableName.trim() && config.tsCFradioQueryMethod === 'table') {
            tableName = `"${config.tsCFtableTableName}"`;
        }

        let sqlQuery = 'None';
        if (config.tsCFcodeTextareaSqlQuery && config.tsCFcodeTextareaSqlQuery.trim() && config.tsCFradioQueryMethod === 'query') {
            const parsed = JSON.parse(config.tsCFcodeTextareaSqlQuery);
            const queryText = parsed.code?.trim();
            sqlQuery = `"${queryText}"`;
        }

        return `
${outputName} = py_fn_hfsql_input_query(
    py_arg_mode="${mode}",
    py_arg_server=${server},
    py_arg_port=${port},
    py_arg_database=${database},
    py_arg_user=${user},
    py_arg_password=${password},
    py_arg_data_path=${dataPath},
    py_arg_wdd_path=${wddPath},
    py_arg_autocommit=${autocommit},
    py_arg_query_method=${queryMethod},
    py_arg_sql_query=${sqlQuery},
    py_arg_table_name=${tableName}
)
`;
    }
}
