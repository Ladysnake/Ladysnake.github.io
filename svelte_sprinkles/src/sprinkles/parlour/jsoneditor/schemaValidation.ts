import type {JSONSchema} from "svelte-jsoneditor";

async function fetchSchema(downloadUrl: string, schemaName: string = downloadUrl): Promise<[string, JSONSchema]> {
  return fetch(downloadUrl).then(res => res.json()).then(schema => (
    [schemaName, schema]
  ));
}

function getSchemaName(path: string) {
  return `https://ladysnake.org/schemas/${path}.schema.json`;
}

async function fetchLadysnakeSchema(path: string): Promise<[string, JSONSchema]> {
  return fetchSchema(`/schemas/${path}.schema.json`, getSchemaName(path));
}

export enum KnownSchemas {
  TEXT_COMPONENT = 'https://raw.githubusercontent.com/Levertion/minecraft-json-schema/master/java/shared/text_component.json',
  DIALOGUE = 'https://ladysnake.org/schemas/blabber/dialogue.schema.json',
  DIALOGUE_ILLUSTRATION = 'https://ladysnake.org/schemas/blabber/dialogue_illustration.schema.json',
  ITEMSTACK = 'https://ladysnake.org/schemas/minecraft/itemstack.schema.json',
}

export const schemaDefinitions: Record<KnownSchemas, JSONSchema> = await Promise.all([
    fetchSchema(KnownSchemas.TEXT_COMPONENT),
    fetchLadysnakeSchema('blabber/dialogue'),
    fetchLadysnakeSchema('blabber/dialogue_illustration'),
    fetchLadysnakeSchema('minecraft/entity_selector'),
    fetchLadysnakeSchema('minecraft/identifier'),
    fetchLadysnakeSchema('minecraft/itemstack'),
    fetchLadysnakeSchema('minecraft/itemstack_v1'),
    fetchLadysnakeSchema('minecraft/itemstack_v2'),
]).then(Object.fromEntries).then(defs => ({
  // Add a dummy metaschema to avoid resolution issues from validators
  'https://json-schema.org/draft/2020-12/schema': {},
  ...defs,
}));
