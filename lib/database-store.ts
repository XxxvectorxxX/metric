let databaseConfig: any = null

export function setDatabaseConfig(config: any) {
  databaseConfig = config
}

export function getDatabaseConfig() {
  return databaseConfig
}