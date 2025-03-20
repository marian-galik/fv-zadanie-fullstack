/**
 * Delimiter used to separate hierarchical levels in node paths.
 * Used for splitting and joining node names in the hierarchy.
 */
export const DELIMITER = " > ";

/**
 * Path to the ImageNet XML source file.
 * Contains the raw hierarchical structure data.
 */
export const SOURCE_FILE_PATH = "src/data/structure_released.xml";

/**
 * Database table name for storing ImageNet hierarchy data.
 * Used in SQL queries and Prisma operations.
 */
export const DB_TABLE_IMAGE_NET = "imagenet";
