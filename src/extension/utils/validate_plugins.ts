import Ajv, { ErrorObject, ValidateFunction } from 'ajv'
import schema from '../../plugin-schema.json'
import PluginManifest from 'extension/interfaces/pluginManifestI';

const ajv = new Ajv({ allErrors: true, strict: false });
const validateFn: ValidateFunction<PluginManifest> = ajv.compile<PluginManifest>(schema as object);

export function validatePlugin(
  manifest: PluginManifest
): { valid: boolean; errors?: ErrorObject[] } {
  const valid = validateFn(manifest);
  return {
    valid: Boolean(valid),
    errors: valid ? undefined : validateFn.errors?.slice()
  }
}


export function validatePlugins(
  manifests: PluginManifest[]
): {
  validPlugins: PluginManifest[];
  invalid: Array<{ manifest: any; errors: ErrorObject[] }>;
} {
  const validPlugins: PluginManifest[] = [];
  const invalid: Array<{ manifest: any; errors: ErrorObject[] }> = [];

  for (const manifest of manifests) {
    const result = validatePlugin(manifest);
    if (result.valid) {
      validPlugins.push(manifest as PluginManifest);
    } else {
      invalid.push({ manifest, errors: result.errors ?? [] });
    }
  }

  return { validPlugins, invalid };
}
